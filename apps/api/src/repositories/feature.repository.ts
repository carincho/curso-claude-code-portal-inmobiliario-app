import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export function findAllFeaturesWithUsage() {
  return prisma.feature.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { properties: true } } },
  });
}

export function findFeatureById(id: string) {
  return prisma.feature.findUnique({ where: { id } });
}

export function createFeature(name: string) {
  return prisma.feature.create({
    data: { name },
    include: { _count: { select: { properties: true } } },
  });
}

export async function renameFeature(id: string, name: string) {
  try {
    return await prisma.feature.update({
      where: { id },
      data: { name },
      include: { _count: { select: { properties: true } } },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null;
    }
    throw error;
  }
}

export async function deleteFeature(id: string): Promise<boolean> {
  try {
    await prisma.feature.delete({ where: { id } });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return false;
    }
    throw error;
  }
}
