import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { requireRole } from "@/lib/authorize";
import { toErrorResponse } from "@/lib/http-error";
import { getDashboardStats } from "@/services/dashboard.service";

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
    const stats = await getDashboardStats();
    return NextResponse.json(stats, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
