import { z } from "zod";

export const attachPropertyImageSchema = z.object({
  url: z.string().trim().url(),
  publicId: z.string().trim().min(1),
});

export type AttachPropertyImagePayload = z.infer<typeof attachPropertyImageSchema>;

export const setMainPropertyImageSchema = z.object({
  isMain: z.literal(true),
});

export const reorderPropertyImagesSchema = z.object({
  imageIds: z.array(z.string().trim().min(1)).min(1),
});

export type ReorderPropertyImagesPayload = z.infer<typeof reorderPropertyImagesSchema>;
