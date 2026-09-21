import type { Metadata } from "next";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const metadata: Metadata = {
  title: "Nueva propiedad",
};

export default function NewAdminPropertyPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Nueva propiedad</h1>
      <div className="mt-6">
        <PropertyForm mode="create" />
      </div>
    </div>
  );
}
