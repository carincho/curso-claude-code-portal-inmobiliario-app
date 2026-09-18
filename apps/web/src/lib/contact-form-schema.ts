import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Ingresa tu nombre"),
  email: z.string().trim().email("Ingresa un email válido"),
  phone: z.string().trim().min(1, "Ingresa tu teléfono"),
  message: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
