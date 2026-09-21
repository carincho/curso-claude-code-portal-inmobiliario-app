import type { PropertyFeatureDTO } from "@portal-inmobiliario/shared-types";

export async function fetchFeatures(apiUrl: string): Promise<PropertyFeatureDTO[]> {
  const response = await fetch(`${apiUrl}/api/admin/features`, { credentials: "include" });

  if (!response.ok) {
    throw new Error("No se pudieron cargar las características");
  }

  return response.json();
}
