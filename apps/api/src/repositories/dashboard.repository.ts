import { prisma } from "@/lib/prisma";

export async function getDashboardCounts() {
  const [
    totalProperties,
    publishedProperties,
    propertiesForSale,
    propertiesForRent,
    totalUsers,
    totalInquiries,
  ] = await Promise.all([
    prisma.property.count({ where: { deletedAt: null } }),
    prisma.property.count({ where: { deletedAt: null, isPublished: true } }),
    prisma.property.count({ where: { deletedAt: null, operationType: "SALE" } }),
    prisma.property.count({ where: { deletedAt: null, operationType: "RENT" } }),
    prisma.user.count(),
    prisma.inquiry.count(),
  ]);

  return {
    totalProperties,
    publishedProperties,
    propertiesForSale,
    propertiesForRent,
    totalUsers,
    totalInquiries,
  };
}
