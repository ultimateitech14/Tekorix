import { requestApi } from "@/lib/api/http";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  roleDescription: string;
  permissions: string[];
  status: "active";
  lastSignInAt: string | null;
  passwordUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getAdminUsers() {
  const result = await requestApi<AdminUser[]>("/api/admin/users", {
    auth: true,
  });

  return result.data;
}
