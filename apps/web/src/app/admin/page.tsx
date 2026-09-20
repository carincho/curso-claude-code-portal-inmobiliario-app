import type { Metadata } from "next";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const metadata: Metadata = {
  title: "Panel de administración | Portal Inmobiliario",
};

export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <RequireAuth role="ADMIN">
        <AdminDashboardContent />
      </RequireAuth>
    </div>
  );
}
