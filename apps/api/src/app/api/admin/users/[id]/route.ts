import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/authorize";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { adminUpdateUserSchema } from "@/lib/admin-user-schema";
import { updateUserAdminService } from "@/services/user.service";

export async function PATCH(
  request: NextRequest,
  context: RouteContext<"/api/admin/users/[id]">,
) {
  try {
    const session = await requireRole(request, "ADMIN");
    const { id } = await context.params;

    const body = await request.json().catch(() => null);
    const parsed = adminUpdateUserSchema.safeParse(body);

    if (!parsed.success) {
      throw new HttpError(400, "Datos inválidos");
    }

    const user = await updateUserAdminService(id, session, parsed.data);
    return NextResponse.json(user, { headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
