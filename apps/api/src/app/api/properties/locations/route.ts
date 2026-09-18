import { NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { toErrorResponse } from "@/lib/http-error";
import { getPropertyLocations } from "@/services/property.service";

export async function GET() {
  try {
    const locations = await getPropertyLocations();
    return NextResponse.json(locations, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
