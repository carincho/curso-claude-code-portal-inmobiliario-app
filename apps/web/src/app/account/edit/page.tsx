import type { Metadata } from "next";
import { EditAccountForm } from "@/components/account/EditAccountForm";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const metadata: Metadata = {
  title: "Editar cuenta | Portal Inmobiliario",
};

export default function EditAccountPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:px-6 lg:px-8">
      <RequireAuth>
        <h1 className="text-2xl font-semibold text-stone-900">Editar cuenta</h1>
        <p className="mt-2 text-sm text-stone-600">Actualiza tu nombre y email.</p>
        <div className="mt-8">
          <EditAccountForm />
        </div>
      </RequireAuth>
    </div>
  );
}
