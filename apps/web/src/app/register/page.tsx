import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta | Portal Inmobiliario",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-stone-900">Crear cuenta</h1>
      <p className="mt-2 text-sm text-stone-600">
        Regístrate para guardar propiedades y revisar tus consultas.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
