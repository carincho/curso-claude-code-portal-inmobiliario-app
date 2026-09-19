import type { NextRequest } from "next/server";
import type { Role } from "@portal-inmobiliario/shared-types";
import { HttpError } from "@/lib/http-error";
import { getSessionTokenFromRequest, verifySessionToken, type SessionPayload } from "@/lib/session";

export async function getSessionUser(request: NextRequest): Promise<SessionPayload | null> {
  const token = getSessionTokenFromRequest(request);

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function requireUser(request: NextRequest): Promise<SessionPayload> {
  const session = await getSessionUser(request);

  if (!session) {
    throw new HttpError(401, "No autenticado");
  }

  return session;
}

export async function requireRole(request: NextRequest, role: Role): Promise<SessionPayload> {
  const session = await requireUser(request);

  if (session.role !== role) {
    throw new HttpError(403, "No tienes permisos para acceder a este recurso");
  }

  return session;
}
