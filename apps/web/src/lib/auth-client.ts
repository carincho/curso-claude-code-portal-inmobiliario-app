import type {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  UserDTO,
} from "@portal-inmobiliario/shared-types";

async function parseUserResponse(response: Response): Promise<UserDTO> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo completar la operación");
  }

  return response.json();
}

export async function registerUser(apiUrl: string, input: RegisterInput): Promise<UserDTO> {
  const response = await fetch(`${apiUrl}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseUserResponse(response);
}

export async function loginUser(apiUrl: string, input: LoginInput): Promise<UserDTO> {
  const response = await fetch(`${apiUrl}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseUserResponse(response);
}

export async function updateProfile(
  apiUrl: string,
  input: UpdateProfileInput,
): Promise<UserDTO> {
  const response = await fetch(`${apiUrl}/api/auth/me`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseUserResponse(response);
}

export async function logoutUser(apiUrl: string): Promise<void> {
  await fetch(`${apiUrl}/api/auth/logout`, { method: "POST", credentials: "include" });
}

export async function fetchCurrentUser(apiUrl: string): Promise<UserDTO | null> {
  const response = await fetch(`${apiUrl}/api/auth/me`, { credentials: "include" });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
