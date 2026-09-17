import Link from "next/link";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import type { PropertyListItem } from "@portal-inmobiliario/shared-types";

type PropertySectionProps = {
  title: string;
  description?: string;
  properties: PropertyListItem[];
  viewAllHref: string;
};

export function PropertySection({
  title,
  description,
  properties,
  viewAllHref,
}: PropertySectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
          ) : null}
        </div>
        <Link
          href={viewAllHref}
          className="text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          Ver todas →
        </Link>
      </div>

      <PropertyGrid properties={properties} />
    </section>
  );
}
