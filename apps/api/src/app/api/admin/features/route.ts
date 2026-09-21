import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/authorize";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { toErrorResponse } from "@/lib/http-error";
import { listFeatures } from "@/services/feature.service";

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
    const features = await listFeatures();
    return NextResponse.json(features, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
