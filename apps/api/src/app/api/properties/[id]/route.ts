import { NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { toErrorResponse } from "@/lib/http-error";
import { getPublicProperty } from "@/services/property.service";

export async function GET(_request: Request, context: RouteContext<"/api/properties/[id]">) {
  try {
    const { id } = await context.params;
    const property = await getPublicProperty(id);
    return NextResponse.json(property, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
