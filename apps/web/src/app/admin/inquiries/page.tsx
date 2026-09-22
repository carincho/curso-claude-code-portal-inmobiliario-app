import type { Metadata } from "next";
import { AdminInquiriesContent } from "@/components/admin/AdminInquiriesContent";

export const metadata: Metadata = {
  title: "Consultas",
};

export default function AdminInquiriesPage() {
  return <AdminInquiriesContent />;
}
