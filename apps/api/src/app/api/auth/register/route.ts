import { NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { registerSchema } from "@/lib/auth-schema";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { AUTH_COOKIE_NAME, sessionCookieOptions } from "@/lib/session";
import { registerUser } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos de registro inválidos");
    }

    const { user, token } = await registerUser(parsed.data);
    const response = NextResponse.json(user, { status: 201, headers: corsHeaders });
    response.cookies.set(AUTH_COOKIE_NAME, token, sessionCookieOptions);
    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
