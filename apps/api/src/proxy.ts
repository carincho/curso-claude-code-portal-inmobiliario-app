import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export function proxy(request: NextRequest) {
  // Los preflight OPTIONS los dispara el navegador automáticamente antes de
  // cada request con credenciales/JSON; contarlos duplicaría el límite real
  // por cada acción del usuario sin aportar protección adicional.
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  const ip = getClientIp(request.headers);
  const { allowed, retryAfterSeconds } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { message: "Demasiadas solicitudes. Intenta nuevamente en unos segundos.", status: 429 },
      {
        status: 429,
        headers: { ...corsHeaders, "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
