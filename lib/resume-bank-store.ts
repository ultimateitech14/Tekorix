import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import type { JobApplication } from "@/lib/job-applications-store";

export type ResumeBankEntry = {
  applicationId: string;
  fullName: string;
  jobTitle: string;
  jobLocation: string;
  createdAt: string;
  updatedAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const storageFilePath = path.join(dataDir, "resume-bank.json");

function normalizeTimestamp(value: unknown) {
  if (typeof value === "string" && !Number.isNaN(new Date(value).getTime())) {
    return value;
  }

  return new Date().toISOString();
}

function normalizeRecord(raw: unknown): ResumeBankEntry | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Partial<ResumeBankEntry>;
  const applicationId = typeof item.applicationId === "string" ? item.applicationId.trim() : "";
  const fullName = typeof item.fullName === "string" ? item.fullName.trim() : "";
  const jobTitle = typeof item.jobTitle === "string" ? item.jobTitle.trim() : "";
  const jobLocation = typeof item.jobLocation === "string" ? item.jobLocation.trim() : "";

  if (!applicationId || !fullName || !jobTitle || !jobLocation) {
    return null;
  }

  return {
    applicationId,
    fullName,
    jobTitle,
    jobLocation,
    createdAt: normalizeTimestamp(item.createdAt),
    updatedAt: normalizeTimestamp(item.updatedAt),
  };
}

async function readResumeBankFile() {
  try {
    const raw = await readFile(storageFilePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [] as ResumeBankEntry[];
    }

    return parsed
      .map((item) => normalizeRecord(item))
      .filter((item): item is ResumeBankEntry => Boolean(item));
  } catch {
    return [] as ResumeBankEntry[];
  }
}

async function writeResumeBankFile(items: ResumeBankEntry[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(storageFilePath, JSON.stringify(items, null, 2), "utf8");
}

export async function getResumeBankEntries() {
  const items = await readResumeBankFile();
  return items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function upsertResumeBankEntryFromApplication(application: JobApplication) {
  const items = await readResumeBankFile();
  const now = new Date().toISOString();
  const existing = items.find((item) => item.applicationId === application.id);

  const next: ResumeBankEntry = {
    applicationId: application.id,
    fullName: application.fullName,
    jobTitle: application.jobTitle,
    jobLocation: application.jobLocation,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const filtered = items.filter((item) => item.applicationId !== application.id);
  filtered.unshift(next);
  await writeResumeBankFile(filtered);

  return next;
}

export async function removeResumeBankEntryByApplicationId(applicationId: string) {
  const items = await readResumeBankFile();
  const next = items.filter((item) => item.applicationId !== applicationId);
  const removed = next.length !== items.length;

  if (removed) {
    await writeResumeBankFile(next);
  }

  return removed;
}

export async function removeResumeBankEntriesByApplicationIds(applicationIds: string[]) {
  if (!applicationIds.length) {
    return 0;
  }

  const blocked = new Set(applicationIds.map((item) => item.trim()).filter(Boolean));

  if (!blocked.size) {
    return 0;
  }

  const items = await readResumeBankFile();
  const next = items.filter((item) => !blocked.has(item.applicationId));
  const removed = items.length - next.length;

  if (removed > 0) {
    await writeResumeBankFile(next);
  }

  return removed;
}

export async function clearResumeBankEntries() {
  await writeResumeBankFile([]);
}
