import Link from "next/link";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { fetchPublicProperties, type PropertyFilters } from "@/lib/properties-client";

export async function PropertyResults({
  filters,
  hasOtherFilters,
  hasAnyFilter,
}: {
  filters: PropertyFilters;
  hasOtherFilters: boolean;
  hasAnyFilter: boolean;
}) {
  const properties = await fetchPublicProperties(filters);
  const { search } = filters;

  return (
    <>
      <p className="mb-6 text-sm text-stone-600">
        {search ? (
          <>
            {properties.length} {properties.length === 1 ? "resultado" : "resultados"} para
            &ldquo;{search}&rdquo;
          </>
        ) : (
          <>
            {properties.length}{" "}
            {properties.length === 1 ? "propiedad publicada" : "propiedades publicadas"}
            {hasOtherFilters ? " con los filtros aplicados" : ""}
          </>
        )}
        {hasAnyFilter ? (
          <>
            {" · "}
            <Link href="/properties" className="text-accent underline underline-offset-4">
              Limpiar filtros
            </Link>
          </>
        ) : null}
      </p>

      <PropertyGrid
        properties={properties}
        emptyMessage={
          search
            ? `No encontramos propiedades para "${search}". Intenta con otro término.`
            : hasOtherFilters
              ? "No encontramos propiedades con los filtros aplicados. Intenta ajustarlos."
              : undefined
        }
      />
    </>
  );
}
