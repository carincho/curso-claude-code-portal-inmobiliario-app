import type { Role, UserDTO } from "@portal-inmobiliario/shared-types";

export type AdminUsersFilters = {
  search?: string;
  role?: Role;
};

export type AdminCreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type AdminUpdateUserInput = {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  isActive?: boolean;
};

async function parseUserResponse(response: Response): Promise<UserDTO> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo completar la operación");
  }

  return response.json();
}

export async function fetchUsers(
  apiUrl: string,
  filters: AdminUsersFilters = {},
): Promise<UserDTO[]> {
  const searchParams = new URLSearchParams();

  if (filters.search) {
    searchParams.set("search", filters.search);
  }

  if (filters.role) {
    searchParams.set("role", filters.role);
  }

  const query = searchParams.toString();
  const response = await fetch(`${apiUrl}/api/admin/users${query ? `?${query}` : ""}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar los usuarios");
  }

  return response.json();
}

export async function createUser(
  apiUrl: string,
  input: AdminCreateUserInput,
): Promise<UserDTO> {
  const response = await fetch(`${apiUrl}/api/admin/users`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseUserResponse(response);
}

export async function updateUser(
  apiUrl: string,
  id: string,
  input: AdminUpdateUserInput,
): Promise<UserDTO> {
  const response = await fetch(`${apiUrl}/api/admin/users/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseUserResponse(response);
}
