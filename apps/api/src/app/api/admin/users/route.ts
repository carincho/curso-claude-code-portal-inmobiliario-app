import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/authorize";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { adminCreateUserSchema, adminUserFiltersSchema } from "@/lib/admin-user-schema";
import { parseSearchParams } from "@/lib/search-params";
import { createUserAdminService, listUsers } from "@/services/user.service";

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");

    const { searchParams } = new URL(request.url);
    const parsed = adminUserFiltersSchema.safeParse(parseSearchParams(searchParams));

    if (!parsed.success) {
      throw new HttpError(400, "Parámetros de filtro inválidos");
    }

    const users = await listUsers(parsed.data);
    return NextResponse.json(users, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");

    const body = await request.json().catch(() => null);
    const parsed = adminCreateUserSchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos de usuario inválidos");
    }

    const user = await createUserAdminService(parsed.data);
    return NextResponse.json(user, { status: 201, headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
