import { prisma } from "@/lib/prisma";
import type { AttachPropertyImagePayload } from "@/lib/property-image-schema";

export function findImagesByPropertyId(propertyId: string) {
  return prisma.propertyImage.findMany({
    where: { propertyId },
    orderBy: { position: "asc" },
  });
}

export function findPropertyImageById(id: string) {
  return prisma.propertyImage.findUnique({ where: { id } });
}

export async function createPropertyImage(
  propertyId: string,
  data: AttachPropertyImagePayload,
) {
  const count = await prisma.propertyImage.count({ where: { propertyId } });

  return prisma.propertyImage.create({
    data: {
      propertyId,
      url: data.url,
      publicId: data.publicId,
      position: count,
      isMain: count === 0,
    },
  });
}

export function deletePropertyImage(id: string) {
  return prisma.propertyImage.delete({ where: { id } });
}

export async function promoteFirstImageToMain(propertyId: string) {
  const first = await prisma.propertyImage.findFirst({
    where: { propertyId },
    orderBy: { position: "asc" },
  });

  if (first) {
    await prisma.propertyImage.update({ where: { id: first.id }, data: { isMain: true } });
  }
}

export async function setMainPropertyImage(propertyId: string, imageId: string) {
  await prisma.$transaction([
    prisma.propertyImage.updateMany({ where: { propertyId }, data: { isMain: false } }),
    prisma.propertyImage.update({ where: { id: imageId }, data: { isMain: true } }),
  ]);
}

export async function reorderPropertyImages(imageIds: string[]) {
  await prisma.$transaction(
    imageIds.map((id, index) =>
      prisma.propertyImage.update({ where: { id }, data: { position: index } }),
    ),
  );
}
