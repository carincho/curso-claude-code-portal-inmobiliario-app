import type { DashboardStatsDTO } from "@portal-inmobiliario/shared-types";

export async function fetchDashboardStats(apiUrl: string): Promise<DashboardStatsDTO> {
  const response = await fetch(`${apiUrl}/api/admin/dashboard`, { credentials: "include" });

  if (!response.ok) {
    throw new Error("No se pudieron cargar los indicadores");
  }

  return response.json();
}
