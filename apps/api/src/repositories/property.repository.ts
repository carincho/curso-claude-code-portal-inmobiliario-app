import type { Prisma } from "@/generated/prisma/client";
import type { PropertyInputPayload } from "@/lib/admin-property-schema";
import {
  DEFAULT_PROPERTY_PAGE_SIZE,
  type AdminPropertyFilters,
  type PropertyFilters,
} from "@/lib/property-filters-schema";
import { prisma } from "@/lib/prisma";

export const publicPropertyInclude = {
  images: { orderBy: { position: "asc" as const } },
  features: true,
};

// Las vistas de listado (catálogo, landing, favoritos, admin) solo necesitan la imagen
// principal: se evita traer el resto de imágenes y las características de cada propiedad.
export const listPropertyInclude = {
  images: {
    orderBy: [{ isMain: "desc" as const }, { position: "asc" as const }],
    take: 1,
  },
};

export type ListedProperty = Prisma.PropertyGetPayload<{ include: typeof listPropertyInclude }>;

const SORT_ORDER_BY = {
  newest: { createdAt: "desc" as const },
  price_asc: { price: "asc" as const },
  price_desc: { price: "desc" as const },
  area_asc: { usableArea: { sort: "asc" as const, nulls: "last" as const } },
  area_desc: { usableArea: { sort: "desc" as const, nulls: "last" as const } },
};

async function findPropertyIdsMatchingSearch(search: string): Promise<string[]> {
  const pattern = `%${search}%`;
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM properties
    WHERE unaccent(title) ILIKE unaccent(${pattern})
       OR unaccent(description) ILIKE unaccent(${pattern})
       OR unaccent(commune) ILIKE unaccent(${pattern})
       OR unaccent(city) ILIKE unaccent(${pattern})
       OR unaccent(region) ILIKE unaccent(${pattern})
  `;

  return rows.map((row) => row.id);
}

async function buildPropertyWhere(
  filters: AdminPropertyFilters,
  { publishedOnly }: { publishedOnly: boolean },
): Promise<Prisma.PropertyWhereInput> {
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
    featured,
    status,
    createdFrom,
    createdTo,
  } = filters;

  return {
    deletedAt: null,
    ...(publishedOnly
      ? { isPublished: true }
      : status === "PUBLISHED"
        ? { isPublished: true }
        : status === "DRAFT"
          ? { isPublished: false }
          : {}),
    ...(createdFrom || createdTo
      ? {
          createdAt: {
            ...(createdFrom ? { gte: createdFrom } : {}),
            // createdTo llega como medianoche UTC del día elegido; se corre al final
            // de ese día para que el filtro incluya todo lo publicado ese día.
            ...(createdTo
              ? { lte: new Date(createdTo.getTime() + 24 * 60 * 60 * 1000 - 1) }
              : {}),
          },
        }
      : {}),
    ...(operation ? { operationType: operation } : {}),
    ...(type && type.length > 0 ? { propertyType: { in: type } } : {}),
    ...(commune && commune.length > 0 ? { commune: { in: commune } } : {}),
    ...(city && city.length > 0 ? { city: { in: city } } : {}),
    ...(region && region.length > 0 ? { region: { in: region } } : {}),
    ...(featured === "true" ? { isFeatured: true } : {}),
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
    ...(search ? { id: { in: await findPropertyIdsMatchingSearch(search) } } : {}),
  };
}

export async function findPublishedProperties(filters: PropertyFilters = {}) {
  const where = await buildPropertyWhere(filters, { publishedOnly: true });
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? DEFAULT_PROPERTY_PAGE_SIZE;

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: listPropertyInclude,
      orderBy: SORT_ORDER_BY[filters.sort ?? "newest"],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.property.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export function findPublishedPropertyById(id: string) {
  return prisma.property.findFirst({
    where: { id, isPublished: true, deletedAt: null },
    include: publicPropertyInclude,
  });
}

export async function findDistinctPublishedLocations() {
  const [communes, cities, regions] = await Promise.all([
    prisma.property.findMany({
      where: { isPublished: true, deletedAt: null },
      distinct: ["commune"],
      select: { commune: true },
      orderBy: { commune: "asc" },
    }),
    prisma.property.findMany({
      where: { isPublished: true, deletedAt: null },
      distinct: ["city"],
      select: { city: true },
      orderBy: { city: "asc" },
    }),
    prisma.property.findMany({
      where: { isPublished: true, deletedAt: null },
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

export async function findAllProperties(filters: AdminPropertyFilters = {}) {
  return prisma.property.findMany({
    where: await buildPropertyWhere(filters, { publishedOnly: false }),
    include: listPropertyInclude,
    orderBy: SORT_ORDER_BY[filters.sort ?? "newest"],
  });
}

export function findPropertyById(id: string) {
  return prisma.property.findFirst({
    where: { id, deletedAt: null },
    include: publicPropertyInclude,
  });
}

function toFeatureConnectOrCreate(featureNames: string[] = []) {
  return featureNames.map((name) => ({ where: { name }, create: { name } }));
}

export function createProperty(data: PropertyInputPayload) {
  const { features: featureNames, ...scalarData } = data;

  return prisma.property.create({
    data: {
      ...scalarData,
      ...(featureNames && featureNames.length > 0
        ? { features: { connectOrCreate: toFeatureConnectOrCreate(featureNames) } }
        : {}),
    },
    include: publicPropertyInclude,
  });
}

export async function updateProperty(id: string, data: PropertyInputPayload) {
  const existing = await prisma.property.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });

  if (!existing) {
    return null;
  }

  const { features: featureNames, ...scalarData } = data;

  return prisma.property.update({
    where: { id },
    data: {
      ...scalarData,
      features: {
        set: [],
        connectOrCreate: toFeatureConnectOrCreate(featureNames),
      },
    },
    include: publicPropertyInclude,
  });
}

export async function deleteProperty(id: string): Promise<boolean> {
  const { count } = await prisma.property.updateMany({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });

  return count > 0;
}

export type PublishedProperty = NonNullable<
  Awaited<ReturnType<typeof findPublishedPropertyById>>
>;
