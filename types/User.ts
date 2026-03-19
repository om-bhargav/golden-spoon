export type UserRole =
  | "ADMIN"
  | "USER"
  | "CHEF";

export interface User {
  id: string;
  restraunt_id: string;
  /* Basic Info */
  name: string;
  email: string;
  phone?: string;
  password: string;
  /* Role & Permissions */
  role: UserRole;
  updatedAt?: string;
  /* Optional System Fields */
  createdAt?: string;
  balance: 0
}