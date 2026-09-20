import { NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { propertyFiltersSchema } from "@/lib/property-filters-schema";
import { parseSearchParams } from "@/lib/search-params";
import { listPublicProperties } from "@/services/property.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = propertyFiltersSchema.safeParse(parseSearchParams(searchParams));

    if (!parsed.success) {
      throw new HttpError(400, "Parámetros de filtro inválidos");
    }

    const properties = await listPublicProperties(parsed.data);
    return NextResponse.json(properties, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
