import type {
  PropertyDetail,
  PropertyListItem,
  PropertyLocations,
} from "@portal-inmobiliario/shared-types";
import { getApiUrl } from "@/lib/get-api-url";

export type PropertyFilters = {
  search?: string;
  sort?: string;
  operation?: string;
  type?: string[];
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  minUsableArea?: string;
  commune?: string[];
  city?: string[];
  region?: string[];
};

export function buildFiltersQuery(filters: PropertyFilters) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item) {
          params.append(key, item);
        }
      }
    } else if (value) {
      params.set(key, value);
    }
  }

  return params.toString();
}

export async function fetchPublicProperties(
  filters: PropertyFilters = {},
): Promise<PropertyListItem[]> {
  const query = buildFiltersQuery(filters);
  const response = await fetch(`${getApiUrl()}/api/properties${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar las propiedades");
  }

  return response.json();
}

export async function fetchPublicPropertyById(id: string): Promise<PropertyDetail | null> {
  const response = await fetch(`${getApiUrl()}/api/properties/${id}`, { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("No se pudo cargar la propiedad");
  }

  return response.json();
}

export async function fetchPropertyLocations(): Promise<PropertyLocations> {
  const response = await fetch(`${getApiUrl()}/api/properties/locations`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("No se pudieron cargar las ubicaciones");
  }

  return response.json();
}
