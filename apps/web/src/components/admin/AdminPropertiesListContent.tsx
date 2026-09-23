"use client";

import type { PropertyListItem } from "@portal-inmobiliario/shared-types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFlash } from "@/components/flash/FlashProvider";
import {
  AdminPropertiesFilterPanel,
  countActiveFilters,
  EMPTY_PROPERTIES_FILTER_DRAFT,
  type PropertiesFilterDraft,
} from "@/components/admin/AdminPropertiesFilterPanel";
import { deleteAdminProperty, fetchAdminProperties } from "@/lib/admin-properties-client";
import { formatDate, formatPrice } from "@/lib/format";
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "@/lib/property-labels";

const inputClassName =
  "w-full max-w-sm rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";

function FilterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M6 12h12M10.5 19.5h3" />
    </svg>
  );
}

export function AdminPropertiesListContent() {
  const { apiUrl } = useAuth();
  const { showFlash } = useFlash();
  const [properties, setProperties] = useState<PropertyListItem[] | null>(null);
  const [error, setError] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filterDraft, setFilterDraft] = useState<PropertiesFilterDraft>(
    EMPTY_PROPERTIES_FILTER_DRAFT,
  );
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<PropertiesFilterDraft>(
    EMPTY_PROPERTIES_FILTER_DRAFT,
  );
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAppliedSearch(searchInput.trim());
      setAppliedFilters(filterDraft);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput, filterDraft]);

  useEffect(() => {
    let cancelled = false;

    fetchAdminProperties(apiUrl, {
      search: appliedSearch || undefined,
      minPrice: appliedFilters.minPrice || undefined,
      maxPrice: appliedFilters.maxPrice || undefined,
      status: appliedFilters.status || undefined,
      operation: appliedFilters.operation || undefined,
      type: appliedFilters.type.length > 0 ? appliedFilters.type : undefined,
      createdFrom: appliedFilters.createdFrom || undefined,
      createdTo: appliedFilters.createdTo || undefined,
    })
      .then((data) => {
        if (!cancelled) {
          setProperties(data);
          setError(false);
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
  }, [apiUrl, appliedSearch, appliedFilters, reloadKey]);

  async function handleDelete(property: PropertyListItem) {
    if (!window.confirm(`¿Eliminar "${property.title}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingId(property.id);

    try {
      await deleteAdminProperty(apiUrl, property.id);
      setReloadKey((key) => key + 1);
      showFlash("success", `Propiedad "${property.title}" eliminada correctamente.`);
    } catch (deleteError) {
      window.alert(
        deleteError instanceof Error ? deleteError.message : "No se pudo eliminar la propiedad",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const activeFilterCount = countActiveFilters(filterDraft);
  const hasActiveSearchOrFilters = appliedSearch !== "" || activeFilterCount > 0;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Propiedades</h1>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Nueva propiedad
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <label htmlFor="properties-search" className="sr-only">
          Buscar propiedades
        </label>
        <input
          id="properties-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Buscar por título, comuna, ciudad o región…"
          className={inputClassName}
        />
        <button
          type="button"
          onClick={() => setIsFilterPanelOpen((open) => !open)}
          aria-expanded={isFilterPanelOpen}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-card-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <FilterIcon />
          Filtros
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          {error && (
            <p role="alert" className="text-sm text-red-600">
              No se pudieron cargar las propiedades.
            </p>
          )}

          {!error && properties === null && (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          )}

          {!error && properties !== null && properties.length === 0 && (
            <div className="rounded-lg border border-dashed border-card-border bg-card p-6 text-center text-sm text-muted-foreground">
              {hasActiveSearchOrFilters
                ? "No encontramos propiedades que coincidan con tu búsqueda o filtros."
                : "Todavía no hay propiedades registradas."}
            </div>
          )}

          {!error && properties !== null && properties.length > 0 && (
            <ul className="flex flex-col gap-3">
              {properties.map((property) => (
                <li
                  key={property.id}
                  className="flex flex-col gap-4 rounded-lg border border-card-border bg-card p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-background">
                    {property.mainImage ? (
                      <Image
                        src={property.mainImage.url}
                        alt={property.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium text-foreground">{property.title}</p>
                      <span
                        className={
                          property.isPublished
                            ? "rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700"
                            : "rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-600"
                        }
                      >
                        {property.isPublished ? "Publicada" : "Borrador"}
                      </span>
                      {property.isFeatured && (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-hover">
                          Destacada
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {PROPERTY_TYPE_LABELS[property.propertyType]} ·{" "}
                      {OPERATION_TYPE_LABELS[property.operationType]} · {property.commune},{" "}
                      {property.city}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-accent">
                      {formatPrice(property.price, property.currency)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Publicada el {formatDate(property.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(property)}
                      disabled={deletingId === property.id}
                      className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-red-400 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                    >
                      {deletingId === property.id ? "Eliminando…" : "Eliminar"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isFilterPanelOpen && (
          <AdminPropertiesFilterPanel
            draft={filterDraft}
            onChange={setFilterDraft}
            onClear={() => setFilterDraft(EMPTY_PROPERTIES_FILTER_DRAFT)}
          />
        )}
      </div>
    </div>
  );
}
