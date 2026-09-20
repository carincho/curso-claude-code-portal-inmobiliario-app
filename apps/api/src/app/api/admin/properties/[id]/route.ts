import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/authorize";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { propertyInputSchema } from "@/lib/admin-property-schema";
import {
  deleteAdminProperty,
  getAdminProperty,
  updateAdminProperty,
} from "@/services/property.service";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/admin/properties/[id]">,
) {
  try {
    await requireRole(request, "ADMIN");
    const { id } = await context.params;
    const property = await getAdminProperty(id);
    return NextResponse.json(property, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext<"/api/admin/properties/[id]">,
) {
  try {
    await requireRole(request, "ADMIN");
    const { id } = await context.params;

    const body = await request.json().catch(() => null);
    const parsed = propertyInputSchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos de la propiedad inválidos");
    }

    const property = await updateAdminProperty(id, parsed.data);
    return NextResponse.json(property, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext<"/api/admin/properties/[id]">,
) {
  try {
    await requireRole(request, "ADMIN");
    const { id } = await context.params;
    await deleteAdminProperty(id);
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
