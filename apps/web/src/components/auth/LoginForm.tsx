"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/auth/AuthProvider";
import { loginUser } from "@/lib/auth-client";
import { loginFormSchema, type LoginFormValues } from "@/lib/auth-form-schemas";

const fieldClassName =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";
const labelClassName = "mb-1 block text-xs font-medium text-stone-600";
const errorClassName = "mt-1 text-xs text-red-600";

export function LoginForm() {
  const router = useRouter();
  const { apiUrl, setUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    try {
      const user = await loginUser(apiUrl, values);
      setUser(user);
      router.push(user.role === "ADMIN" ? "/admin" : "/");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No se pudo iniciar sesión");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="login-email" className={labelClassName}>
          Email
        </label>
        <input id="login-email" type="email" className={fieldClassName} {...register("email")} />
        {errors.email && <p className={errorClassName}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="login-password" className={labelClassName}>
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          className={fieldClassName}
          {...register("password")}
        />
        {errors.password && <p className={errorClassName}>{errors.password.message}</p>}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Ingresando…" : "Ingresar"}
      </button>

      <p className="text-sm text-stone-600">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-accent hover:text-accent-hover">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
