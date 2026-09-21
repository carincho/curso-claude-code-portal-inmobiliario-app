import type { PropertyInput } from "@portal-inmobiliario/shared-types";
import { z } from "zod";

function isValidNumberString(value: string) {
  return value.trim() !== "" && !Number.isNaN(Number(value));
}

const optionalPositiveNumberString = z
  .string()
  .trim()
  .refine((value) => value === "" || (isValidNumberString(value) && Number(value) > 0), {
    message: "Debe ser mayor a 0",
  });

const optionalNonNegativeIntString = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" || (isValidNumberString(value) && Number.isInteger(Number(value)) && Number(value) >= 0),
    { message: "No puede ser negativo" },
  );

export const propertyFormSchema = z.object({
  title: z.string().trim().min(1, "Ingresa un título"),
  description: z.string().trim().min(1, "Ingresa una descripción"),
  operationType: z.enum(["SALE", "RENT"], { message: "Selecciona una operación" }),
  propertyType: z.enum(["HOUSE", "APARTMENT", "LAND", "OFFICE", "COMMERCIAL", "OTHER"], {
    message: "Selecciona un tipo de propiedad",
  }),
  price: z
    .string()
    .trim()
    .refine((value) => isValidNumberString(value) && Number(value) > 0, {
      message: "Ingresa un precio válido mayor a 0",
    }),
  usableArea: optionalPositiveNumberString,
  totalArea: optionalPositiveNumberString,
  bedrooms: optionalNonNegativeIntString,
  bathrooms: optionalNonNegativeIntString,
  parkingSpaces: optionalNonNegativeIntString,
  age: optionalNonNegativeIntString,
  address: z.string().trim().min(1, "Ingresa una dirección"),
  commune: z.string().trim().min(1, "Ingresa una comuna"),
  city: z.string().trim().min(1, "Ingresa una ciudad"),
  region: z.string().trim().min(1, "Ingresa una región"),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

function toNumberOrUndefined(value: string): number | undefined {
  return value.trim() === "" ? undefined : Number(value);
}

export function propertyFormValuesToInput(
  values: PropertyFormValues,
  features: string[],
): PropertyInput {
  return {
    title: values.title,
    description: values.description,
    operationType: values.operationType,
    propertyType: values.propertyType,
    price: Number(values.price),
    usableArea: toNumberOrUndefined(values.usableArea),
    totalArea: toNumberOrUndefined(values.totalArea),
    bedrooms: toNumberOrUndefined(values.bedrooms),
    bathrooms: toNumberOrUndefined(values.bathrooms),
    parkingSpaces: toNumberOrUndefined(values.parkingSpaces),
    age: toNumberOrUndefined(values.age),
    address: values.address,
    commune: values.commune,
    city: values.city,
    region: values.region,
    isPublished: values.isPublished,
    isFeatured: values.isFeatured,
    features,
  };
}

export function numberToFormString(value: number | null | undefined): string {
  return value === null || value === undefined ? "" : String(value);
}
