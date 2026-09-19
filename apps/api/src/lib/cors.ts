const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN ?? "http://localhost:3000";

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export function corsPreflightResponse() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
