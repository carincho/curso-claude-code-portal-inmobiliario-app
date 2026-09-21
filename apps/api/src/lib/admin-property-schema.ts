import { z } from "zod";
import { operationTypeEnum, propertyTypeEnum } from "@/lib/property-filters-schema";

const optionalPositiveNumber = z.coerce.number().positive().nullable().optional();
const optionalNonNegativeInt = z.coerce.number().int().nonnegative().nullable().optional();

export const propertyInputSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  operationType: operationTypeEnum,
  propertyType: propertyTypeEnum,
  price: z.coerce.number().positive(),
  usableArea: optionalPositiveNumber,
  totalArea: optionalPositiveNumber,
  bedrooms: optionalNonNegativeInt,
  bathrooms: optionalNonNegativeInt,
  parkingSpaces: optionalNonNegativeInt,
  age: optionalNonNegativeInt,
  address: z.string().trim().min(1),
  commune: z.string().trim().min(1),
  city: z.string().trim().min(1),
  region: z.string().trim().min(1),
  isPublished: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  features: z.array(z.string().trim().min(1)).max(30).optional().default([]),
});

export type PropertyInputPayload = z.infer<typeof propertyInputSchema>;
