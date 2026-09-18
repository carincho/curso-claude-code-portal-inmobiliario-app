import { NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { createInquirySchema } from "@/lib/inquiry-schema";
import { submitInquiry } from "@/services/inquiry.service";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = createInquirySchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos de la consulta inválidos");
    }

    const inquiry = await submitInquiry(parsed.data);
    return NextResponse.json(inquiry, { status: 201, headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
