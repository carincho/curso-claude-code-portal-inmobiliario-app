import { z } from "zod";

const toArray = <T extends z.ZodType>(schema: T) =>
  z
    .union([schema, z.array(schema)])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .optional();

const propertyTypeEnum = z.enum([
  "HOUSE",
  "APARTMENT",
  "LAND",
  "OFFICE",
  "COMMERCIAL",
  "OTHER",
]);

const nonEmptyString = z.string().trim().min(1);

export const PROPERTY_SORT_OPTIONS = [
  "newest",
  "price_asc",
  "price_desc",
  "area_asc",
  "area_desc",
] as const;

export const propertyFiltersSchema = z.object({
  search: z.string().trim().min(1).optional(),
  operation: z.enum(["SALE", "RENT"]).optional(),
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
});

export type PropertyFilters = z.infer<typeof propertyFiltersSchema>;
