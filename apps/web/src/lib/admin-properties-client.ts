import type {
  PropertyDetail,
  PropertyInput,
  PropertyListItem,
} from "@portal-inmobiliario/shared-types";
import type { PropertyFilters } from "@/lib/properties-client";
import { buildFiltersQuery } from "@/lib/properties-client";

export type AdminPropertyFilters = PropertyFilters & {
  status?: string;
  createdFrom?: string;
  createdTo?: string;
};

async function parsePropertyResponse(response: Response): Promise<PropertyDetail> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo completar la operación");
  }

  return response.json();
}

export async function fetchAdminProperties(
  apiUrl: string,
  filters: AdminPropertyFilters = {},
): Promise<PropertyListItem[]> {
  const query = buildFiltersQuery(filters);
  const response = await fetch(
    `${apiUrl}/api/admin/properties${query ? `?${query}` : ""}`,
    { credentials: "include" },
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar las propiedades");
  }

  return response.json();
}

export async function fetchAdminProperty(apiUrl: string, id: string): Promise<PropertyDetail> {
  const response = await fetch(`${apiUrl}/api/admin/properties/${id}`, {
    credentials: "include",
  });

  return parsePropertyResponse(response);
}

export async function createAdminProperty(
  apiUrl: string,
  input: PropertyInput,
): Promise<PropertyDetail> {
  const response = await fetch(`${apiUrl}/api/admin/properties`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parsePropertyResponse(response);
}

export async function updateAdminProperty(
  apiUrl: string,
  id: string,
  input: PropertyInput,
): Promise<PropertyDetail> {
  const response = await fetch(`${apiUrl}/api/admin/properties/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parsePropertyResponse(response);
}

export async function deleteAdminProperty(apiUrl: string, id: string): Promise<void> {
  const response = await fetch(`${apiUrl}/api/admin/properties/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo eliminar la propiedad");
  }
}
