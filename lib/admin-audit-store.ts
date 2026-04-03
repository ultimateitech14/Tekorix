import "server-only";

import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type AdminLogCategory = "activity" | "audit" | "notification";
export type AdminLogModule =
  | "Applications"
  | "Candidates"
  | "Jobs"
  | "Email & Notifications"
  | "Settings"
  | "System";

export type AdminAuditEntry = {
  id: string;
  category: AdminLogCategory;
  module: AdminLogModule;
  action: string;
  actor: string;
  target: string;
  createdAt: string;
};

type CreateAdminAuditEntryInput = {
  category?: AdminLogCategory;
  module?: AdminLogModule;
  action: string;
  actor?: string;
  target?: string;
};

const dataDir = path.join(process.cwd(), "data");
const storageFilePath = path.join(dataDir, "admin-audit-trail.json");

const DEFAULT_ADMIN_ACTOR = "TekOrix Admin";

function normalizeCategory(value: unknown): AdminLogCategory {
  if (value === "activity" || value === "audit" || value === "notification") {
    return value;
  }

  return "activity";
}

function normalizeModule(value: unknown): AdminLogModule | null {
  if (
    value === "Applications" ||
    value === "Candidates" ||
    value === "Jobs" ||
    value === "Email & Notifications" ||
    value === "Settings" ||
    value === "System"
  ) {
    return value;
  }

  return null;
}

function inferModule(action: string, target: string): AdminLogModule {
  const text = `${action} ${target}`.toLowerCase();

  if (text.includes("application")) {
    return "Applications";
  }

  if (text.includes("resume") || text.includes("candidate")) {
    return "Candidates";
  }

  if (text.includes("job")) {
    return "Jobs";
  }

  if (text.includes("contact submission") || text.includes("notification") || text.includes("provider")) {
    return "Email & Notifications";
  }

  if (text.includes("settings")) {
    return "Settings";
  }

  return "System";
}

function normalizeTimestamp(value: unknown) {
  if (typeof value === "string" && !Number.isNaN(new Date(value).getTime())) {
    return value;
  }

  return new Date().toISOString();
}

function normalizeEntry(value: unknown): AdminAuditEntry | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Partial<AdminAuditEntry>;
  const action = typeof raw.action === "string" ? raw.action.trim() : "";
  const actor = typeof raw.actor === "string" ? raw.actor.trim() : "";
  const target = typeof raw.target === "string" ? raw.target.trim() : "";
  const id = typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : randomUUID();

  if (!action || !actor) {
    return null;
  }

  return {
    id,
    category: normalizeCategory(raw.category),
    module: normalizeModule(raw.module) ?? inferModule(action, target),
    action,
    actor,
    target,
    createdAt: normalizeTimestamp(raw.createdAt),
  };
}

async function readAuditFile() {
  try {
    const raw = await readFile(storageFilePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [] as AdminAuditEntry[];
    }

    return parsed
      .map((item) => normalizeEntry(item))
      .filter((item): item is AdminAuditEntry => Boolean(item))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [] as AdminAuditEntry[];
  }
}

async function writeAuditFile(items: AdminAuditEntry[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(storageFilePath, JSON.stringify(items, null, 2), "utf8");
}

export async function listAdminAuditEntries(options: { category?: AdminLogCategory } = {}) {
  const items = await readAuditFile();

  if (!options.category) {
    return items;
  }

  return items.filter((item) => item.category === options.category);
}

export async function createAdminAuditEntry(input: CreateAdminAuditEntryInput) {
  try {
    const existing = await readAuditFile();
    const next: AdminAuditEntry = {
      id: randomUUID(),
      category: input.category ?? "activity",
      module: input.module ?? inferModule(input.action, input.target ?? ""),
      action: input.action.trim(),
      actor: (input.actor ?? DEFAULT_ADMIN_ACTOR).trim() || DEFAULT_ADMIN_ACTOR,
      target: (input.target ?? "").trim(),
      createdAt: new Date().toISOString(),
    };

    if (!next.action) {
      return null;
    }

    existing.unshift(next);
    await writeAuditFile(existing);
    return next;
  } catch {
    return null;
  }
}

export async function clearAdminAuditEntries(options: { categories?: AdminLogCategory[] } = {}) {
  try {
    if (!options.categories || options.categories.length === 0) {
      await writeAuditFile([]);
      return true;
    }

    const allowed = new Set(options.categories);
    const existing = await readAuditFile();
    const next = existing.filter((item) => !allowed.has(item.category));
    await writeAuditFile(next);
    return true;
  } catch {
    return false;
  }
}

export async function clearAdminAuditEntriesByIds(ids: string[]) {
  try {
    if (!ids.length) {
      return true;
    }

    const blocked = new Set(ids);
    const existing = await readAuditFile();
    const next = existing.filter((item) => !blocked.has(item.id));
    await writeAuditFile(next);
    return true;
  } catch {
    return false;
  }
}
