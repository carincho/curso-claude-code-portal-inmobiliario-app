import { PropertyCard } from "@/components/properties/PropertyCard";
import type { PropertyListItem } from "@portal-inmobiliario/shared-types";

type PropertyGridProps = {
  properties: PropertyListItem[];
  emptyMessage?: string;
};

export function PropertyGrid({
  properties,
  emptyMessage = "No hay propiedades disponibles por el momento.",
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-card-border bg-card p-8 text-center text-sm text-stone-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
