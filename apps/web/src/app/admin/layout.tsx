import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const metadata: Metadata = {
  title: {
    default: "Panel de administración | Portal Inmobiliario",
    template: "%s | Panel de administración",
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth role="ADMIN">
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
