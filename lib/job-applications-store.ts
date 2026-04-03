import "server-only";

import { access, mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";

import type {
  JobApplicationStatus,
  JobApplicationSubmissionValues,
} from "@/lib/validators/job-applications";

export type JobApplicationResume = {
  originalName: string;
  storedName: string;
  contentType: string;
  size: number;
};

export type JobApplication = JobApplicationSubmissionValues & {
  id: string;
  status: JobApplicationStatus;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  isRead: boolean;
  resume: JobApplicationResume;
};

type CreateJobApplicationInput = JobApplicationSubmissionValues & {
  resume: JobApplicationResume;
};

const dataDir = path.join(process.cwd(), "data");
const resumesDirPath = path.join(dataDir, "job-application-resumes");
const storageFilePath = path.join(dataDir, "job-applications.json");
const idPattern = /^APP-(\d+)$/;

function normalizeTimestamp(value: unknown) {
  if (typeof value === "string" && !Number.isNaN(new Date(value).getTime())) {
    return value;
  }

  return new Date().toISOString();
}

function normalizeStatus(value: unknown): JobApplicationStatus {
  if (
    value === "pending review" ||
    value === "shortlisted" ||
    value === "rejected" ||
    value === "interview"
  ) {
    return value;
  }

  return "pending review";
}

function normalizeResume(value: unknown): JobApplicationResume | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const resume = value as Partial<JobApplicationResume>;
  const originalName = typeof resume.originalName === "string" ? resume.originalName.trim() : "";
  const storedName = typeof resume.storedName === "string" ? resume.storedName.trim() : "";
  const contentType = typeof resume.contentType === "string" ? resume.contentType.trim() : "";
  const size = typeof resume.size === "number" && Number.isFinite(resume.size) ? resume.size : 0;

  if (!originalName || !storedName || size <= 0) {
    return null;
  }

  return {
    originalName,
    storedName,
    contentType: contentType || "application/octet-stream",
    size,
  };
}

function normalizeRecord(raw: unknown): JobApplication | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Partial<JobApplication>;
  const id = typeof item.id === "string" ? item.id.trim() : "";
  const jobId = typeof item.jobId === "string" ? item.jobId.trim() : "";
  const jobTitle = typeof item.jobTitle === "string" ? item.jobTitle.trim() : "";
  const jobLocation = typeof item.jobLocation === "string" ? item.jobLocation.trim() : "";
  const fullName = typeof item.fullName === "string" ? item.fullName.trim() : "";
  const email = typeof item.email === "string" ? item.email.trim() : "";
  const phone = typeof item.phone === "string" ? item.phone.trim() : "";
  const location = typeof item.location === "string" ? item.location.trim() : "";
  const experience = typeof item.experience === "string" ? item.experience.trim() : "";
  const coverLetter = typeof item.coverLetter === "string" ? item.coverLetter.trim() : "";
  const resume = normalizeResume(item.resume);

  if (!id || !jobId || !jobTitle || !jobLocation || !fullName || !email || !phone || !location || !experience || !coverLetter || !resume) {
    return null;
  }

  return {
    id,
    jobId,
    jobTitle,
    jobLocation,
    fullName,
    email,
    phone,
    location,
    experience,
    coverLetter,
    status: normalizeStatus(item.status),
    createdAt: normalizeTimestamp(item.createdAt),
    updatedAt: normalizeTimestamp(item.updatedAt),
    reviewedAt:
      typeof item.reviewedAt === "string" && !Number.isNaN(new Date(item.reviewedAt).getTime())
        ? item.reviewedAt
        : null,
    isRead: Boolean(item.isRead),
    resume,
  };
}

function getNextApplicationId(items: JobApplication[]) {
  const max = items.reduce((currentMax, item) => {
    const match = item.id.match(idPattern);

    if (!match) {
      return currentMax;
    }

    const value = Number(match[1]);
    return Number.isInteger(value) ? Math.max(currentMax, value) : currentMax;
  }, 9000);

  return `APP-${String(max + 1).padStart(4, "0")}`;
}

async function readApplicationsFile() {
  try {
    const raw = await readFile(storageFilePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [] as JobApplication[];
    }

    return parsed
      .map((item) => normalizeRecord(item))
      .filter((item): item is JobApplication => Boolean(item));
  } catch {
    return [] as JobApplication[];
  }
}

async function writeApplicationsFile(applications: JobApplication[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(storageFilePath, JSON.stringify(applications, null, 2), "utf8");
}

export async function ensureJobApplicationResumesDir() {
  await mkdir(resumesDirPath, { recursive: true });
}

export function getResumeAbsolutePath(storedName: string) {
  return path.join(resumesDirPath, storedName);
}

export async function createJobApplication(payload: CreateJobApplicationInput) {
  const applications = await readApplicationsFile();
  const now = new Date().toISOString();

  const next: JobApplication = {
    ...payload,
    id: getNextApplicationId(applications),
    status: "pending review",
    createdAt: now,
    updatedAt: now,
    reviewedAt: null,
    isRead: false,
  };

  applications.unshift(next);
  await writeApplicationsFile(applications);

  return next;
}

export async function getJobApplications() {
  const applications = await readApplicationsFile();

  return applications.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getJobApplicationById(id: string) {
  const applications = await readApplicationsFile();
  return applications.find((item) => item.id === id) ?? null;
}

export async function markJobApplicationAsRead(id: string) {
  const applications = await readApplicationsFile();
  let updated: JobApplication | null = null;

  const next = applications.map((item) => {
    if (item.id !== id) {
      return item;
    }

    updated = {
      ...item,
      isRead: true,
      updatedAt: new Date().toISOString(),
    };

    return updated;
  });

  if (!updated) {
    return null;
  }

  await writeApplicationsFile(next);
  return updated;
}

export async function markAllJobApplicationsAsRead() {
  const applications = await readApplicationsFile();
  const now = new Date().toISOString();

  const next = applications.map((item) => ({
    ...item,
    isRead: true,
    updatedAt: now,
  }));

  await writeApplicationsFile(next);
}

export async function updateJobApplicationStatus(id: string, status: JobApplicationStatus) {
  const applications = await readApplicationsFile();
  let updated: JobApplication | null = null;
  const now = new Date().toISOString();

  const next = applications.map((item) => {
    if (item.id !== id) {
      return item;
    }

    updated = {
      ...item,
      status,
      isRead: true,
      updatedAt: now,
      reviewedAt: status === "pending review" ? item.reviewedAt : now,
    };

    return updated;
  });

  if (!updated) {
    return null;
  }

  await writeApplicationsFile(next);
  return updated;
}

async function deleteResumeFile(storedName: string) {
  try {
    await unlink(getResumeAbsolutePath(storedName));
  } catch {
    // Ignore missing resume file errors during cleanup.
  }
}

export async function deleteJobApplicationById(id: string) {
  const applications = await readApplicationsFile();
  const existing = applications.find((item) => item.id === id) ?? null;

  if (!existing) {
    return null;
  }

  const next = applications.filter((item) => item.id !== id);
  await writeApplicationsFile(next);
  await deleteResumeFile(existing.resume.storedName);

  return existing;
}

export async function deleteAllJobApplications() {
  const applications = await readApplicationsFile();

  if (!applications.length) {
    return 0;
  }

  await writeApplicationsFile([]);
  await Promise.all(applications.map((item) => deleteResumeFile(item.resume.storedName)));

  return applications.length;
}

export async function getJobApplicationResumeById(id: string) {
  const application = await getJobApplicationById(id);

  if (!application) {
    return null;
  }

  const absolutePath = getResumeAbsolutePath(application.resume.storedName);

  try {
    await access(absolutePath);
    return {
      absolutePath,
      application,
    };
  } catch {
    return null;
  }
}
