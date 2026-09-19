import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { requireUser } from "@/lib/authorize";
import { toErrorResponse } from "@/lib/http-error";
import { listUserFavorites } from "@/services/favorite.service";

export async function GET(request: NextRequest) {
  try {
    const session = await requireUser(request);
    const favorites = await listUserFavorites(session.sub);
    return NextResponse.json(favorites, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
