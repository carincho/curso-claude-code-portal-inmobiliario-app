import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().trim().min(1, "Ingresa tu nombre"),
  email: z.string().trim().email("Ingresa un email válido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().trim().email("Ingresa un email válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
