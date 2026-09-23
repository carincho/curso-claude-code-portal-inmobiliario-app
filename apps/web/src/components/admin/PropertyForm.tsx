"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFlash } from "@/components/flash/FlashProvider";
import { FeaturesInput } from "@/components/admin/FeaturesInput";
import { PropertyImagesManager, type ManagedImage } from "@/components/admin/PropertyImagesManager";
import {
  createAdminProperty,
  fetchAdminProperty,
  updateAdminProperty,
} from "@/lib/admin-properties-client";
import { fetchFeatures } from "@/lib/admin-features-client";
import {
  attachPropertyImage,
  deletePropertyImage,
  reorderPropertyImages,
  setMainPropertyImage,
  type UploadedImage,
} from "@/lib/admin-images-client";
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "@/lib/property-labels";
import {
  numberToFormString,
  propertyFormSchema,
  propertyFormValuesToInput,
  type PropertyFormValues,
} from "@/lib/property-form-schema";

const fieldClassName =
  "w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";
const labelClassName = "mb-1 block text-xs font-medium text-muted-foreground";
const errorClassName = "mt-1 text-xs text-red-600";

const DEFAULT_VALUES: PropertyFormValues = {
  title: "",
  description: "",
  operationType: "SALE",
  propertyType: "HOUSE",
  price: "",
  usableArea: "",
  totalArea: "",
  bedrooms: "",
  bathrooms: "",
  parkingSpaces: "",
  age: "",
  address: "",
  commune: "",
  city: "",
  region: "",
  isPublished: false,
  isFeatured: false,
};

type PropertyFormProps =
  | { mode: "create" }
  | { mode: "edit"; propertyId: string };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-card-border bg-card p-6">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

type PendingImage = ManagedImage & { publicId: string };

export function PropertyForm(props: PropertyFormProps) {
  const router = useRouter();
  const { apiUrl } = useAuth();
  const { showFlash } = useFlash();
  const [features, setFeatures] = useState<string[]>([]);
  const [featureSuggestions, setFeatureSuggestions] = useState<string[]>([]);
  const [images, setImages] = useState<PendingImage[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(props.mode === "edit");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    let cancelled = false;

    fetchFeatures(apiUrl)
      .then((data) => {
        if (!cancelled) {
          setFeatureSuggestions(data.map((feature) => feature.name));
        }
      })
      .catch(() => {
        // Las sugerencias son un extra; si fallan, el input de texto libre sigue funcionando.
      });

    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const editingPropertyId = props.mode === "edit" ? props.propertyId : null;

  useEffect(() => {
    if (editingPropertyId === null) {
      return;
    }

    let cancelled = false;

    fetchAdminProperty(apiUrl, editingPropertyId)
      .then((property) => {
        if (cancelled) {
          return;
        }

        reset({
          title: property.title,
          description: property.description,
          operationType: property.operationType,
          propertyType: property.propertyType,
          price: numberToFormString(property.price),
          usableArea: numberToFormString(property.usableArea),
          totalArea: numberToFormString(property.totalArea),
          bedrooms: numberToFormString(property.bedrooms),
          bathrooms: numberToFormString(property.bathrooms),
          parkingSpaces: numberToFormString(property.parkingSpaces),
          age: numberToFormString(property.age),
          address: property.address,
          commune: property.commune,
          city: property.city,
          region: property.region,
          isPublished: property.isPublished,
          isFeatured: property.isFeatured,
        });
        setFeatures(property.features.map((feature) => feature.name));
        setImages(
          property.images.map((image) => ({
            id: image.id,
            url: image.url,
            isMain: image.isMain,
            publicId: "",
          })),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiUrl, editingPropertyId, reset]);

  async function handleAddImage(uploaded: UploadedImage) {
    if (editingPropertyId !== null) {
      const created = await attachPropertyImage(apiUrl, editingPropertyId, uploaded);
      setImages((prev) => [
        ...prev,
        { id: created.id, url: created.url, isMain: created.isMain, publicId: "" },
      ]);
      return;
    }

    const tempId = `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setImages((prev) => [
      ...prev,
      { id: tempId, url: uploaded.url, isMain: prev.length === 0, publicId: uploaded.publicId },
    ]);
  }

  async function handleRemoveImage(imageId: string) {
    if (editingPropertyId !== null) {
      await deletePropertyImage(apiUrl, editingPropertyId, imageId);
    }

    setImages((prev) => {
      const next = prev.filter((image) => image.id !== imageId);
      if (next.length > 0 && !next.some((image) => image.isMain)) {
        next[0] = { ...next[0], isMain: true };
      }
      return next;
    });
  }

  async function handleSetMainImage(imageId: string) {
    if (editingPropertyId !== null) {
      await setMainPropertyImage(apiUrl, editingPropertyId, imageId);
    }

    setImages((prev) => prev.map((image) => ({ ...image, isMain: image.id === imageId })));
  }

  async function handleReorderImages(nextOrderIds: string[]) {
    const next = nextOrderIds
      .map((id) => images.find((image) => image.id === id))
      .filter((image): image is PendingImage => Boolean(image));
    setImages(next);

    if (editingPropertyId !== null) {
      await reorderPropertyImages(apiUrl, editingPropertyId, nextOrderIds);
    }
  }

  async function attachPendingImages(propertyId: string) {
    let mainImageId: string | null = null;

    for (const image of images) {
      const created = await attachPropertyImage(apiUrl, propertyId, {
        url: image.url,
        publicId: image.publicId,
      });

      if (image.isMain) {
        mainImageId = created.id;
      }
    }

    if (mainImageId) {
      await setMainPropertyImage(apiUrl, propertyId, mainImageId);
    }
  }

  async function onSubmit(values: PropertyFormValues) {
    setServerError(null);

    const payload = propertyFormValuesToInput(values, features);

    try {
      if (props.mode === "edit") {
        const updated = await updateAdminProperty(apiUrl, props.propertyId, payload);
        showFlash("success", `Propiedad "${updated.title}" actualizada correctamente.`);
      } else {
        const created = await createAdminProperty(apiUrl, payload);
        await attachPendingImages(created.id);
        showFlash("success", `Propiedad "${created.title}" creada correctamente.`);
      }

      router.push("/admin/properties");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "No se pudieron guardar los cambios",
      );
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando…</p>;
  }

  if (loadError) {
    return (
      <div className="rounded-lg border border-dashed border-card-border bg-card p-6 text-center text-sm text-muted-foreground">
        No se pudo cargar la propiedad.{" "}
        <Link href="/admin/properties" className="font-medium text-accent hover:text-accent-hover">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Section title="Información general">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClassName}>
            Título
          </label>
          <input id="title" type="text" className={fieldClassName} {...register("title")} />
          {errors.title && <p className={errorClassName}>{errors.title.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClassName}>
            Descripción
          </label>
          <textarea
            id="description"
            rows={4}
            className={fieldClassName}
            {...register("description")}
          />
          {errors.description && <p className={errorClassName}>{errors.description.message}</p>}
        </div>
      </Section>

      <Section title="Operación y tipo">
        <div>
          <label htmlFor="operationType" className={labelClassName}>
            Operación
          </label>
          <select id="operationType" className={fieldClassName} {...register("operationType")}>
            {Object.entries(OPERATION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.operationType && (
            <p className={errorClassName}>{errors.operationType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="propertyType" className={labelClassName}>
            Tipo de propiedad
          </label>
          <select id="propertyType" className={fieldClassName} {...register("propertyType")}>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.propertyType && <p className={errorClassName}>{errors.propertyType.message}</p>}
        </div>
      </Section>

      <Section title="Precio y superficie">
        <div>
          <label htmlFor="price" className={labelClassName}>
            Precio (USD)
          </label>
          <input
            id="price"
            type="number"
            step="any"
            min={0}
            className={fieldClassName}
            {...register("price")}
          />
          {errors.price && <p className={errorClassName}>{errors.price.message}</p>}
        </div>

        <div />

        <div>
          <label htmlFor="usableArea" className={labelClassName}>
            Superficie útil (m²)
          </label>
          <input
            id="usableArea"
            type="number"
            step="any"
            min={0}
            className={fieldClassName}
            {...register("usableArea")}
          />
          {errors.usableArea && <p className={errorClassName}>{errors.usableArea.message}</p>}
        </div>

        <div>
          <label htmlFor="totalArea" className={labelClassName}>
            Superficie total (m²)
          </label>
          <input
            id="totalArea"
            type="number"
            step="any"
            min={0}
            className={fieldClassName}
            {...register("totalArea")}
          />
          {errors.totalArea && <p className={errorClassName}>{errors.totalArea.message}</p>}
        </div>
      </Section>

      <Section title="Detalles">
        <div>
          <label htmlFor="bedrooms" className={labelClassName}>
            Dormitorios
          </label>
          <input
            id="bedrooms"
            type="number"
            step="1"
            min={0}
            className={fieldClassName}
            {...register("bedrooms")}
          />
          {errors.bedrooms && <p className={errorClassName}>{errors.bedrooms.message}</p>}
        </div>

        <div>
          <label htmlFor="bathrooms" className={labelClassName}>
            Baños
          </label>
          <input
            id="bathrooms"
            type="number"
            step="1"
            min={0}
            className={fieldClassName}
            {...register("bathrooms")}
          />
          {errors.bathrooms && <p className={errorClassName}>{errors.bathrooms.message}</p>}
        </div>

        <div>
          <label htmlFor="parkingSpaces" className={labelClassName}>
            Estacionamientos
          </label>
          <input
            id="parkingSpaces"
            type="number"
            step="1"
            min={0}
            className={fieldClassName}
            {...register("parkingSpaces")}
          />
          {errors.parkingSpaces && (
            <p className={errorClassName}>{errors.parkingSpaces.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="age" className={labelClassName}>
            Antigüedad (años)
          </label>
          <input
            id="age"
            type="number"
            step="1"
            min={0}
            className={fieldClassName}
            {...register("age")}
          />
          {errors.age && <p className={errorClassName}>{errors.age.message}</p>}
        </div>
      </Section>

      <Section title="Ubicación">
        <div className="sm:col-span-2">
          <label htmlFor="address" className={labelClassName}>
            Dirección
          </label>
          <input id="address" type="text" className={fieldClassName} {...register("address")} />
          {errors.address && <p className={errorClassName}>{errors.address.message}</p>}
        </div>

        <div>
          <label htmlFor="commune" className={labelClassName}>
            Comuna
          </label>
          <input id="commune" type="text" className={fieldClassName} {...register("commune")} />
          {errors.commune && <p className={errorClassName}>{errors.commune.message}</p>}
        </div>

        <div>
          <label htmlFor="city" className={labelClassName}>
            Ciudad
          </label>
          <input id="city" type="text" className={fieldClassName} {...register("city")} />
          {errors.city && <p className={errorClassName}>{errors.city.message}</p>}
        </div>

        <div>
          <label htmlFor="region" className={labelClassName}>
            Región
          </label>
          <input id="region" type="text" className={fieldClassName} {...register("region")} />
          {errors.region && <p className={errorClassName}>{errors.region.message}</p>}
        </div>
      </Section>

      <section className="rounded-lg border border-card-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground">Imágenes</h2>
        <div className="mt-4">
          <PropertyImagesManager
            apiUrl={apiUrl}
            images={images}
            onAdd={handleAddImage}
            onRemove={handleRemoveImage}
            onSetMain={handleSetMainImage}
            onReorder={handleReorderImages}
          />
        </div>
      </section>

      <section className="rounded-lg border border-card-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground">Características</h2>
        <div className="mt-4">
          <label htmlFor="features" className={labelClassName}>
            Amenities y características del inmueble
          </label>
          <FeaturesInput
            id="features"
            value={features}
            onChange={setFeatures}
            suggestions={featureSuggestions}
          />
        </div>
      </section>

      <section className="rounded-lg border border-card-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground">Estado</h2>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-card-border text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              {...register("isPublished")}
            />
            Publicada (visible en el sitio público)
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-card-border text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              {...register("isFeatured")}
            />
            Destacada (aparece en la sección de destacadas)
          </label>
        </div>
      </section>

      {serverError && (
        <p role="alert" className="text-sm text-red-600">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Guardando…" : "Guardar propiedad"}
        </button>
        <Link
          href="/admin/properties"
          className="text-sm font-medium text-muted-foreground hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
