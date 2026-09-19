import type { InquiryDTO, InquiryWithPropertyDTO } from "@portal-inmobiliario/shared-types";
import { HttpError } from "@/lib/http-error";
import type { CreateInquiryPayload } from "@/lib/inquiry-schema";
import { createInquiry, findInquiriesByUserId } from "@/repositories/inquiry.repository";
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

export async function listUserInquiries(userId: string): Promise<InquiryWithPropertyDTO[]> {
  const inquiries = await findInquiriesByUserId(userId);

  return inquiries.map((inquiry) => ({
    id: inquiry.id,
    message: inquiry.message,
    createdAt: inquiry.createdAt.toISOString(),
    property: { id: inquiry.property.id, title: inquiry.property.title },
  }));
}
