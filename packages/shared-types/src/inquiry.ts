import type { PropertyImageDTO } from "./property";

export type CreateInquiryInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string;
};

export type InquiryDTO = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string;
  userId: string | null;
  createdAt: string;
};

export type InquiryRecordDTO = {
  id: string;
  email: string;
  message: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
    mainImage: PropertyImageDTO | null;
  };
};

export type PaginatedInquiries = {
  items: InquiryRecordDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type AdminInquiryDTO = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
    mainImage: PropertyImageDTO | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
};
