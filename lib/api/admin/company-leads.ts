import { requestApi } from "@/lib/api/http";
import type { CompanyLeadValues } from "@/lib/validators/company-lead";

export type AdminCompanyLead = {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  need: CompanyLeadValues["need"];
  message: string;
  sourcePage: "contact" | "find-talent" | "unknown";
  status: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

type AdminAuthContext = {
  token?: string | null;
};

function withAdminAuth(context?: AdminAuthContext) {
  return {
    auth: true as const,
    token: context?.token,
  };
}

export async function getAdminCompanyLeads(context?: AdminAuthContext) {
  const result = await requestApi<AdminCompanyLead[]>("/api/v1/admin/company-leads", withAdminAuth(context));
  return result.data;
}

export async function getAdminCompanyLeadById(id: string, context?: AdminAuthContext) {
  const result = await requestApi<AdminCompanyLead>(`/api/v1/admin/company-leads/${id}`, withAdminAuth(context));
  return result.data;
}

export async function markAdminCompanyLeadRead(id: string, context?: AdminAuthContext) {
  const result = await requestApi<AdminCompanyLead>(`/api/v1/admin/company-leads/${id}/read`, {
    ...withAdminAuth(context),
    method: "PATCH",
  });

  return result.data;
}
