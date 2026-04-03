import { requestApi } from "@/lib/api/http";
import type { JobStatus, JobType } from "@/lib/validators/jobs";

export const JOBS_UPDATED_STORAGE_KEY = "startupwork.jobs.updatedAt";
export const JOBS_UPDATED_EVENT = "startupwork:jobs-updated";

type JobShape = {
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
  salaryRange?: string;
  skills?: string[];
  status: JobStatus;
  isActive: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type WorkerPublicJob = Omit<JobShape, "salaryRange" | "skills"> & {
  salaryRange?: string | null;
  skills?: string[] | null;
};

export type PublicJob = Omit<WorkerPublicJob, "salaryRange" | "skills"> & {
  salaryRange?: string;
  skills?: string[];
};

export type PublicJobsListResult = {
  items: PublicJob[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PublicJobsQuery = {
  search?: string;
  type?: JobType | "all";
  country?: string;
  location?: string;
  department?: string;
  remoteOnly?: boolean;
  page?: number;
  pageSize?: number;
};

function buildQuery(params: PublicJobsQuery) {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
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

function mapPublicJob(job: WorkerPublicJob): PublicJob {
  return {
    ...job,
    salaryRange: job.salaryRange ?? undefined,
    skills: job.skills ?? [],
  };
}

export async function listPublicJobs(query: PublicJobsQuery, options: { signal?: AbortSignal } = {}) {
  const result = await requestApi<Omit<PublicJobsListResult, "items"> & { items: WorkerPublicJob[] }>(
    `/api/v1/jobs${buildQuery(query)}`,
    {
      signal: options.signal,
    },
  );

  return {
    ...result.data,
    items: result.data.items.map((job) => mapPublicJob(job)),
  };
}

export async function getPublicJobBySlug(jobSlug: string, options: { signal?: AbortSignal } = {}) {
  const result = await requestApi<WorkerPublicJob>(`/api/v1/jobs/${encodeURIComponent(jobSlug)}`, {
    signal: options.signal,
  });

  return mapPublicJob(result.data);
}
