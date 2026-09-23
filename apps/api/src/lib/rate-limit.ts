const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 100;

type WindowState = {
  count: number;
  windowStart: number;
};

// Contador en memoria por IP. Vive mientras el proceso del servidor esté
// arriba: se reinicia si el servidor reinicia y no se comparte entre
// instancias si en el futuro se corre más de una — suficiente para frenar
// bots que bombardean requests contra una sola instancia (ver plan.md §10).
const requestCounts = new Map<string, WindowState>();

// Sin este barrido, IPs que dejan de pedir (visitantes únicos, bots con IP
// rotativa) quedarían para siempre en el mapa. Se limpia cada ~1000 checks
// en vez de con un timer, para no depender de setInterval en el runtime.
let checksSinceCleanup = 0;
const CLEANUP_EVERY_N_CHECKS = 1000;

function cleanupStaleEntries(now: number) {
  for (const [ip, state] of requestCounts) {
    if (now - state.windowStart >= WINDOW_MS) {
      requestCounts.delete(ip);
    }
  }
}

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  checksSinceCleanup += 1;
  if (checksSinceCleanup >= CLEANUP_EVERY_N_CHECKS) {
    checksSinceCleanup = 0;
    cleanupStaleEntries(now);
  }

  const state = requestCounts.get(ip);

  if (!state || now - state.windowStart >= WINDOW_MS) {
    requestCounts.set(ip, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  state.count += 1;

  if (state.count > MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((state.windowStart + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return headers.get("x-real-ip") ?? "unknown";
}
