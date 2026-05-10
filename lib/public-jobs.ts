import type { PublicJob } from "@/lib/api/jobs";
import type { JobType } from "@/lib/validators/jobs";

const remotePattern = /\bremote\b/i;

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

export function buildPublicJobPath(slug: string) {
  return `/jobs/${slug}`;
}

export function formatPublicJobType(value: JobType | string) {
  if (value === "full-time") {
    return "Full-time";
  }

  if (value === "part-time") {
    return "Part-time";
  }

  if (value === "contract") {
    return "Contract";
  }

  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function mapPublicJobEmploymentType(value: JobType) {
  if (value === "full-time") {
    return "FULL_TIME";
  }

  if (value === "part-time") {
    return "PART_TIME";
  }

  if (value === "contract") {
    return "CONTRACTOR";
  }

  return value.toUpperCase().replace(/[-\s]+/g, "_");
}

export function formatPublicJobPostedDate(value: string | null | undefined) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatPublicJobReference(id: string) {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}

export function normalizePublicJobText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function getPublicJobPostedAt(job: Pick<PublicJob, "publishedAt" | "updatedAt">) {
  return job.publishedAt ?? job.updatedAt;
}

export function isRemotePublicJob(job: Pick<PublicJob, "city" | "location">) {
  return remotePattern.test(job.city) || remotePattern.test(job.location);
}

export function buildPublicJobMetaDescription(job: PublicJob) {
  const roleSummary = normalizePublicJobText(job.description);
  const headline = `${job.title} at Tekorix in ${job.location}.`;
  return truncateText(`${headline} ${roleSummary}`, 160);
}

export function buildPublicJobKeywords(job: PublicJob) {
  const keywords = [
    job.title,
    job.department,
    job.location,
    formatPublicJobType(job.type),
    "Tekorix careers",
    "technology jobs",
    "job openings",
  ];

  return Array.from(
    new Set(
      keywords
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}
