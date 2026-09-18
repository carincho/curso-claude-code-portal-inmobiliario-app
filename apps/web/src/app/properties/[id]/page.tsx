import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { PropertyMap } from "@/components/properties/PropertyMap";
import { buildPropertyAddress } from "@/lib/build-property-address";
import { formatPrice } from "@/lib/format";
import { geocodeAddress } from "@/lib/geocode-address";
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "@/lib/property-labels";
import { fetchPublicPropertyById } from "@/lib/properties-client";

export async function generateMetadata(
  props: PageProps<"/properties/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const property = await fetchPublicPropertyById(id);

  if (!property) {
    return { title: "Propiedad no encontrada | Portal Inmobiliario" };
  }

  return {
    title: `${property.title} | Portal Inmobiliario`,
    description: property.description.slice(0, 160),
  };
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="mt-1 text-base font-medium text-stone-900">{value}</dd>
    </div>
  );
}

export default async function PropertyDetailPage(props: PageProps<"/properties/[id]">) {
  const { id } = await props.params;
  const property = await fetchPublicPropertyById(id);

  if (!property) {
    notFound();
  }

  const location = [property.commune, property.city, property.region]
    .filter(Boolean)
    .join(", ");
  const fullAddress = buildPropertyAddress(property);
  const coordinates = await geocodeAddress(fullAddress);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/properties"
        className="mb-6 inline-flex items-center gap-1 text-sm text-stone-600 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        ← Volver a propiedades
      </Link>

      <PropertyGallery
        images={property.images}
        title={property.title}
        badgeLabel={OPERATION_TYPE_LABELS[property.operationType]}
      />

      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{property.title}</h1>
      <p className="mt-1 text-sm text-stone-600">
        {PROPERTY_TYPE_LABELS[property.propertyType]} · {location}
      </p>

      <p className="mt-6 text-2xl font-semibold text-accent">
        {formatPrice(property.price, property.currency)}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-6 border-y border-card-border py-6 sm:grid-cols-3">
        {property.bedrooms !== null && <Stat label="Dormitorios" value={property.bedrooms} />}
        {property.bathrooms !== null && <Stat label="Baños" value={property.bathrooms} />}
        {property.parkingSpaces !== null && (
          <Stat label="Estacionamientos" value={property.parkingSpaces} />
        )}
        {property.usableArea !== null && (
          <Stat label="Superficie útil" value={`${property.usableArea} m²`} />
        )}
        {property.totalArea !== null && (
          <Stat label="Superficie total" value={`${property.totalArea} m²`} />
        )}
        {property.age !== null && <Stat label="Antigüedad" value={`${property.age} años`} />}
      </dl>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900">Descripción</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-stone-700">
          {property.description}
        </p>
      </section>

      {property.features.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-stone-900">Características</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {property.features.map((feature) => (
              <li
                key={feature.id}
                className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs text-accent-hover"
              >
                {feature.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900">Ubicación</h2>
        <p className="mt-2 text-sm text-stone-700">{property.address}</p>
        <p className="text-sm text-stone-500">{location}</p>
        <div className="mt-4">
          <PropertyMap address={fullAddress} title={property.title} coordinates={coordinates} />
        </div>
      </section>
    </div>
  );
}
