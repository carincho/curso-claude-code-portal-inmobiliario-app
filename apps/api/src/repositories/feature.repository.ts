import { prisma } from "@/lib/prisma";

export function findAllFeatures() {
  return prisma.feature.findMany({ orderBy: { name: "asc" } });
}
