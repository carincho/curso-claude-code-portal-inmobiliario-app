import type {
  AdminInquiryDTO,
  InquiryDTO,
  PaginatedInquiries,
} from "@portal-inmobiliario/shared-types";
import { HttpError } from "@/lib/http-error";
import {
  INQUIRY_PAGE_SIZE,
  type AdminInquiryFilters,
  type CreateInquiryPayload,
  type InquiryListQuery,
} from "@/lib/inquiry-schema";
import {
  countInquiriesByUserId,
  createInquiry,
  deleteInquiryByIdForUser,
  findAllInquiries,
  findInquiriesByUserId,
} from "@/repositories/inquiry.repository";
import { findPublishedPropertyById } from "@/repositories/property.repository";

export async function submitInquiry(
  payload: CreateInquiryPayload,
  userId?: string,
): Promise<InquiryDTO> {
  const property = await findPublishedPropertyById(payload.propertyId);

  if (!property) {
    throw new HttpError(404, "Propiedad no encontrada");
  }

  const inquiry = await createInquiry(payload, userId);

  return {
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    message: inquiry.message,
    propertyId: inquiry.propertyId,
    userId: inquiry.userId,
    createdAt: inquiry.createdAt.toISOString(),
  };
}

export async function listUserInquiries(
  userId: string,
  query: InquiryListQuery,
): Promise<PaginatedInquiries> {
  const [inquiries, total] = await Promise.all([
    findInquiriesByUserId(userId, query),
    countInquiriesByUserId(userId, query.search),
  ]);

  return {
    items: inquiries.map((inquiry) => ({
      id: inquiry.id,
      email: inquiry.email,
      message: inquiry.message,
      createdAt: inquiry.createdAt.toISOString(),
      property: {
        id: inquiry.property.id,
        title: inquiry.property.title,
        mainImage: inquiry.property.images[0]
          ? {
              id: inquiry.property.images[0].id,
              url: inquiry.property.images[0].url,
              position: inquiry.property.images[0].position,
              isMain: inquiry.property.images[0].isMain,
            }
          : null,
      },
    })),
    total,
    page: query.page,
    pageSize: INQUIRY_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / INQUIRY_PAGE_SIZE)),
  };
}

export async function deleteUserInquiry(userId: string, inquiryId: string): Promise<void> {
  const deleted = await deleteInquiryByIdForUser(userId, inquiryId);

  if (!deleted) {
    throw new HttpError(404, "Consulta no encontrada");
  }
}

export async function listAdminInquiries(
  filters: AdminInquiryFilters,
): Promise<AdminInquiryDTO[]> {
  const inquiries = await findAllInquiries(filters.search);

  return inquiries.map((inquiry) => ({
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    message: inquiry.message,
    createdAt: inquiry.createdAt.toISOString(),
    property: {
      id: inquiry.property.id,
      title: inquiry.property.title,
      mainImage: inquiry.property.images[0]
        ? {
            id: inquiry.property.images[0].id,
            url: inquiry.property.images[0].url,
            position: inquiry.property.images[0].position,
            isMain: inquiry.property.images[0].isMain,
          }
        : null,
    },
    user: inquiry.user
      ? { id: inquiry.user.id, name: inquiry.user.name, email: inquiry.user.email }
      : null,
  }));
}
