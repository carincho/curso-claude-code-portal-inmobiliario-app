"use client";

import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "@/lib/property-labels";

export type PropertiesFilterDraft = {
  minPrice: string;
  maxPrice: string;
  status: string;
  type: string[];
  operation: string;
  createdFrom: string;
  createdTo: string;
};

export const EMPTY_PROPERTIES_FILTER_DRAFT: PropertiesFilterDraft = {
  minPrice: "",
  maxPrice: "",
  status: "",
  type: [],
  operation: "",
  createdFrom: "",
  createdTo: "",
};

export function countActiveFilters(draft: PropertiesFilterDraft): number {
  return (
    (draft.minPrice ? 1 : 0) +
    (draft.maxPrice ? 1 : 0) +
    (draft.status ? 1 : 0) +
    draft.type.length +
    (draft.operation ? 1 : 0) +
    (draft.createdFrom ? 1 : 0) +
    (draft.createdTo ? 1 : 0)
  );
}

const fieldClassName =
  "w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";
const labelClassName = "mb-1 block text-xs font-medium text-muted-foreground";
const legendClassName =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export function AdminPropertiesFilterPanel({
  draft,
  onChange,
  onClear,
}: {
  draft: PropertiesFilterDraft;
  onChange: (next: PropertiesFilterDraft) => void;
  onClear: () => void;
}) {
  function update<K extends keyof PropertiesFilterDraft>(
    key: K,
    value: PropertiesFilterDraft[K],
  ) {
    onChange({ ...draft, [key]: value });
  }

  function toggleType(value: string) {
    const next = draft.type.includes(value)
      ? draft.type.filter((item) => item !== value)
      : [...draft.type, value];
    update("type", next);
  }

  return (
    <aside className="w-full shrink-0 rounded-lg border border-card-border bg-card p-4 sm:w-72">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Filtros</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-muted-foreground hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-5">
        <div>
          <span className={legendClassName}>Rango de precio (USD)</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="filter-min-price" className={labelClassName}>
                Mínimo
              </label>
              <input
                id="filter-min-price"
                type="number"
                min={0}
                value={draft.minPrice}
                onChange={(event) => update("minPrice", event.target.value)}
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="filter-max-price" className={labelClassName}>
                Máximo
              </label>
              <input
                id="filter-max-price"
                type="number"
                min={0}
                value={draft.maxPrice}
                onChange={(event) => update("maxPrice", event.target.value)}
                className={fieldClassName}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="filter-status" className={labelClassName}>
            Estado
          </label>
          <select
            id="filter-status"
            value={draft.status}
            onChange={(event) => update("status", event.target.value)}
            className={fieldClassName}
          >
            <option value="">Todos</option>
            <option value="PUBLISHED">Publicada</option>
            <option value="DRAFT">Borrador</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-operation" className={labelClassName}>
            Tipo de operación
          </label>
          <select
            id="filter-operation"
            value={draft.operation}
            onChange={(event) => update("operation", event.target.value)}
            className={fieldClassName}
          >
            <option value="">Todas</option>
            {Object.entries(OPERATION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className={legendClassName}>Tipo de propiedad</legend>
          <div className="flex flex-col gap-2">
            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={draft.type.includes(value)}
                  onChange={() => toggleType(value)}
                  className="h-4 w-4 rounded border-card-border text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <span className={legendClassName}>Fecha de publicación</span>
          <div className="flex flex-col gap-2">
            <div>
              <label htmlFor="filter-created-from" className={labelClassName}>
                Desde
              </label>
              <input
                id="filter-created-from"
                type="date"
                value={draft.createdFrom}
                onChange={(event) => update("createdFrom", event.target.value)}
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="filter-created-to" className={labelClassName}>
                Hasta
              </label>
              <input
                id="filter-created-to"
                type="date"
                value={draft.createdTo}
                onChange={(event) => update("createdTo", event.target.value)}
                className={fieldClassName}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
