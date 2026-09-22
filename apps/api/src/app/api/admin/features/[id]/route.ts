import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/authorize";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { featureInputSchema } from "@/lib/feature-schema";
import { deleteFeatureService, renameFeatureService } from "@/services/feature.service";

export async function PATCH(
  request: NextRequest,
  context: RouteContext<"/api/admin/features/[id]">,
) {
  try {
    await requireRole(request, "ADMIN");
    const { id } = await context.params;

    const body = await request.json().catch(() => null);
    const parsed = featureInputSchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos inválidos");
    }

    const feature = await renameFeatureService(id, parsed.data.name);
    return NextResponse.json(feature, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext<"/api/admin/features/[id]">,
) {
  try {
    await requireRole(request, "ADMIN");
    const { id } = await context.params;
    await deleteFeatureService(id);
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
