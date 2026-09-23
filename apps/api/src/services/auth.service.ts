import type { UserDTO } from "@portal-inmobiliario/shared-types";
import { HttpError } from "@/lib/http-error";
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from "@/lib/auth-schema";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSessionToken } from "@/lib/session";
import {
  clearFailedLogins,
  createUser,
  findUserByEmail,
  findUserById,
  registerFailedLogin,
  updateUser,
} from "@/repositories/user.repository";
import type { User } from "@/generated/prisma/client";

const INVALID_CREDENTIALS_MESSAGE = "Credenciales inválidas";
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function registerUser(
  input: RegisterPayload,
): Promise<{ user: UserDTO; token: string }> {
  const existing = await findUserByEmail(input.email);

  if (existing) {
    throw new HttpError(409, "Ya existe una cuenta con ese email");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUser({ name: input.name, email: input.email, passwordHash });
  const token = await createSessionToken({ sub: user.id, role: user.role });

  return { user: toUserDTO(user), token };
}

export async function loginUser(
  input: LoginPayload,
): Promise<{ user: UserDTO; token: string }> {
  const user = await findUserByEmail(input.email);

  if (!user || !user.isActive) {
    throw new HttpError(401, INVALID_CREDENTIALS_MESSAGE);
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60_000);
    throw new HttpError(
      429,
      `Demasiados intentos fallidos. Intenta nuevamente en ${minutesLeft} ${minutesLeft === 1 ? "minuto" : "minutos"}.`,
    );
  }

  const isValidPassword = await verifyPassword(input.password, user.passwordHash);

  if (!isValidPassword) {
    const attempts = user.failedLoginAttempts + 1;

    if (attempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
      await registerFailedLogin(user.id, 0, new Date(Date.now() + LOCKOUT_DURATION_MS));
      throw new HttpError(429, "Demasiados intentos fallidos. Intenta nuevamente en 15 minutos.");
    }

    await registerFailedLogin(user.id, attempts, null);
    throw new HttpError(401, INVALID_CREDENTIALS_MESSAGE);
  }

  if (user.failedLoginAttempts > 0 || user.lockedUntil) {
    await clearFailedLogins(user.id);
  }

  const token = await createSessionToken({ sub: user.id, role: user.role });

  return { user: toUserDTO(user), token };
}

export async function getAuthenticatedUser(userId: string): Promise<UserDTO> {
  const user = await findUserById(userId);

  if (!user || !user.isActive) {
    throw new HttpError(401, "No autenticado");
  }

  return toUserDTO(user);
}

export async function updateUserProfile(
  userId: string,
  input: UpdateProfilePayload,
): Promise<UserDTO> {
  const existing = await findUserByEmail(input.email);

  if (existing && existing.id !== userId) {
    throw new HttpError(409, "Ya existe una cuenta con ese email");
  }

  const passwordHash = input.password ? await hashPassword(input.password) : undefined;
  const user = await updateUser(userId, { name: input.name, email: input.email, passwordHash });
  return toUserDTO(user);
}
