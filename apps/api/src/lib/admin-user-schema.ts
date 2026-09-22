import { z } from "zod";

const roleEnum = z.enum(["USER", "ADMIN"]);

export const adminUserFiltersSchema = z.object({
  search: z.string().trim().min(1).optional(),
  role: roleEnum.optional(),
});

export const adminCreateUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
  role: roleEnum.optional().default("USER"),
});

export const adminUpdateUserSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    password: z.string().min(8).optional(),
    role: roleEnum.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No se enviaron cambios",
  });

export type AdminUserFilters = z.infer<typeof adminUserFiltersSchema>;
export type AdminCreateUserPayload = z.infer<typeof adminCreateUserSchema>;
export type AdminUpdateUserPayload = z.infer<typeof adminUpdateUserSchema>;
