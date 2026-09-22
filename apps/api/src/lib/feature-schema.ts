import { z } from "zod";

export const featureInputSchema = z.object({
  name: z.string().trim().min(1, "Ingresa un nombre").max(60, "Máximo 60 caracteres"),
});

export type FeatureInputPayload = z.infer<typeof featureInputSchema>;
