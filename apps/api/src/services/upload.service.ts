import { CLOUDINARY_PROPERTIES_FOLDER, getCloudinary } from "@/lib/cloudinary";
import { HttpError } from "@/lib/http-error";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export type UploadedImage = {
  url: string;
  publicId: string;
};

export async function uploadPropertyImage(file: File): Promise<UploadedImage> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new HttpError(400, "Formato de imagen no permitido. Usa JPEG, PNG o WEBP.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new HttpError(400, "La imagen supera el tamaño máximo permitido (5 MB).");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const cloudinary = getCloudinary();

  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: CLOUDINARY_PROPERTIES_FOLDER, resource_type: "image" },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary no devolvió un resultado"));
            return;
          }

          resolve(uploadResult);
        },
      );

      uploadStream.end(buffer);
    },
  );

  return { url: result.secure_url, publicId: result.public_id };
}
