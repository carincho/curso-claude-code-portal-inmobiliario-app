import type {
  CreateInquiryInput,
  InquiryDTO,
  InquiryWithPropertyDTO,
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

export async function fetchMyInquiries(apiUrl: string): Promise<InquiryWithPropertyDTO[]> {
  const response = await fetch(`${apiUrl}/api/inquiries/me`, { credentials: "include" });

  if (!response.ok) {
    throw new Error("No se pudieron cargar tus consultas");
  }

  return response.json();
}
