import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function toErrorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { message: error.message, status: error.status },
      { status: error.status, headers: corsHeaders },
    );
  }

  console.error(error);
  return NextResponse.json(
    { message: "Error interno del servidor", status: 500 },
    { status: 500, headers: corsHeaders },
  );
}
