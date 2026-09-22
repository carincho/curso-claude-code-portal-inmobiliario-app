import type { UserDTO } from "@portal-inmobiliario/shared-types";
import type {
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
  AdminUserFilters,
} from "@/lib/admin-user-schema";
import { HttpError } from "@/lib/http-error";
import { hashPassword } from "@/lib/password";
import type { SessionPayload } from "@/lib/session";
import {
  createUserAdmin,
  findAllUsers,
  findUserByEmail,
  findUserById,
  updateUserAdmin,
} from "@/repositories/user.repository";
import type { User } from "@/generated/prisma/client";

function toAdminUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function listUsers(filters: AdminUserFilters): Promise<UserDTO[]> {
  const users = await findAllUsers(filters);
  return users.map(toAdminUserDTO);
}

export async function createUserAdminService(input: AdminCreateUserPayload): Promise<UserDTO> {
  const existing = await findUserByEmail(input.email);

  if (existing) {
    throw new HttpError(409, "Ya existe una cuenta con ese email");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUserAdmin({
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role,
  });

  return toAdminUserDTO(user);
}

export async function updateUserAdminService(
  targetId: string,
  actingSession: SessionPayload,
  input: AdminUpdateUserPayload,
): Promise<UserDTO> {
  const target = await findUserById(targetId);

  if (!target) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  const isSelf = targetId === actingSession.sub;

  if (isSelf && input.isActive === false) {
    throw new HttpError(400, "No puedes desactivar tu propia cuenta");
  }

  if (isSelf && input.role === "USER") {
    throw new HttpError(400, "No puedes cambiar tu propio rol");
  }

  if (input.email) {
    const existing = await findUserByEmail(input.email);

    if (existing && existing.id !== targetId) {
      throw new HttpError(409, "Ya existe una cuenta con ese email");
    }
  }

  const passwordHash = input.password ? await hashPassword(input.password) : undefined;

  const updated = await updateUserAdmin(targetId, {
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role,
    isActive: input.isActive,
  });

  return toAdminUserDTO(updated);
}
