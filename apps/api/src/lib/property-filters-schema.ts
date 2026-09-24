import { z } from "zod";

const toArray = <T extends z.ZodType>(schema: T) =>
  z
    .union([schema, z.array(schema)])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .optional();

export const propertyTypeEnum = z.enum([
  "HOUSE",
  "APARTMENT",
  "LAND",
  "OFFICE",
  "COMMERCIAL",
  "OTHER",
]);

export const operationTypeEnum = z.enum(["SALE", "RENT"]);

const nonEmptyString = z.string().trim().min(1);

export const PROPERTY_SORT_OPTIONS = [
  "newest",
  "price_asc",
  "price_desc",
  "area_asc",
  "area_desc",
] as const;

export const DEFAULT_PROPERTY_PAGE_SIZE = 9;
export const MAX_PROPERTY_PAGE_SIZE = 48;

export const propertyFiltersSchema = z.object({
  search: z.string().trim().min(1).optional(),
  operation: operationTypeEnum.optional(),
  type: toArray(propertyTypeEnum),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  bedrooms: z.coerce.number().int().nonnegative().optional(),
  bathrooms: z.coerce.number().int().nonnegative().optional(),
  minUsableArea: z.coerce.number().nonnegative().optional(),
  commune: toArray(nonEmptyString),
  city: toArray(nonEmptyString),
  region: toArray(nonEmptyString),
  sort: z.enum(PROPERTY_SORT_OPTIONS).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(MAX_PROPERTY_PAGE_SIZE).optional(),
});

export type PropertyFilters = z.infer<typeof propertyFiltersSchema>;

export const propertyStatusEnum = z.enum(["PUBLISHED", "DRAFT"]);

export const adminPropertyFiltersSchema = propertyFiltersSchema.extend({
  status: propertyStatusEnum.optional(),
  createdFrom: z.coerce.date().optional(),
  createdTo: z.coerce.date().optional(),
});

export type AdminPropertyFilters = z.infer<typeof adminPropertyFiltersSchema>;
