import { requestApi } from "@/lib/api/http";
import type { JobFormValues, JobStatus, JobType } from "@/lib/validators/jobs";

const JOBS_UPDATED_STORAGE_KEY = "startupwork.jobs.updatedAt";
const JOBS_UPDATED_EVENT = "startupwork:jobs-updated";

export type AdminJobStatus = JobStatus | "closed";

type WorkerAdminJob = {
  id: string;
  title: string;
  slug: string;
  department: string;
  country: string;
  city: string;
  location: string;
  description: string;
  experience: string;
  type: JobType;
  salaryRange?: string | null;
  skills?: string[] | null;
  status: AdminJobStatus;
  isActive: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminJob = Omit<WorkerAdminJob, "salaryRange" | "skills"> & {
  salaryRange?: string;
  skills: string[];
};

export type AdminJobsListResult = {
  items: AdminJob[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type AdminJobsListQuery = {
  search?: string;
  status?: AdminJobStatus | "all";
  type?: JobType | "all";
  country?: string;
  location?: string;
  department?: string;
  remoteOnly?: boolean;
  page?: number;
  pageSize?: number;
};

export type AdminJobsMetadataBucket = {
  key: string;
  label: string;
  total: number;
  published: number;
  draft: number;
  closed: number;
};

export type AdminJobsTypeMetadata = {
  type: string;
  label: string;
  total: number;
  published: number;
  draft: number;
  closed: number;
};

export type AdminJobsMetadata = {
  totalJobs: number;
  publishedJobs: number;
  draftJobs: number;
  closedJobs: number;
  departments: AdminJobsMetadataBucket[];
  countries: AdminJobsMetadataBucket[];
  locations: AdminJobsMetadataBucket[];
  skills: AdminJobsMetadataBucket[];
  jobTypes: AdminJobsTypeMetadata[];
};

export type AdminJobPublishPayload = {
  status?: AdminJobStatus;
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

function buildQuery(params: AdminJobsListQuery) {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.status && params.status !== "all") {
    query.set("status", params.status);
  }

  if (params.type && params.type !== "all") {
    query.set("type", params.type);
  }

  if (params.country && params.country !== "all") {
    query.set("country", params.country);
  }

  if (params.location && params.location !== "all") {
    query.set("location", params.location);
  }

  if (params.department && params.department !== "all") {
    query.set("department", params.department);
  }

  if (params.remoteOnly) {
    query.set("remoteOnly", "true");
  }

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.pageSize) {
    query.set("pageSize", String(params.pageSize));
  }

  const value = query.toString();
  return value ? `?${value}` : "";
}

function mapAdminJob(job: WorkerAdminJob): AdminJob {
  return {
    ...job,
    salaryRange: job.salaryRange ?? undefined,
    skills: job.skills ?? [],
  };
}

function notifyJobsUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  const stamp = new Date().toISOString();

  try {
    window.localStorage.setItem(JOBS_UPDATED_STORAGE_KEY, stamp);
  } catch {
    // Ignore storage failures.
  }

  window.dispatchEvent(new Event(JOBS_UPDATED_EVENT));
}

export async function getAdminJobs(query: AdminJobsListQuery = {}, context?: AdminAuthContext) {
  const result = await requestApi<Omit<AdminJobsListResult, "items"> & { items: WorkerAdminJob[] }>(
    `/api/v1/admin/jobs${buildQuery(query)}`,
    withAdminAuth(context),
  );

  return {
    ...result.data,
    items: result.data.items.map((job) => mapAdminJob(job)),
  } satisfies AdminJobsListResult;
}

export async function getAdminJobById(id: string, context?: AdminAuthContext) {
  const result = await requestApi<WorkerAdminJob>(`/api/v1/admin/jobs/${id}`, withAdminAuth(context));
  return mapAdminJob(result.data);
}

export async function getAdminJobsMetadata(context?: AdminAuthContext) {
  const result = await requestApi<AdminJobsMetadata>("/api/v1/admin/jobs/meta", withAdminAuth(context));
  return result.data;
}

export async function createAdminJob(payload: JobFormValues, context?: AdminAuthContext) {
  const result = await requestApi<WorkerAdminJob, JobFormValues>("/api/v1/admin/jobs", {
    ...withAdminAuth(context),
    method: "POST",
    body: payload,
  });

  notifyJobsUpdated();

  return {
    ...result,
    data: mapAdminJob(result.data),
  };
}

export async function updateAdminJob(id: string, payload: JobFormValues, context?: AdminAuthContext) {
  const result = await requestApi<WorkerAdminJob, JobFormValues>(`/api/v1/admin/jobs/${id}`, {
    ...withAdminAuth(context),
    method: "PUT",
    body: payload,
  });

  notifyJobsUpdated();

  return {
    ...result,
    data: mapAdminJob(result.data),
  };
}

export async function deleteAdminJob(id: string, context?: AdminAuthContext) {
  const result = await requestApi<null>(`/api/v1/admin/jobs/${id}`, {
    ...withAdminAuth(context),
    method: "DELETE",
  });

  notifyJobsUpdated();
  return result;
}

export async function publishAdminJob(
  id: string,
  payload: AdminJobPublishPayload = {},
  context?: AdminAuthContext,
) {
  const result = await requestApi<WorkerAdminJob, AdminJobPublishPayload>(`/api/v1/admin/jobs/${id}/publish`, {
    ...withAdminAuth(context),
    method: "PATCH",
    body: payload,
  });

  notifyJobsUpdated();

  return {
    ...result,
    data: mapAdminJob(result.data),
  };
}
