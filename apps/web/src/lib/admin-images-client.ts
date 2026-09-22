import type { PropertyImageDTO } from "@portal-inmobiliario/shared-types";

export type UploadedImage = {
  url: string;
  publicId: string;
};

async function parseJsonOrThrow<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? fallbackMessage);
  }

  return response.json();
}

export async function uploadImage(apiUrl: string, file: File): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiUrl}/api/admin/uploads`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return parseJsonOrThrow(response, "No se pudo subir la imagen");
}

export async function attachPropertyImage(
  apiUrl: string,
  propertyId: string,
  input: UploadedImage,
): Promise<PropertyImageDTO> {
  const response = await fetch(`${apiUrl}/api/admin/properties/${propertyId}/images`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseJsonOrThrow(response, "No se pudo asociar la imagen a la propiedad");
}

export async function deletePropertyImage(
  apiUrl: string,
  propertyId: string,
  imageId: string,
): Promise<void> {
  const response = await fetch(
    `${apiUrl}/api/admin/properties/${propertyId}/images/${imageId}`,
    { method: "DELETE", credentials: "include" },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo eliminar la imagen");
  }
}

export async function setMainPropertyImage(
  apiUrl: string,
  propertyId: string,
  imageId: string,
): Promise<void> {
  const response = await fetch(
    `${apiUrl}/api/admin/properties/${propertyId}/images/${imageId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isMain: true }),
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo marcar la imagen como principal");
  }
}

export async function reorderPropertyImages(
  apiUrl: string,
  propertyId: string,
  imageIds: string[],
): Promise<void> {
  const response = await fetch(
    `${apiUrl}/api/admin/properties/${propertyId}/images-reorder`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageIds }),
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo reordenar las imágenes");
  }
}
