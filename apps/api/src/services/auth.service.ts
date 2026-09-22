import type { UserDTO } from "@portal-inmobiliario/shared-types";
import { HttpError } from "@/lib/http-error";
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from "@/lib/auth-schema";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSessionToken } from "@/lib/session";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
} from "@/repositories/user.repository";
import type { User } from "@/generated/prisma/client";

const INVALID_CREDENTIALS_MESSAGE = "Credenciales inválidas";

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

  const isValidPassword = await verifyPassword(input.password, user.passwordHash);

  if (!isValidPassword) {
    throw new HttpError(401, INVALID_CREDENTIALS_MESSAGE);
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
