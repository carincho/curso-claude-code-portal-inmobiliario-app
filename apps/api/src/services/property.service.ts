import type { PropertyFilters } from "@/lib/property-filters-schema";
import { HttpError } from "@/lib/http-error";
import {
  findDistinctPublishedLocations,
  findPublishedProperties,
  findPublishedPropertyById,
  type PublishedProperty,
} from "@/repositories/property.repository";
import type {
  PropertyDetail,
  PropertyListItem,
  PropertyLocations,
} from "@portal-inmobiliario/shared-types";

export function toListItem(property: PublishedProperty): PropertyListItem {
  const mainImage = property.images[0] ?? null;

  return {
    id: property.id,
    title: property.title,
    operationType: property.operationType,
    propertyType: property.propertyType,
    price: Number(property.price),
    currency: property.currency,
    usableArea: property.usableArea,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    commune: property.commune,
    city: property.city,
    region: property.region,
    isFeatured: property.isFeatured,
    mainImage: mainImage
      ? {
          id: mainImage.id,
          url: mainImage.url,
          position: mainImage.position,
          isMain: mainImage.isMain,
        }
      : null,
    createdAt: property.createdAt.toISOString(),
  };
}

function toDetail(property: PublishedProperty): PropertyDetail {
  return {
    ...toListItem(property),
    description: property.description,
    totalArea: property.totalArea,
    parkingSpaces: property.parkingSpaces,
    age: property.age,
    address: property.address,
    images: property.images.map((image) => ({
      id: image.id,
      url: image.url,
      position: image.position,
      isMain: image.isMain,
    })),
    features: property.features.map((feature) => ({
      id: feature.id,
      name: feature.name,
    })),
    updatedAt: property.updatedAt.toISOString(),
  };
}

export async function listPublicProperties(
  filters: PropertyFilters = {},
): Promise<PropertyListItem[]> {
  const properties = await findPublishedProperties(filters);
  return properties.map(toListItem);
}

export async function getPublicProperty(id: string): Promise<PropertyDetail> {
  const property = await findPublishedPropertyById(id);

  if (!property) {
    throw new HttpError(404, "Propiedad no encontrada");
  }

  return toDetail(property);
}

export async function getPropertyLocations(): Promise<PropertyLocations> {
  return findDistinctPublishedLocations();
}
