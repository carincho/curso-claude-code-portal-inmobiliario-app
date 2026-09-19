import { jwtVerify, SignJWT } from "jose";
import type { NextRequest } from "next/server";
import type { Role } from "@portal-inmobiliario/shared-types";

export const AUTH_COOKIE_NAME = "session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 días

export type SessionPayload = {
  sub: string;
  role: Role;
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("La variable de entorno AUTH_SECRET no está configurada");
  }

  return new TextEncoder().encode(secret);
}

export function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (typeof payload.sub !== "string" || (payload.role !== "USER" && payload.role !== "ADMIN")) {
      return null;
    }

    return { sub: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};

export function getSessionTokenFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value;
}
