import { prisma } from "@/lib/prisma";
import { listPropertyInclude } from "@/repositories/property.repository";

export function findFavoritesByUserId(userId: string) {
  return prisma.favorite.findMany({
    where: { userId, property: { deletedAt: null } },
    include: { property: { include: listPropertyInclude } },
    orderBy: { createdAt: "desc" },
  });
}

export function findFavorite(userId: string, propertyId: string) {
  return prisma.favorite.findUnique({
    where: { userId_propertyId: { userId, propertyId } },
  });
}

export function createFavorite(userId: string, propertyId: string) {
  return prisma.favorite.create({ data: { userId, propertyId } });
}

export function deleteFavorite(userId: string, propertyId: string) {
  return prisma.favorite.deleteMany({ where: { userId, propertyId } });
}
