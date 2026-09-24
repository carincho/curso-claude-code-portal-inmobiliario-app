import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PropertyFiltersSidebar } from "@/components/properties/PropertyFiltersSidebar";
import { PropertyResults } from "@/components/properties/PropertyResults";
import { PropertyResultsSkeleton } from "@/components/properties/PropertyResultsSkeleton";
import {
  buildFiltersQuery,
  fetchPropertyLocations,
  type PropertyFilters,
} from "@/lib/properties-client";

export const metadata: Metadata = {
  title: "Propiedades | Portal Inmobiliario",
  description: "Explora propiedades publicadas en venta y arriendo en México.",
};

const SINGLE_KEYS = [
  "search",
  "operation",
  "minPrice",
  "maxPrice",
  "bedrooms",
  "bathrooms",
  "minUsableArea",
] as const;

const MULTI_KEYS = ["type", "commune", "city", "region"] as const;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function toValues(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  const list = Array.isArray(value) ? value : [value];
  return list.map((item) => item.trim()).filter(Boolean);
}

export default async function PropertiesPage(props: PageProps<"/properties">) {
  const rawSearchParams = await props.searchParams;

  const filters: PropertyFilters = {};
  let hasEmptyParams = false;

  for (const key of SINGLE_KEYS) {
    const raw = firstValue(rawSearchParams[key]);
    const value = raw?.trim();
    if (value) {
      filters[key] = value;
    } else if (raw !== undefined) {
      hasEmptyParams = true;
    }
  }

  // "newest" es el orden por defecto: lo omitimos de la URL para mantenerla limpia.
  const rawSort = firstValue(rawSearchParams.sort)?.trim();
  if (rawSort && rawSort !== "newest") {
    filters.sort = rawSort;
  } else if (rawSort !== undefined) {
    hasEmptyParams = true;
  }

  // La página 1 es la de por defecto: la omitimos de la URL para mantenerla limpia.
  const rawPage = firstValue(rawSearchParams.page)?.trim();
  if (rawPage && rawPage !== "1") {
    filters.page = rawPage;
  } else if (rawPage !== undefined) {
    hasEmptyParams = true;
  }

  for (const key of MULTI_KEYS) {
    const rawValue = rawSearchParams[key];
    const cleaned = toValues(rawValue);
    if (cleaned.length > 0) {
      filters[key] = cleaned;
    }
    if (rawValue !== undefined) {
      const rawCount = Array.isArray(rawValue) ? rawValue.length : 1;
      if (rawCount !== cleaned.length) {
        hasEmptyParams = true;
      }
    }
  }

  // El formulario HTML nativo envía todos los campos, incluso vacíos.
  // Redirigimos a la URL sin esos parámetros para mantenerla limpia y compartible.
  if (hasEmptyParams) {
    const cleanQuery = buildFiltersQuery(filters);
    redirect(cleanQuery ? `/properties?${cleanQuery}` : "/properties");
  }

  const locations = await fetchPropertyLocations();

  const { search } = filters;
  const hasOtherFilters = [...SINGLE_KEYS, ...MULTI_KEYS].some((key) => {
    if (key === "search") return false;
    const value = filters[key];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });
  const hasAnyFilter = Boolean(search) || hasOtherFilters;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Propiedades</h1>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <PropertyFiltersSidebar defaultValues={filters} locations={locations} />

        <div className="min-w-0 flex-1">
          <Suspense fallback={<PropertyResultsSkeleton />}>
            <PropertyResults
              filters={filters}
              hasOtherFilters={hasOtherFilters}
              hasAnyFilter={hasAnyFilter}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
