import type { Metadata } from "next";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const metadata: Metadata = {
  title: "Editar propiedad",
};

export default async function EditAdminPropertyPage(
  props: PageProps<"/admin/properties/[id]/edit">,
) {
  const { id } = await props.params;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Editar propiedad</h1>
      <div className="mt-6">
        <PropertyForm mode="edit" propertyId={id} />
      </div>
    </div>
  );
}
