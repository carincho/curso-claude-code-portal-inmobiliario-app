import type { Metadata } from "next";
import { AdminPropertiesListContent } from "@/components/admin/AdminPropertiesListContent";

export const metadata: Metadata = {
  title: "Propiedades",
};

export default function AdminPropertiesPage() {
  return <AdminPropertiesListContent />;
}
