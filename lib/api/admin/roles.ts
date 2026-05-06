import { requestApi } from "@/lib/api/http";

export type AdminRole = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
};

export async function getAdminRoles() {
  const result = await requestApi<AdminRole[]>("/api/admin/roles", {
    auth: true,
  });

  return result.data;
}
