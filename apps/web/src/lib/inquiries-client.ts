import type {
  CreateInquiryInput,
  InquiryDTO,
  PaginatedInquiries,
} from "@portal-inmobiliario/shared-types";

export async function submitInquiry(
  apiUrl: string,
  input: CreateInquiryInput,
): Promise<InquiryDTO> {
  const response = await fetch(`${apiUrl}/api/inquiries`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("No se pudo enviar la consulta");
  }

  return response.json();
}

export async function fetchMyInquiries(
  apiUrl: string,
  params: { search?: string; page?: number } = {},
): Promise<PaginatedInquiries> {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.page) {
    query.set("page", String(params.page));
  }

  const queryString = query.toString();
  const response = await fetch(
    `${apiUrl}/api/inquiries/me${queryString ? `?${queryString}` : ""}`,
    { credentials: "include" },
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar tus consultas");
  }

  return response.json();
}

export async function deleteInquiry(apiUrl: string, inquiryId: string): Promise<void> {
  const response = await fetch(`${apiUrl}/api/inquiries/${inquiryId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar la consulta");
  }
}
