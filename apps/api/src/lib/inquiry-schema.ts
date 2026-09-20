import { z } from "zod";

export const createInquirySchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  message: z.string().trim().min(1),
  propertyId: z.string().trim().min(1),
});

export type CreateInquiryPayload = z.infer<typeof createInquirySchema>;

export const INQUIRY_PAGE_SIZE = 6;

export const inquiryListQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
});

export type InquiryListQuery = z.infer<typeof inquiryListQuerySchema>;
