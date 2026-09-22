import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/authorize";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { attachPropertyImageSchema } from "@/lib/property-image-schema";
import { addPropertyImage } from "@/services/property-image.service";

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/admin/properties/[id]/images">,
) {
  try {
    await requireRole(request, "ADMIN");
    const { id } = await context.params;

    const body = await request.json().catch(() => null);
    const parsed = attachPropertyImageSchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos de la imagen inválidos");
    }

    const image = await addPropertyImage(id, parsed.data);
    return NextResponse.json(image, { status: 201, headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
