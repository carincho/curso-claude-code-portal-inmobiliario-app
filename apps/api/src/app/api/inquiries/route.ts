import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { getSessionUser } from "@/lib/authorize";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { createInquirySchema } from "@/lib/inquiry-schema";
import { submitInquiry } from "@/services/inquiry.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = createInquirySchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos de la consulta inválidos");
    }

    const session = await getSessionUser(request);
    const inquiry = await submitInquiry(parsed.data, session?.sub);
    return NextResponse.json(inquiry, { status: 201, headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
