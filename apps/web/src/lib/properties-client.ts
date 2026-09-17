import type { PropertyListItem } from "@portal-inmobiliario/shared-types";
import { getApiUrl } from "@/lib/get-api-url";

export async function fetchPublicProperties(): Promise<PropertyListItem[]> {
  const response = await fetch(`${getApiUrl()}/api/properties`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("No se pudieron cargar las propiedades");
  }

  return response.json();
}
