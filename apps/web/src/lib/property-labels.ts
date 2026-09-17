import type { OperationType, PropertyType } from "@portal-inmobiliario/shared-types";

export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  SALE: "Venta",
  RENT: "Arriendo",
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  HOUSE: "Casa",
  APARTMENT: "Departamento",
  LAND: "Terreno",
  OFFICE: "Oficina",
  COMMERCIAL: "Local comercial",
  OTHER: "Otro",
};
