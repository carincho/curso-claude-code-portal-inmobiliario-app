import type { PropertyListItem } from "@portal-inmobiliario/shared-types";

export async function fetchFavorites(apiUrl: string): Promise<PropertyListItem[]> {
  const response = await fetch(`${apiUrl}/api/favorites`, { credentials: "include" });

  if (!response.ok) {
    throw new Error("No se pudieron cargar tus favoritos");
  }

  return response.json();
}

export async function addFavorite(apiUrl: string, propertyId: string): Promise<void> {
  const response = await fetch(`${apiUrl}/api/favorites/${propertyId}`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar como favorita");
  }
}

export async function removeFavorite(apiUrl: string, propertyId: string): Promise<void> {
  const response = await fetch(`${apiUrl}/api/favorites/${propertyId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar de favoritos");
  }
}
