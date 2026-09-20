"use client";

import type { DashboardStatsDTO } from "@portal-inmobiliario/shared-types";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchDashboardStats } from "@/lib/dashboard-client";

const INDICATORS: { key: keyof DashboardStatsDTO; label: string }[] = [
  { key: "totalProperties", label: "Total de propiedades" },
  { key: "publishedProperties", label: "Propiedades publicadas" },
  { key: "propertiesForSale", label: "Propiedades en venta" },
  { key: "propertiesForRent", label: "Propiedades en arriendo" },
  { key: "totalUsers", label: "Usuarios" },
  { key: "totalInquiries", label: "Consultas" },
];

export function AdminDashboardContent() {
  const { apiUrl } = useAuth();
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchDashboardStats(apiUrl)
      .then((data) => {
        if (!cancelled) {
          setStats(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Panel de administración</h1>

      <div className="mt-6">
        {error && (
          <p className="text-sm text-red-600">No se pudieron cargar los indicadores.</p>
        )}

        {!error && stats === null && <p className="text-sm text-muted-foreground">Cargando…</p>}

        {!error && stats !== null && (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INDICATORS.map((indicator) => (
              <div
                key={indicator.key}
                className="rounded-lg border border-card-border bg-card p-6"
              >
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {indicator.label}
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-accent">
                  {stats[indicator.key]}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
