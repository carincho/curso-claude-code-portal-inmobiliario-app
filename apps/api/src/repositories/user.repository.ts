import type { Role } from "@portal-inmobiliario/shared-types";
import { prisma } from "@/lib/prisma";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function createUser(data: { name: string; email: string; passwordHash: string }) {
  return prisma.user.create({ data });
}

export function updateUser(
  id: string,
  data: { name: string; email: string; passwordHash?: string },
) {
  return prisma.user.update({ where: { id }, data });
}

export function findAllUsers(filters: { search?: string; role?: Role }) {
  return prisma.user.findMany({
    where: {
      ...(filters.role ? { role: filters.role } : {}),
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" as const } },
              { email: { contains: filters.search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export function createUserAdmin(data: {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}) {
  return prisma.user.create({ data });
}

export function updateUserAdmin(
  id: string,
  data: {
    name?: string;
    email?: string;
    passwordHash?: string;
    role?: Role;
    isActive?: boolean;
  },
) {
  return prisma.user.update({ where: { id }, data });
}
