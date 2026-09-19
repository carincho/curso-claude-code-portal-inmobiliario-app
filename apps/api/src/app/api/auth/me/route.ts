import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { updateProfileSchema } from "@/lib/auth-schema";
import { requireUser } from "@/lib/authorize";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { getAuthenticatedUser, updateUserProfile } from "@/services/auth.service";

export async function GET(request: NextRequest) {
  try {
    const session = await requireUser(request);
    const user = await getAuthenticatedUser(session.sub);
    return NextResponse.json(user, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireUser(request);
    const body = await request.json().catch(() => null);
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos de perfil inválidos");
    }

    const user = await updateUserProfile(session.sub, parsed.data);
    return NextResponse.json(user, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
