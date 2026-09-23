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

export function registerFailedLogin(id: string, failedLoginAttempts: number, lockedUntil: Date | null) {
  return prisma.user.update({ where: { id }, data: { failedLoginAttempts, lockedUntil } });
}

export function clearFailedLogins(id: string) {
  return prisma.user.update({ where: { id }, data: { failedLoginAttempts: 0, lockedUntil: null } });
}

async function findUserIdsMatchingSearch(search: string): Promise<string[]> {
  const pattern = `%${search}%`;
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM users
    WHERE unaccent(name) ILIKE unaccent(${pattern})
       OR unaccent(email) ILIKE unaccent(${pattern})
  `;

  return rows.map((row) => row.id);
}

export async function findAllUsers(filters: { search?: string; role?: Role }) {
  return prisma.user.findMany({
    where: {
      ...(filters.role ? { role: filters.role } : {}),
      ...(filters.search ? { id: { in: await findUserIdsMatchingSearch(filters.search) } } : {}),
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
