import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "@/lib/property-labels";
import type { PropertyListItem } from "@portal-inmobiliario/shared-types";

export function PropertyCard({ property }: { property: PropertyListItem }) {
  const location = [property.commune, property.city].filter(Boolean).join(", ");

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {property.mainImage ? (
          <Image
            src={property.mainImage.url}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
            Sin imagen
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-zinc-900/90 px-3 py-1 text-xs font-medium text-white">
          {OPERATION_TYPE_LABELS[property.operationType]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {formatPrice(property.price, property.currency)}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {property.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {PROPERTY_TYPE_LABELS[property.propertyType]} · {location}
        </p>

        <div className="mt-auto flex items-center gap-4 pt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {property.bedrooms !== null && <span>{property.bedrooms} dorm.</span>}
          {property.bathrooms !== null && <span>{property.bathrooms} baños</span>}
          {property.usableArea !== null && <span>{property.usableArea} m²</span>}
        </div>
      </div>
    </Link>
  );
}
