import { NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { AUTH_COOKIE_NAME, sessionCookieOptions } from "@/lib/session";

export function POST() {
  const response = NextResponse.json({ success: true }, { headers: corsHeaders });
  response.cookies.set(AUTH_COOKIE_NAME, "", { ...sessionCookieOptions, maxAge: 0 });
  return response;
}

export function OPTIONS() {
  return corsPreflightResponse();
}
