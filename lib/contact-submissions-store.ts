import "server-only";

import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import type { ContactFormValues } from "@/lib/validators/contact";

export type ContactSubmissionReplyStatus = "saved" | "sent" | "failed";

export type ContactSubmissionReply = {
  id: string;
  message: string;
  sentAt: string;
  fromEmail: string;
  toEmail: string;
  deliveryStatus: ContactSubmissionReplyStatus;
  deliveryError: string | null;
};

export type ContactSubmission = ContactFormValues & {
  id: string;
  createdAt: string;
  isRead: boolean;
  replies: ContactSubmissionReply[];
};

const dataDir = path.join(process.cwd(), "data");
const storageFilePath = path.join(dataDir, "contact-submissions.json");
const defaultFromEmail = process.env.ADMIN_EMAIL?.trim() || "";

function normalizeReplyStatus(value: unknown): ContactSubmissionReplyStatus {
  if (value === "sent" || value === "failed" || value === "saved") {
    return value;
  }

  return "saved";
}

function normalizeReply(raw: unknown, fallbackToEmail: string): ContactSubmissionReply | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const value = raw as Partial<ContactSubmissionReply>;
  const id = typeof value.id === "string" && value.id.trim() ? value.id.trim() : randomUUID();
  const message = typeof value.message === "string" ? value.message.trim() : "";
  const sentAt =
    typeof value.sentAt === "string" && !Number.isNaN(new Date(value.sentAt).getTime())
      ? value.sentAt
      : new Date().toISOString();
  const fromEmail =
    typeof value.fromEmail === "string" && value.fromEmail.trim() ? value.fromEmail.trim() : defaultFromEmail;
  const toEmail =
    typeof value.toEmail === "string" && value.toEmail.trim() ? value.toEmail.trim() : fallbackToEmail;
  const deliveryStatus = normalizeReplyStatus(value.deliveryStatus);
  const deliveryError = typeof value.deliveryError === "string" && value.deliveryError.trim()
    ? value.deliveryError.trim()
    : null;

  if (!message || !toEmail) {
    return null;
  }

  return {
    id,
    message,
    sentAt,
    fromEmail,
    toEmail,
    deliveryStatus,
    deliveryError,
  };
}

async function readSubmissionsFile() {
  try {
    const raw = await readFile(storageFilePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [] as ContactSubmission[];
    }

    return (parsed as ContactSubmission[]).map((item) => ({
      ...item,
      replies: Array.isArray(item.replies)
        ? item.replies
            .map((reply) => normalizeReply(reply, item.email))
            .filter((reply): reply is ContactSubmissionReply => Boolean(reply))
        : [],
    }));
  } catch {
    return [] as ContactSubmission[];
  }
}

async function writeSubmissionsFile(submissions: ContactSubmission[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(storageFilePath, JSON.stringify(submissions, null, 2), "utf8");
}

export async function createContactSubmission(payload: ContactFormValues) {
  const submissions = await readSubmissionsFile();
  const next: ContactSubmission = {
    ...payload,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    isRead: false,
    replies: [],
  };

  submissions.unshift(next);
  await writeSubmissionsFile(submissions);

  return next;
}

export async function getContactSubmissions() {
  const submissions = await readSubmissionsFile();

  return submissions.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getContactSubmissionById(id: string) {
  const submissions = await readSubmissionsFile();
  return submissions.find((item) => item.id === id) ?? null;
}

export async function markContactSubmissionAsRead(id: string) {
  const submissions = await readSubmissionsFile();
  const next = submissions.map((item) => (item.id === id ? { ...item, isRead: true } : item));
  await writeSubmissionsFile(next);
}

export async function markAllContactSubmissionsAsRead() {
  const submissions = await readSubmissionsFile();
  const next = submissions.map((item) => ({ ...item, isRead: true }));
  await writeSubmissionsFile(next);
}

type AddContactReplyOptions = {
  fromEmail?: string;
  toEmail?: string;
  deliveryStatus?: ContactSubmissionReplyStatus;
  deliveryError?: string | null;
};

export async function addContactSubmissionReply(id: string, message: string, options: AddContactReplyOptions = {}) {
  const submissions = await readSubmissionsFile();
  let updated: ContactSubmission | null = null;

  const next = submissions.map((item) => {
    if (item.id !== id) {
      return item;
    }

    const reply: ContactSubmissionReply = {
      id: randomUUID(),
      message,
      sentAt: new Date().toISOString(),
      fromEmail: options.fromEmail?.trim() || defaultFromEmail,
      toEmail: options.toEmail?.trim() || item.email,
      deliveryStatus: options.deliveryStatus ?? "saved",
      deliveryError: options.deliveryError ?? null,
    };

    updated = {
      ...item,
      isRead: true,
      replies: [...item.replies, reply],
    };

    return updated;
  });

  await writeSubmissionsFile(next);
  return updated;
}

export async function deleteContactSubmission(id: string) {
  const submissions = await readSubmissionsFile();
  const next = submissions.filter((item) => item.id !== id);
  const deleted = next.length !== submissions.length;

  if (deleted) {
    await writeSubmissionsFile(next);
  }

  return deleted;
}

export async function deleteAllContactSubmissions() {
  await writeSubmissionsFile([]);
}
