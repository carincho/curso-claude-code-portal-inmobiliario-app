import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { requireUser } from "@/lib/authorize";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { inquiryListQuerySchema } from "@/lib/inquiry-schema";
import { listUserInquiries } from "@/services/inquiry.service";

export async function GET(request: NextRequest) {
  try {
    const session = await requireUser(request);
    const { searchParams } = new URL(request.url);
    const parsed = inquiryListQuerySchema.safeParse({
      search: searchParams.get("search") ?? undefined,
      page: searchParams.get("page") ?? undefined,
    });

    if (!parsed.success) {
      throw new HttpError(400, "Parámetros de búsqueda inválidos");
    }

    const inquiries = await listUserInquiries(session.sub, parsed.data);
    return NextResponse.json(inquiries, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
