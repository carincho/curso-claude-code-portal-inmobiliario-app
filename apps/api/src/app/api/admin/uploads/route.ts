import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/authorize";
import { corsHeaders, corsPreflightResponse } from "@/lib/cors";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { uploadPropertyImage } from "@/services/upload.service";

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");

    const formData = await request.formData().catch(() => null);
    const file = formData?.get("file");

    if (!file || !(file instanceof File)) {
      throw new HttpError(400, "Debes adjuntar un archivo de imagen en el campo 'file'");
    }

    const uploaded = await uploadPropertyImage(file);
    return NextResponse.json(uploaded, { status: 201, headers: corsHeaders });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function OPTIONS() {
  return corsPreflightResponse();
}
