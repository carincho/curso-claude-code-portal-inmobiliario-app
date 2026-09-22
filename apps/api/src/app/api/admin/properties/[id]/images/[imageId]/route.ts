import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/authorize";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { setMainPropertyImageSchema } from "@/lib/property-image-schema";
import { removePropertyImage, setPropertyMainImage } from "@/services/property-image.service";

export async function DELETE(
  request: NextRequest,
  context: RouteContext<"/api/admin/properties/[id]/images/[imageId]">,
) {
  try {
    await requireRole(request, "ADMIN");
    const { id, imageId } = await context.params;
    await removePropertyImage(id, imageId);
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext<"/api/admin/properties/[id]/images/[imageId]">,
) {
  try {
    await requireRole(request, "ADMIN");
    const { id, imageId } = await context.params;

    const body = await request.json().catch(() => null);
    const parsed = setMainPropertyImageSchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos inválidos: envía { isMain: true }");
    }

    await setPropertyMainImage(id, imageId);
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
