import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { requireUser } from "@/lib/authorize";
import { toErrorResponse } from "@/lib/http-error";
import { addFavorite, removeFavorite } from "@/services/favorite.service";

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/favorites/[propertyId]">,
) {
  try {
    const session = await requireUser(request);
    const { propertyId } = await context.params;
    await addFavorite(session.sub, propertyId);
    return NextResponse.json({ success: true }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext<"/api/favorites/[propertyId]">,
) {
  try {
    const session = await requireUser(request);
    const { propertyId } = await context.params;
    await removeFavorite(session.sub, propertyId);
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
