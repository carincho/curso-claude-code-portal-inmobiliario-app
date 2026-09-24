import type { PropertyInputPayload } from "@/lib/admin-property-schema";
import type { AdminPropertyFilters, PropertyFilters } from "@/lib/property-filters-schema";
import { HttpError } from "@/lib/http-error";
import {
  createProperty,
  deleteProperty,
  findAllProperties,
  findDistinctPublishedLocations,
  findPropertyById,
  findPublishedProperties,
  findPublishedPropertyById,
  updateProperty,
  type PublishedProperty,
} from "@/repositories/property.repository";
import type {
  PaginatedProperties,
  PropertyDetail,
  PropertyListItem,
  PropertyLocations,
} from "@portal-inmobiliario/shared-types";

type PropertyForListItem = Omit<PublishedProperty, "images" | "features"> & {
  images: Pick<PublishedProperty["images"][number], "id" | "url" | "position" | "isMain">[];
};

export function toListItem(property: PropertyForListItem): PropertyListItem {
  const mainImage = property.images.find((image) => image.isMain) ?? property.images[0] ?? null;

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
    isPublished: property.isPublished,
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

export function toDetail(property: PublishedProperty): PropertyDetail {
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
): Promise<PaginatedProperties> {
  const { items, total, page, pageSize } = await findPublishedProperties(filters);

  return {
    items: items.map(toListItem),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
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

export async function listAdminProperties(
  filters: AdminPropertyFilters = {},
): Promise<PropertyListItem[]> {
  const properties = await findAllProperties(filters);
  return properties.map(toListItem);
}

export async function getAdminProperty(id: string): Promise<PropertyDetail> {
  const property = await findPropertyById(id);

  if (!property) {
    throw new HttpError(404, "Propiedad no encontrada");
  }

  return toDetail(property);
}

export async function createAdminProperty(
  input: PropertyInputPayload,
): Promise<PropertyDetail> {
  const property = await createProperty(input);
  return toDetail(property);
}

export async function updateAdminProperty(
  id: string,
  input: PropertyInputPayload,
): Promise<PropertyDetail> {
  const property = await updateProperty(id, input);

  if (!property) {
    throw new HttpError(404, "Propiedad no encontrada");
  }

  return toDetail(property);
}

export async function deleteAdminProperty(id: string): Promise<void> {
  const deleted = await deleteProperty(id);

  if (!deleted) {
    throw new HttpError(404, "Propiedad no encontrada");
  }
}
