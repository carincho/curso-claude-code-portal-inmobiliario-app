import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Ingresar | Portal Inmobiliario",
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-stone-900">Ingresar</h1>
      <p className="mt-2 text-sm text-stone-600">
        Accede a tu cuenta para guardar propiedades y revisar tus consultas.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
