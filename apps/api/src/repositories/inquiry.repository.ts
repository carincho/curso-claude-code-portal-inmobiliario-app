import { prisma } from "@/lib/prisma";
import type { CreateInquiryPayload } from "@/lib/inquiry-schema";

export function createInquiry(data: CreateInquiryPayload, userId?: string) {
  return prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      propertyId: data.propertyId,
      userId,
    },
  });
}
