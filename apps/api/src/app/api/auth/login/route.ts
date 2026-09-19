import { NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { loginSchema } from "@/lib/auth-schema";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { AUTH_COOKIE_NAME, sessionCookieOptions } from "@/lib/session";
import { loginUser } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos de acceso inválidos");
    }

    const { user, token } = await loginUser(parsed.data);
    const response = NextResponse.json(user, { headers: corsHeaders });
    response.cookies.set(AUTH_COOKIE_NAME, token, sessionCookieOptions);
    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
