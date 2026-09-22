import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/authorize";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { adminInquiryFiltersSchema } from "@/lib/inquiry-schema";
import { parseSearchParams } from "@/lib/search-params";
import { listAdminInquiries } from "@/services/inquiry.service";

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");

    const { searchParams } = new URL(request.url);
    const parsed = adminInquiryFiltersSchema.safeParse(parseSearchParams(searchParams));

    if (!parsed.success) {
      throw new HttpError(400, "Parámetros de filtro inválidos");
    }

    const inquiries = await listAdminInquiries(parsed.data);
    return NextResponse.json(inquiries, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
