import type { PropertyLocations } from "@portal-inmobiliario/shared-types";
import {
  PropertyFiltersForm,
  type PropertyFiltersDefaultValues,
} from "@/components/properties/PropertyFiltersForm";

export function PropertyFiltersSidebar({
  defaultValues,
  locations,
}: {
  defaultValues: PropertyFiltersDefaultValues;
  locations: PropertyLocations;
}) {
  return (
    <aside className="lg:w-72 lg:flex-shrink-0">
      <details
        open
        className="group rounded-xl border border-card-border bg-card shadow-sm lg:sticky lg:top-20"
      >
        <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-stone-900 marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          <span className="flex items-center gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M7 12h10M10 18h4"
              />
            </svg>
            Filtros
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </summary>

        <div className="border-t border-card-border px-4 py-4">
          <PropertyFiltersForm defaultValues={defaultValues} locations={locations} />
        </div>
      </details>
    </aside>
  );
}
