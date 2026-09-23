"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadImage, type UploadedImage } from "@/lib/admin-images-client";

export type ManagedImage = {
  id: string;
  url: string;
  isMain: boolean;
};

export function PropertyImagesManager({
  apiUrl,
  images,
  onAdd,
  onRemove,
  onSetMain,
  onReorder,
}: {
  apiUrl: string;
  images: ManagedImage[];
  onAdd: (uploaded: UploadedImage) => Promise<void> | void;
  onRemove: (imageId: string) => Promise<void> | void;
  onSetMain: (imageId: string) => Promise<void> | void;
  onReorder: (nextOrderIds: string[]) => Promise<void> | void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyImageId, setBusyImageId] = useState<string | null>(null);

  async function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) {
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      for (const file of Array.from(fileList)) {
        const uploaded = await uploadImage(apiUrl, file);
        await onAdd(uploaded);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudo subir la imagen");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemove(imageId: string) {
    if (!window.confirm("¿Eliminar esta imagen? Esta acción no se puede deshacer.")) {
      return;
    }

    setBusyImageId(imageId);

    try {
      await onRemove(imageId);
    } catch (removeError) {
      window.alert(
        removeError instanceof Error ? removeError.message : "No se pudo eliminar la imagen",
      );
    } finally {
      setBusyImageId(null);
    }
  }

  async function handleSetMain(imageId: string) {
    setBusyImageId(imageId);

    try {
      await onSetMain(imageId);
    } catch (setMainError) {
      window.alert(
        setMainError instanceof Error
          ? setMainError.message
          : "No se pudo marcar la imagen como principal",
      );
    } finally {
      setBusyImageId(null);
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    const next = [...images];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onReorder(next.map((image) => image.id));
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(event) => handleFilesSelected(event.target.files)}
        disabled={isUploading}
        className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border file:border-card-border file:bg-card file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:border-accent hover:file:text-accent"
      />
      {isUploading && <p className="mt-2 text-xs text-muted-foreground">Subiendo…</p>}
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}

      {images.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="overflow-hidden rounded-lg border border-card-border bg-card"
            >
              <div className="relative aspect-square w-full bg-background">
                <Image
                  src={image.url}
                  alt={`Imagen ${index + 1} de la propiedad`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                {image.isMain && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
                    Principal
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-1 p-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    aria-label="Mover antes"
                    title="Mover antes"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                    aria-label="Mover después"
                    title="Mover después"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-30"
                  >
                    →
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {!image.isMain && (
                    <button
                      type="button"
                      onClick={() => handleSetMain(image.id)}
                      disabled={busyImageId === image.id}
                      aria-label="Marcar como principal"
                      title="Marcar como principal"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                    >
                      ★
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(image.id)}
                    disabled={busyImageId === image.id}
                    aria-label="Eliminar imagen"
                    title="Eliminar imagen"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/10 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                  >
                    ×
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">Todavía no hay imágenes.</p>
      )}
    </div>
  );
}
