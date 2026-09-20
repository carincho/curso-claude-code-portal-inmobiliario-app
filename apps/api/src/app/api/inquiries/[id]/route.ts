import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { requireUser } from "@/lib/authorize";
import { toErrorResponse } from "@/lib/http-error";
import { deleteUserInquiry } from "@/services/inquiry.service";

export async function DELETE(request: NextRequest, context: RouteContext<"/api/inquiries/[id]">) {
  try {
    const session = await requireUser(request);
    const { id } = await context.params;
    await deleteUserInquiry(session.sub, id);
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
