import type { FeatureDTO } from "@portal-inmobiliario/shared-types";

async function parseFeatureResponse(response: Response): Promise<FeatureDTO> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo completar la operación");
  }

  return response.json();
}

export async function fetchFeatures(apiUrl: string): Promise<FeatureDTO[]> {
  const response = await fetch(`${apiUrl}/api/admin/features`, { credentials: "include" });

  if (!response.ok) {
    throw new Error("No se pudieron cargar las características");
  }

  return response.json();
}

export async function createFeature(apiUrl: string, name: string): Promise<FeatureDTO> {
  const response = await fetch(`${apiUrl}/api/admin/features`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  return parseFeatureResponse(response);
}

export async function renameFeature(
  apiUrl: string,
  id: string,
  name: string,
): Promise<FeatureDTO> {
  const response = await fetch(`${apiUrl}/api/admin/features/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  return parseFeatureResponse(response);
}

export async function deleteFeature(apiUrl: string, id: string): Promise<void> {
  const response = await fetch(`${apiUrl}/api/admin/features/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo eliminar la característica");
  }
}
