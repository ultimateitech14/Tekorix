import { requestApi } from "@/lib/api/http";

export type ResumeBankItem = {
  applicationId: string;
  fullName: string;
  jobTitle: string;
  jobLocation: string;
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

export async function getAdminResumeBank(context?: AdminAuthContext) {
  const result = await requestApi<{ items: ResumeBankItem[] }>("/api/admin/resume-bank", withAdminAuth(context));
  return result.data;
}

export async function deleteAdminResumeBankEntry(applicationId: string, context?: AdminAuthContext) {
  return requestApi<{ deletedCount: number }, { applicationId: string }>("/api/admin/resume-bank", {
    ...withAdminAuth(context),
    method: "DELETE",
    body: { applicationId },
  });
}

export async function deleteSelectedAdminResumeBankEntries(applicationIds: string[], context?: AdminAuthContext) {
  return requestApi<{ deletedCount: number }, { applicationIds: string[] }>("/api/admin/resume-bank", {
    ...withAdminAuth(context),
    method: "DELETE",
    body: { applicationIds },
  });
}

export async function clearAdminResumeBank(context?: AdminAuthContext) {
  return requestApi<{ deletedCount: string }, { deleteAll: true }>("/api/admin/resume-bank", {
    ...withAdminAuth(context),
    method: "DELETE",
    body: { deleteAll: true },
  });
}
