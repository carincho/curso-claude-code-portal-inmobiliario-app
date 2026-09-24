import { CallToAction } from "@/components/landing/CallToAction";
import { Hero } from "@/components/landing/Hero";
import { PropertySection } from "@/components/landing/PropertySection";
import { fetchPublicProperties, MAX_PROPERTY_PAGE_SIZE } from "@/lib/properties-client";

export default async function Home() {
  // La landing cura destacadas/venta/arriendo sobre todo el catálogo publicado, así que pide
  // el pageSize máximo en vez de paginar.
  const { items: properties } = await fetchPublicProperties({
    pageSize: String(MAX_PROPERTY_PAGE_SIZE),
  }).catch(() => ({ items: [] }));

  const featured = properties.filter((property) => property.isFeatured);
  const forSale = properties.filter((property) => property.operationType === "SALE").slice(0, 4);
  const forRent = properties.filter((property) => property.operationType === "RENT").slice(0, 4);

  return (
    <>
      <Hero />

      {featured.length > 0 && (
        <PropertySection
          title="Propiedades destacadas"
          description="Selección de propiedades con mayor interés"
          properties={featured}
          viewAllHref="/properties"
        />
      )}

      {forSale.length > 0 && (
        <PropertySection
          title="Propiedades en venta"
          properties={forSale}
          viewAllHref="/properties?operation=SALE"
        />
      )}

      {forRent.length > 0 && (
        <PropertySection
          title="Propiedades en arriendo"
          properties={forRent}
          viewAllHref="/properties?operation=RENT"
        />
      )}

      <CallToAction />
    </>
  );
}
