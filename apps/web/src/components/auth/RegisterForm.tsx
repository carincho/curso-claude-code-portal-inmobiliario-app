"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/auth/AuthProvider";
import { registerUser } from "@/lib/auth-client";
import { registerFormSchema, type RegisterFormValues } from "@/lib/auth-form-schemas";

const fieldClassName =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";
const labelClassName = "mb-1 block text-xs font-medium text-stone-600";
const errorClassName = "mt-1 text-xs text-red-600";

export function RegisterForm() {
  const router = useRouter();
  const { apiUrl, setUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormSchema) });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);

    try {
      const user = await registerUser(apiUrl, values);
      setUser(user);
      router.push("/");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No se pudo crear la cuenta");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="register-name" className={labelClassName}>
          Nombre
        </label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          className={fieldClassName}
          {...register("name")}
        />
        {errors.name && <p className={errorClassName}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="register-email" className={labelClassName}>
          Email
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          className={fieldClassName}
          {...register("email")}
        />
        {errors.email && <p className={errorClassName}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="register-password" className={labelClassName}>
          Contraseña
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          className={fieldClassName}
          {...register("password")}
        />
        {errors.password && <p className={errorClassName}>{errors.password.message}</p>}
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-red-600">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
      </button>

      <p className="text-sm text-stone-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
