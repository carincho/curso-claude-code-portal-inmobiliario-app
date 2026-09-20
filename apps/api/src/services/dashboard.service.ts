import type { DashboardStatsDTO } from "@portal-inmobiliario/shared-types";
import { getDashboardCounts } from "@/repositories/dashboard.repository";

export async function getDashboardStats(): Promise<DashboardStatsDTO> {
  return getDashboardCounts();
}
