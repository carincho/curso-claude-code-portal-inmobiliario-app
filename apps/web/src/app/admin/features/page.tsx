import type { Metadata } from "next";
import { AdminFeaturesContent } from "@/components/admin/AdminFeaturesContent";

export const metadata: Metadata = {
  title: "Características",
};

export default function AdminFeaturesPage() {
  return <AdminFeaturesContent />;
}
