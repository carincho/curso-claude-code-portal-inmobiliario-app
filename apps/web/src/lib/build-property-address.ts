import type { PropertyDetail } from "@portal-inmobiliario/shared-types";

const COUNTRY = "México";

export function buildPropertyAddress(
  property: Pick<PropertyDetail, "address" | "commune" | "city" | "region">,
): string {
  return [property.address, property.commune, property.city, property.region, COUNTRY]
    .filter(Boolean)
    .join(", ");
}
