import type { NextRequest } from "next/server";
import type { Role } from "@portal-inmobiliario/shared-types";
import { HttpError } from "@/lib/http-error";
import { prisma } from "@/lib/prisma";
import { getSessionTokenFromRequest, verifySessionToken, type SessionPayload } from "@/lib/session";

// El JWT solo prueba identidad; el rol y el estado activo se releen en cada
// request para que revocar acceso o cambiar un rol tenga efecto inmediato,
// en vez de esperar a que expire el token (hasta 7 días).
export async function getSessionUser(request: NextRequest): Promise<SessionPayload | null> {
  const token = getSessionTokenFromRequest(request);

  if (!token) {
    return null;
  }

  const payload = await verifySessionToken(token);

  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return { sub: payload.sub, role: user.role };
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
