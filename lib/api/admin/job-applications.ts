import { requestApi, requestBinary } from "@/lib/api/http";
import type { JobApplicationStatus } from "@/lib/validators/job-applications";

export type AdminJobApplication = {
  id: string;
  jobId: string;
  jobTitle: string;
  jobLocation: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  coverLetter: string;
  adminNotes: string;
  status: JobApplicationStatus;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  isRead: boolean;
  resume: {
    originalName: string;
    storedName: string;
    contentType: string;
    size: number;
  };
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

function parseFileName(contentDisposition: string | null, fallback: string) {
  if (!contentDisposition) {
    return fallback;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const plainMatch = contentDisposition.match(/filename="([^"]+)"/i) ?? contentDisposition.match(/filename=([^;]+)/i);
  return plainMatch?.[1]?.trim() || fallback;
}

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 0);
}

export async function getAdminJobApplications(context?: AdminAuthContext) {
  const result = await requestApi<{
    items: AdminJobApplication[];
    unreadCount: number;
  }>("/api/admin/job-applications", withAdminAuth(context));

  return result.data;
}

export async function getAdminJobApplicationById(id: string, context?: AdminAuthContext) {
  const result = await requestApi<AdminJobApplication>(`/api/admin/job-applications/${id}`, withAdminAuth(context));
  return result.data;
}

export async function updateAdminJobApplicationStatus(
  id: string,
  status: JobApplicationStatus,
  context?: AdminAuthContext,
) {
  const result = await requestApi<AdminJobApplication, { status: JobApplicationStatus }>(
    `/api/admin/job-applications/${id}`,
    {
      ...withAdminAuth(context),
      method: "PATCH",
      body: { status },
    },
  );

  return result;
}

export async function markAdminJobApplicationRead(id: string, context?: AdminAuthContext) {
  const result = await requestApi<AdminJobApplication>(`/api/admin/job-applications/${id}`, {
    ...withAdminAuth(context),
    method: "PATCH",
  });

  return result;
}

export async function updateAdminJobApplicationNotes(id: string, adminNotes: string, context?: AdminAuthContext) {
  return requestApi<AdminJobApplication, { adminNotes: string }>(`/api/admin/job-applications/${id}`, {
    ...withAdminAuth(context),
    method: "PATCH",
    body: { adminNotes },
  });
}

export async function markAllAdminJobApplicationsRead(context?: AdminAuthContext) {
  return requestApi<null, { markAll: true }>("/api/admin/job-applications", {
    ...withAdminAuth(context),
    method: "PATCH",
    body: { markAll: true },
  });
}

export async function deleteAdminJobApplication(
  id: string,
  options: { scope?: "applications" | "candidates" } = {},
  context?: AdminAuthContext,
) {
  return requestApi<AdminJobApplication, { id: string; scope?: "applications" | "candidates" }>(
    "/api/admin/job-applications",
    {
      ...withAdminAuth(context),
      method: "DELETE",
      body: {
        id,
        ...(options.scope ? { scope: options.scope } : {}),
      },
    },
  );
}

export async function deleteAllAdminJobApplications(
  options: { scope?: "applications" | "candidates" } = {},
  context?: AdminAuthContext,
) {
  return requestApi<{ deletedCount: number }, { deleteAll: true; scope?: "applications" | "candidates" }>(
    "/api/admin/job-applications",
    {
      ...withAdminAuth(context),
      method: "DELETE",
      body: {
        deleteAll: true,
        ...(options.scope ? { scope: options.scope } : {}),
      },
    },
  );
}

export async function downloadAdminJobApplicationResume(id: string, context?: AdminAuthContext) {
  const response = await requestBinary(`/api/admin/job-applications/${id}/resume`, withAdminAuth(context));
  const blob = await response.blob();
  const fileName = parseFileName(response.headers.get("Content-Disposition"), `${id}-resume`);
  triggerBrowserDownload(blob, fileName);
  return {
    fileName,
  };
}
