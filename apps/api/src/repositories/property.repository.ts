import { prisma } from "@/lib/prisma";

const publicPropertyInclude = {
  images: { orderBy: { position: "asc" as const } },
  features: true,
};

export function findPublishedProperties() {
  return prisma.property.findMany({
    where: { isPublished: true },
    include: publicPropertyInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function findPublishedPropertyById(id: string) {
  return prisma.property.findFirst({
    where: { id, isPublished: true },
    include: publicPropertyInclude,
  });
}

export type PublishedProperty = NonNullable<
  Awaited<ReturnType<typeof findPublishedPropertyById>>
>;
