import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/authorize";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { featureInputSchema } from "@/lib/feature-schema";
import { createFeatureService, listFeatures } from "@/services/feature.service";

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
    const features = await listFeatures();
    return NextResponse.json(features, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");

    const body = await request.json().catch(() => null);
    const parsed = featureInputSchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos inválidos");
    }

    const feature = await createFeatureService(parsed.data.name);
    return NextResponse.json(feature, { status: 201, headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
