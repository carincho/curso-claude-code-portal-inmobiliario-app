import type { PropertyImageDTO } from "@portal-inmobiliario/shared-types";
import { getCloudinary } from "@/lib/cloudinary";
import { HttpError } from "@/lib/http-error";
import type { AttachPropertyImagePayload } from "@/lib/property-image-schema";
import {
  createPropertyImage,
  deletePropertyImage,
  findImagesByPropertyId,
  findPropertyImageById,
  promoteFirstImageToMain,
  reorderPropertyImages,
  setMainPropertyImage,
} from "@/repositories/property-image.repository";
import { findPropertyById } from "@/repositories/property.repository";

function toImageDTO(image: {
  id: string;
  url: string;
  position: number;
  isMain: boolean;
}): PropertyImageDTO {
  return { id: image.id, url: image.url, position: image.position, isMain: image.isMain };
}

async function requirePropertyImage(propertyId: string, imageId: string) {
  const image = await findPropertyImageById(imageId);

  if (!image || image.propertyId !== propertyId) {
    throw new HttpError(404, "Imagen no encontrada");
  }

  return image;
}

export async function addPropertyImage(
  propertyId: string,
  input: AttachPropertyImagePayload,
): Promise<PropertyImageDTO> {
  const property = await findPropertyById(propertyId);

  if (!property) {
    throw new HttpError(404, "Propiedad no encontrada");
  }

  const image = await createPropertyImage(propertyId, input);
  return toImageDTO(image);
}

export async function removePropertyImage(propertyId: string, imageId: string): Promise<void> {
  const image = await requirePropertyImage(propertyId, imageId);

  const cloudinary = getCloudinary();
  await cloudinary.uploader.destroy(image.publicId).catch(() => {
    // Si Cloudinary ya no tiene el recurso (p. ej. borrado manual), igual limpiamos PostgreSQL.
  });

  await deletePropertyImage(imageId);

  if (image.isMain) {
    await promoteFirstImageToMain(propertyId);
  }
}

export async function setPropertyMainImage(propertyId: string, imageId: string): Promise<void> {
  await requirePropertyImage(propertyId, imageId);
  await setMainPropertyImage(propertyId, imageId);
}

export async function reorderPropertyImagesService(
  propertyId: string,
  imageIds: string[],
): Promise<void> {
  const images = await findImagesByPropertyId(propertyId);
  const currentIds = new Set(images.map((image) => image.id));

  if (imageIds.length !== images.length || !imageIds.every((id) => currentIds.has(id))) {
    throw new HttpError(400, "La lista de imágenes no coincide con las imágenes de la propiedad");
  }

  await reorderPropertyImages(imageIds);
}
