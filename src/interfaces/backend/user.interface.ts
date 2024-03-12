import { RoleSlug } from "@prisma/client";

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  roleSlug: RoleSlug;
}
