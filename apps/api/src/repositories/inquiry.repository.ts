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

async function findUserInquiryIdsMatchingSearch(userId: string, search: string): Promise<string[]> {
  const pattern = `%${search}%`;
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT i.id FROM inquiries i
    JOIN properties p ON p.id = i."propertyId"
    WHERE i."userId" = ${userId}
      AND (unaccent(i.message) ILIKE unaccent(${pattern})
        OR unaccent(p.title) ILIKE unaccent(${pattern}))
  `;

  return rows.map((row) => row.id);
}

async function buildUserInquiriesWhere(
  userId: string,
  search?: string,
): Promise<Prisma.InquiryWhereInput> {
  return {
    userId,
    ...(search ? { id: { in: await findUserInquiryIdsMatchingSearch(userId, search) } } : {}),
  };
}

export async function findInquiriesByUserId(userId: string, { search, page }: InquiryListQuery) {
  const where = await buildUserInquiriesWhere(userId, search);

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

export async function countInquiriesByUserId(userId: string, search?: string) {
  return prisma.inquiry.count({ where: await buildUserInquiriesWhere(userId, search) });
}

export async function deleteInquiryByIdForUser(userId: string, inquiryId: string) {
  const { count } = await prisma.inquiry.deleteMany({ where: { id: inquiryId, userId } });
  return count > 0;
}

async function findInquiryIdsMatchingSearch(search: string): Promise<string[]> {
  const pattern = `%${search}%`;
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT i.id FROM inquiries i
    JOIN properties p ON p.id = i."propertyId"
    WHERE unaccent(i.name) ILIKE unaccent(${pattern})
       OR unaccent(i.email) ILIKE unaccent(${pattern})
       OR unaccent(i.message) ILIKE unaccent(${pattern})
       OR unaccent(p.title) ILIKE unaccent(${pattern})
  `;

  return rows.map((row) => row.id);
}

export async function findAllInquiries(search?: string) {
  const where: Prisma.InquiryWhereInput = search
    ? { id: { in: await findInquiryIdsMatchingSearch(search) } }
    : {};

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
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
