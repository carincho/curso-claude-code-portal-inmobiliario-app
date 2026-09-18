import { z } from "zod";

export const createInquirySchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  message: z.string().trim().min(1),
  propertyId: z.string().trim().min(1),
});

export type CreateInquiryPayload = z.infer<typeof createInquirySchema>;
