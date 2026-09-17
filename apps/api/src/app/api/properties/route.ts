import { NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { toErrorResponse } from "@/lib/http-error";
import { listPublicProperties } from "@/services/property.service";

export async function GET() {
  try {
    const properties = await listPublicProperties();
    return NextResponse.json(properties, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
