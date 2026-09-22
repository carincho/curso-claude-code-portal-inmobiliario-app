import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/authorize";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { reorderPropertyImagesSchema } from "@/lib/property-image-schema";
import { reorderPropertyImagesService } from "@/services/property-image.service";

export async function PUT(
  request: NextRequest,
  context: RouteContext<"/api/admin/properties/[id]/images-reorder">,
) {
  try {
    await requireRole(request, "ADMIN");
    const { id } = await context.params;

    const body = await request.json().catch(() => null);
    const parsed = reorderPropertyImagesSchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos inválidos: envía { imageIds: string[] }");
    }

    await reorderPropertyImagesService(id, parsed.data.imageIds);
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
