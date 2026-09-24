import Link from "next/link";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertyPagination } from "@/components/properties/PropertyPagination";
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
  const { items: properties, page, totalPages, total } = await fetchPublicProperties(filters);
  const { search } = filters;

  return (
    <>
      <h2 className="sr-only">Resultados</h2>
      <p className="mb-6 text-sm text-stone-600">
        {search ? (
          <>
            {total} {total === 1 ? "resultado" : "resultados"} para &ldquo;{search}&rdquo;
          </>
        ) : (
          <>
            {total} {total === 1 ? "propiedad publicada" : "propiedades publicadas"}
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

      <PropertyPagination filters={filters} page={page} totalPages={totalPages} />
    </>
  );
}
