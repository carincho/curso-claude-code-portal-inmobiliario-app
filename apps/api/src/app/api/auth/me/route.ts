import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { requireUser } from "@/lib/authorize";
import { toErrorResponse } from "@/lib/http-error";
import { getAuthenticatedUser } from "@/services/auth.service";

export async function GET(request: NextRequest) {
  try {
    const session = await requireUser(request);
    const user = await getAuthenticatedUser(session.sub);
    return NextResponse.json(user, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
