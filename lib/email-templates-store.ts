import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  channel: "Email";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type CreateEmailTemplateInput = {
  name: string;
  subject: string;
  body: string;
  isActive?: boolean;
};

type UpdateEmailTemplateInput = Partial<CreateEmailTemplateInput>;

const dataDir = path.join(process.cwd(), "data");
const storageFilePath = path.join(dataDir, "email-templates.json");
const idPattern = /^TPL-(\d+)$/;

function getDefaultTemplates(): EmailTemplate[] {
  return [
    {
      id: "TPL-1001",
      name: "Application Received",
      subject: "We received your application",
      body: "Hi {{candidate_name}},\n\nThank you for applying for {{job_title}}. Our team will review your profile and get back to you soon.\n\nRegards,\n{{recruiter_name}}",
      channel: "Email",
      isActive: true,
      createdAt: "2026-02-14T00:00:00.000Z",
      updatedAt: "2026-02-14T00:00:00.000Z",
    },
    {
      id: "TPL-1002",
      name: "Interview Invitation",
      subject: "Interview scheduled for your role",
      body: "Hi {{candidate_name}},\n\nYou are shortlisted for {{job_title}}. Please confirm your availability for the interview.\n\nRegards,\n{{recruiter_name}}",
      channel: "Email",
      isActive: true,
      createdAt: "2026-02-13T00:00:00.000Z",
      updatedAt: "2026-02-13T00:00:00.000Z",
    },
    {
      id: "TPL-1003",
      name: "Rejection Notice",
      subject: "Update on your application",
      body: "Hi {{candidate_name}},\n\nThank you for your interest in {{job_title}}. At this time, we are moving forward with other candidates.\n\nRegards,\n{{recruiter_name}}",
      channel: "Email",
      isActive: true,
      createdAt: "2026-02-12T00:00:00.000Z",
      updatedAt: "2026-02-12T00:00:00.000Z",
    },
    {
      id: "TPL-1004",
      name: "Offer Letter",
      subject: "Official offer from StartupWork",
      body: "Hi {{candidate_name}},\n\nWe are excited to extend an offer for the {{job_title}} role. Please review the attached details and respond.\n\nRegards,\n{{recruiter_name}}",
      channel: "Email",
      isActive: true,
      createdAt: "2026-02-11T00:00:00.000Z",
      updatedAt: "2026-02-11T00:00:00.000Z",
    },
  ];
}

function normalizeTimestamp(value: unknown) {
  if (typeof value === "string" && !Number.isNaN(new Date(value).getTime())) {
    return value;
  }

  return new Date().toISOString();
}

function normalizeRecord(raw: unknown): EmailTemplate | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Partial<EmailTemplate>;
  const id = typeof item.id === "string" ? item.id.trim() : "";
  const name = typeof item.name === "string" ? item.name.trim() : "";
  const subject = typeof item.subject === "string" ? item.subject.trim() : "";
  const body = typeof item.body === "string" ? item.body.trim() : "";

  if (!id || !name || !subject || !body) {
    return null;
  }

  return {
    id,
    name,
    subject,
    body,
    channel: "Email",
    isActive: item.isActive !== false,
    createdAt: normalizeTimestamp(item.createdAt),
    updatedAt: normalizeTimestamp(item.updatedAt),
  };
}

async function readTemplatesFile() {
  try {
    const raw = await readFile(storageFilePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [] as EmailTemplate[];
    }

    return parsed
      .map((item) => normalizeRecord(item))
      .filter((item): item is EmailTemplate => Boolean(item));
  } catch {
    return getDefaultTemplates();
  }
}

async function writeTemplatesFile(items: EmailTemplate[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(storageFilePath, JSON.stringify(items, null, 2), "utf8");
}

function getNextTemplateId(items: EmailTemplate[]) {
  const max = items.reduce((currentMax, item) => {
    const match = item.id.match(idPattern);

    if (!match) {
      return currentMax;
    }

    const value = Number(match[1]);
    return Number.isInteger(value) ? Math.max(currentMax, value) : currentMax;
  }, 1000);

  return `TPL-${String(max + 1).padStart(4, "0")}`;
}

export async function listEmailTemplates() {
  const items = await readTemplatesFile();
  return items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getEmailTemplateById(id: string) {
  const items = await readTemplatesFile();
  return items.find((item) => item.id === id) ?? null;
}

export async function createEmailTemplate(input: CreateEmailTemplateInput) {
  const items = await readTemplatesFile();
  const now = new Date().toISOString();

  const next: EmailTemplate = {
    id: getNextTemplateId(items),
    name: input.name.trim(),
    subject: input.subject.trim(),
    body: input.body.trim(),
    channel: "Email",
    isActive: input.isActive !== false,
    createdAt: now,
    updatedAt: now,
  };

  items.unshift(next);
  await writeTemplatesFile(items);
  return next;
}

export async function updateEmailTemplate(
  id: string,
  input: UpdateEmailTemplateInput,
): Promise<EmailTemplate | null> {
  const items = await readTemplatesFile();
  const index = items.findIndex((item) => item.id === id);

  if (index < 0) {
    return null;
  }

  const current = items[index];
  const updated: EmailTemplate = {
    ...current,
    name: typeof input.name === "string" ? input.name.trim() : current.name,
    subject: typeof input.subject === "string" ? input.subject.trim() : current.subject,
    body: typeof input.body === "string" ? input.body.trim() : current.body,
    isActive: typeof input.isActive === "boolean" ? input.isActive : current.isActive,
    updatedAt: new Date().toISOString(),
  };

  const next = [...items];
  next[index] = updated;

  await writeTemplatesFile(next);
  return updated;
}

export async function deleteEmailTemplate(id: string) {
  const items = await readTemplatesFile();
  const next = items.filter((item) => item.id !== id);
  const deleted = next.length !== items.length;

  if (deleted) {
    await writeTemplatesFile(next);
  }

  return deleted;
}

export async function deleteAllEmailTemplates() {
  await writeTemplatesFile([]);
}
