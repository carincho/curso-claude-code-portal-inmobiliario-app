import type { AdminInquiryDTO } from "@portal-inmobiliario/shared-types";

export async function fetchAdminInquiries(
  apiUrl: string,
  filters: { search?: string } = {},
): Promise<AdminInquiryDTO[]> {
  const searchParams = new URLSearchParams();

  if (filters.search) {
    searchParams.set("search", filters.search);
  }

  const query = searchParams.toString();
  const response = await fetch(`${apiUrl}/api/admin/inquiries${query ? `?${query}` : ""}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar las consultas");
  }

  return response.json();
}
