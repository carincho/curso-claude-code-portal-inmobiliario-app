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
    prisma.property.count(),
    prisma.property.count({ where: { isPublished: true } }),
    prisma.property.count({ where: { operationType: "SALE" } }),
    prisma.property.count({ where: { operationType: "RENT" } }),
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
