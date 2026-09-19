export type Role = "USER" | "ADMIN";

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type UpdateProfileInput = {
  name: string;
  email: string;
  password?: string;
};
