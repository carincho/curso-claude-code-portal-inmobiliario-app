"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/auth/AuthProvider";
import { updateProfile } from "@/lib/auth-client";
import { editProfileFormSchema, type EditProfileFormValues } from "@/lib/auth-form-schemas";

const fieldClassName =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";
const labelClassName = "mb-1 block text-xs font-medium text-stone-600";
const errorClassName = "mt-1 text-xs text-red-600";

export function EditAccountForm() {
  const router = useRouter();
  const { user, apiUrl, setUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "" },
  });

  async function onSubmit(values: EditProfileFormValues) {
    setServerError(null);

    try {
      const updatedUser = await updateProfile(apiUrl, values);
      setUser(updatedUser);
      router.push("/account");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "No se pudieron guardar los cambios",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="edit-name" className={labelClassName}>
          Nombre
        </label>
        <input id="edit-name" type="text" className={fieldClassName} {...register("name")} />
        {errors.name && <p className={errorClassName}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="edit-email" className={labelClassName}>
          Email
        </label>
        <input id="edit-email" type="email" className={fieldClassName} {...register("email")} />
        {errors.email && <p className={errorClassName}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="edit-password" className={labelClassName}>
          Nueva contraseña
        </label>
        <input
          id="edit-password"
          type="password"
          className={fieldClassName}
          {...register("password")}
        />
        <p className="mt-1 text-xs text-stone-500">
          Déjalo en blanco para mantener tu contraseña actual.
        </p>
        {errors.password && <p className={errorClassName}>{errors.password.message}</p>}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Guardando…" : "Guardar cambios"}
        </button>
        <Link
          href="/account"
          className="text-sm font-medium text-stone-600 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
