import type { PropertyFilters } from "@/lib/property-filters-schema";
import { prisma } from "@/lib/prisma";

const publicPropertyInclude = {
  images: { orderBy: { position: "asc" as const } },
  features: true,
};

const SORT_ORDER_BY = {
  newest: { createdAt: "desc" as const },
  price_asc: { price: "asc" as const },
  price_desc: { price: "desc" as const },
  area_asc: { usableArea: { sort: "asc" as const, nulls: "last" as const } },
  area_desc: { usableArea: { sort: "desc" as const, nulls: "last" as const } },
};

export function findPublishedProperties(filters: PropertyFilters = {}) {
  const {
    search,
    operation,
    type,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    minUsableArea,
    commune,
    city,
    region,
    sort,
  } = filters;

  return prisma.property.findMany({
    where: {
      isPublished: true,
      ...(operation ? { operationType: operation } : {}),
      ...(type && type.length > 0 ? { propertyType: { in: type } } : {}),
      ...(commune && commune.length > 0 ? { commune: { in: commune } } : {}),
      ...(city && city.length > 0 ? { city: { in: city } } : {}),
      ...(region && region.length > 0 ? { region: { in: region } } : {}),
      ...(bedrooms !== undefined ? { bedrooms: { gte: bedrooms } } : {}),
      ...(bathrooms !== undefined ? { bathrooms: { gte: bathrooms } } : {}),
      ...(minUsableArea !== undefined ? { usableArea: { gte: minUsableArea } } : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { description: { contains: search, mode: "insensitive" as const } },
              { commune: { contains: search, mode: "insensitive" as const } },
              { city: { contains: search, mode: "insensitive" as const } },
              { region: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    include: publicPropertyInclude,
    orderBy: SORT_ORDER_BY[sort ?? "newest"],
  });
}

export function findPublishedPropertyById(id: string) {
  return prisma.property.findFirst({
    where: { id, isPublished: true },
    include: publicPropertyInclude,
  });
}

export async function findDistinctPublishedLocations() {
  const [communes, cities, regions] = await Promise.all([
    prisma.property.findMany({
      where: { isPublished: true },
      distinct: ["commune"],
      select: { commune: true },
      orderBy: { commune: "asc" },
    }),
    prisma.property.findMany({
      where: { isPublished: true },
      distinct: ["city"],
      select: { city: true },
      orderBy: { city: "asc" },
    }),
    prisma.property.findMany({
      where: { isPublished: true },
      distinct: ["region"],
      select: { region: true },
      orderBy: { region: "asc" },
    }),
  ]);

  return {
    communes: communes.map((row) => row.commune),
    cities: cities.map((row) => row.city),
    regions: regions.map((row) => row.region),
  };
}

export type PublishedProperty = NonNullable<
  Awaited<ReturnType<typeof findPublishedPropertyById>>
>;
