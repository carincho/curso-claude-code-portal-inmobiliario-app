import type { InquiryDTO } from "@portal-inmobiliario/shared-types";
import { HttpError } from "@/lib/http-error";
import type { CreateInquiryPayload } from "@/lib/inquiry-schema";
import { createInquiry } from "@/repositories/inquiry.repository";
import { findPublishedPropertyById } from "@/repositories/property.repository";

export async function submitInquiry(payload: CreateInquiryPayload): Promise<InquiryDTO> {
  const property = await findPublishedPropertyById(payload.propertyId);

  if (!property) {
    throw new HttpError(404, "Propiedad no encontrada");
  }

  const inquiry = await createInquiry(payload);

  return {
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    message: inquiry.message,
    propertyId: inquiry.propertyId,
    createdAt: inquiry.createdAt.toISOString(),
  };
}
