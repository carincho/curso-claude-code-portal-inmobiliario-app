import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/authorize";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { propertyInputSchema } from "@/lib/admin-property-schema";
import { propertyFiltersSchema } from "@/lib/property-filters-schema";
import { parseSearchParams } from "@/lib/search-params";
import { createAdminProperty, listAdminProperties } from "@/services/property.service";

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");

    const { searchParams } = new URL(request.url);
    const parsed = propertyFiltersSchema.safeParse(parseSearchParams(searchParams));

    if (!parsed.success) {
      throw new HttpError(400, "Parámetros de filtro inválidos");
    }

    const properties = await listAdminProperties(parsed.data);
    return NextResponse.json(properties, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");

    const body = await request.json().catch(() => null);
    const parsed = propertyInputSchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos de la propiedad inválidos");
    }

    const property = await createAdminProperty(parsed.data);
    return NextResponse.json(property, { status: 201, headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
