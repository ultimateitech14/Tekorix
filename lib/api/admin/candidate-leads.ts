import { requestApi, requestBinary } from "@/lib/api/http";

export type AdminCandidateLeadSubmissionType =
  | "contact-candidate"
  | "resume-submission"
  | "market-resume";

export type AdminCandidateLeadSourcePage = "contact" | "find-job" | "unknown";

export type AdminCandidateLeadResumeContentType =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type AdminCandidateLeadResume = {
  objectKey: string;
  fileName: string;
  contentType: AdminCandidateLeadResumeContentType;
};

export type AdminCandidateLeadResumeFile = {
  blob: Blob;
  contentType: string;
};

export type AdminCandidateLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  linkedInUrl: string | null;
  desiredLocation: string | null;
  desiredSalaryRange: string | null;
  skills: string | null;
  submissionType: AdminCandidateLeadSubmissionType;
  sourcePage: AdminCandidateLeadSourcePage;
  status: string;
  isRead: boolean;
  resume: AdminCandidateLeadResume | null;
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

export async function getAdminCandidateLeads(context?: AdminAuthContext) {
  const result = await requestApi<AdminCandidateLead[]>("/api/v1/admin/candidate-leads", withAdminAuth(context));
  return result.data;
}

export async function getAdminCandidateLeadById(id: string, context?: AdminAuthContext) {
  const result = await requestApi<AdminCandidateLead>(
    `/api/v1/admin/candidate-leads/${id}`,
    withAdminAuth(context),
  );
  return result.data;
}

export async function markAdminCandidateLeadRead(id: string, context?: AdminAuthContext) {
  const result = await requestApi<AdminCandidateLead>(`/api/v1/admin/candidate-leads/${id}/read`, {
    ...withAdminAuth(context),
    method: "PATCH",
  });

  return result.data;
}

export async function getAdminCandidateLeadResume(id: string, context?: AdminAuthContext) {
  const response = await requestBinary(`/api/v1/admin/candidate-leads/${id}/resume`, withAdminAuth(context));

  return {
    blob: await response.blob(),
    contentType: response.headers.get("Content-Type") ?? "application/octet-stream",
  } satisfies AdminCandidateLeadResumeFile;
}
