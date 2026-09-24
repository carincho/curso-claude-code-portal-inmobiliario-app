import Link from "next/link";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertyPagination } from "@/components/properties/PropertyPagination";
import {
  fetchPublicProperties,
  MAX_PROPERTY_PAGE_SIZE,
  type PropertyFilters,
} from "@/lib/properties-client";

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

  // La sección de destacadas solo tiene sentido en la vista por defecto del catálogo: si hay
  // búsqueda, filtros o estamos en otra página, agruparlas confundiría los resultados mostrados.
  const isDefaultView = !hasAnyFilter && page === 1;
  const { items: featured } = isDefaultView
    ? await fetchPublicProperties({
        featured: "true",
        pageSize: String(MAX_PROPERTY_PAGE_SIZE),
      }).catch(() => ({ items: [] }))
    : { items: [] };

  return (
    <>
      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-stone-900">
            Propiedades destacadas
          </h2>
          <PropertyGrid properties={featured} />
        </section>
      )}

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
