import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { formatPrice } from "@/lib/format";
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "@/lib/property-labels";
import type { PropertyListItem } from "@portal-inmobiliario/shared-types";

export function PropertyCard({ property }: { property: PropertyListItem }) {
  const location = [property.commune, property.city].filter(Boolean).join(", ");

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-card-border bg-card shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <FavoriteButton propertyId={property.id} className="absolute right-3 top-3 z-10" />
      <Link
        href={`/properties/${property.id}`}
        className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
          {property.mainImage ? (
            <Image
              src={property.mainImage.url}
              alt={property.title}
              fill
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
              Sin imagen
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground shadow-sm">
            {OPERATION_TYPE_LABELS[property.operationType]}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-lg font-semibold text-accent">
            {formatPrice(property.price, property.currency)}
          </p>
          <h3 className="line-clamp-2 text-sm font-medium text-stone-800">{property.title}</h3>
          <p className="text-sm text-stone-500">
            {PROPERTY_TYPE_LABELS[property.propertyType]} · {location}
          </p>

          <div className="mt-auto flex items-center gap-4 border-t border-card-border pt-3 text-sm text-stone-600">
            {property.bedrooms !== null && <span>{property.bedrooms} dorm.</span>}
            {property.bathrooms !== null && <span>{property.bathrooms} baños</span>}
            {property.usableArea !== null && <span>{property.usableArea} m²</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}
