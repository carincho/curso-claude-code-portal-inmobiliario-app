import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { requireUser } from "@/lib/authorize";
import { toErrorResponse } from "@/lib/http-error";
import { listUserInquiries } from "@/services/inquiry.service";

export async function GET(request: NextRequest) {
  try {
    const session = await requireUser(request);
    const inquiries = await listUserInquiries(session.sub);
    return NextResponse.json(inquiries, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
