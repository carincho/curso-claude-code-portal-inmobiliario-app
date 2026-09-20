import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateInquiryPayload, InquiryListQuery } from "@/lib/inquiry-schema";
import { INQUIRY_PAGE_SIZE } from "@/lib/inquiry-schema";

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

function buildUserInquiriesWhere(userId: string, search?: string): Prisma.InquiryWhereInput {
  return {
    userId,
    ...(search
      ? {
          OR: [
            { message: { contains: search, mode: "insensitive" as const } },
            { property: { title: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };
}

export function findInquiriesByUserId(userId: string, { search, page }: InquiryListQuery) {
  const where = buildUserInquiriesWhere(userId, search);

  return prisma.inquiry.findMany({
    where,
    include: {
      property: {
        select: {
          id: true,
          title: true,
          images: { orderBy: { position: "asc" }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * INQUIRY_PAGE_SIZE,
    take: INQUIRY_PAGE_SIZE,
  });
}

export function countInquiriesByUserId(userId: string, search?: string) {
  return prisma.inquiry.count({ where: buildUserInquiriesWhere(userId, search) });
}

export async function deleteInquiryByIdForUser(userId: string, inquiryId: string) {
  const { count } = await prisma.inquiry.deleteMany({ where: { id: inquiryId, userId } });
  return count > 0;
}
