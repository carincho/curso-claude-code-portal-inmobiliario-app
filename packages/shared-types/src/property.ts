export type OperationType = "SALE" | "RENT";

export type PropertyType = "HOUSE" | "APARTMENT" | "LAND" | "OFFICE" | "COMMERCIAL" | "OTHER";

export type Currency = "USD";

export type PropertyImageDTO = {
  id: string;
  url: string;
  position: number;
  isMain: boolean;
};

export type PropertyFeatureDTO = {
  id: string;
  name: string;
};

export type FeatureDTO = {
  id: string;
  name: string;
  propertiesCount: number;
};

export type PropertyListItem = {
  id: string;
  title: string;
  operationType: OperationType;
  propertyType: PropertyType;
  price: number;
  currency: Currency;
  usableArea: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  commune: string;
  city: string;
  region: string;
  isPublished: boolean;
  isFeatured: boolean;
  mainImage: PropertyImageDTO | null;
  createdAt: string;
};

export type PropertyDetail = PropertyListItem & {
  description: string;
  totalArea: number | null;
  parkingSpaces: number | null;
  age: number | null;
  address: string;
  images: PropertyImageDTO[];
  features: PropertyFeatureDTO[];
  updatedAt: string;
};

export type PropertyLocations = {
  communes: string[];
  cities: string[];
  regions: string[];
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PaginatedProperties = PaginatedResult<PropertyListItem>;

export type PropertyInput = {
  title: string;
  description: string;
  operationType: OperationType;
  propertyType: PropertyType;
  price: number;
  usableArea?: number | null;
  totalArea?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parkingSpaces?: number | null;
  age?: number | null;
  address: string;
  commune: string;
  city: string;
  region: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  features?: string[];
};
