import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import {
  defaultTalentProfiles,
  normalizeTalentProfiles,
  type TalentProfile,
} from "@/lib/talent-profiles";
import { defaultTalentProfilesSectionContent } from "@/lib/talent-profiles-section";
import type { SiteSettingsUpdateInput } from "@/lib/validators/site-settings";

const DEFAULT_PROFILE_IMAGE = "/images/profiles/profile-3.svg";

function toCompanyNameFromEmail(email: string) {
  const domain = email.split("@")[1] ?? "";
  const namePart = domain.split(".")[0] ?? "";
  const normalized = namePart
    .split(/[-_]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`);

  return normalized.join(" ") || "Company";
}

function toCareersDomain(email: string) {
  const domain = email.split("@")[1] ?? "";
  return domain ? `careers.${domain}` : "";
}

const adminEmail = process.env.ADMIN_EMAIL?.trim() || "";

export type CareersTeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  blurb: string;
};

export type SiteSettings = {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyGoogleMapLink: string;
  careersDomain: string;
  careersHeadline: string;
  careersSubtitle: string;
  careersPublished: boolean;
  careersShowTeamPhotos: boolean;
  careersAutoPublishJobs: boolean;
  careersTeamMembers: CareersTeamMember[];
  talentProfilesEyebrow: string;
  talentProfilesHeadline: string;
  talentProfilesDescription: string;
  talentProfiles: TalentProfile[];
  notificationEmailProvider: string;
  notificationEmailApiKey: string;
  notificationFromEmail: string;
};

export const defaultSiteSettings: SiteSettings = {
  companyName: toCompanyNameFromEmail(adminEmail),
  companyEmail: adminEmail,
  companyPhone: "",
  companyAddress: "",
  companyGoogleMapLink: "",
  careersDomain: toCareersDomain(adminEmail),
  careersHeadline: "Build products that help teams hire better.",
  careersSubtitle:
    "We are hiring across product, engineering, and operations. Join us to shape the future of recruiting.",
  careersPublished: true,
  careersShowTeamPhotos: true,
  careersAutoPublishJobs: false,
  careersTeamMembers: [
    {
      id: "team-01",
      name: "Priya Sharma",
      role: "Engineering Manager",
      photo: DEFAULT_PROFILE_IMAGE,
      blurb: "Leads distributed teams delivering product and platform initiatives.",
    },
    {
      id: "team-02",
      name: "Arjun Menon",
      role: "Senior Product Designer",
      photo: DEFAULT_PROFILE_IMAGE,
      blurb: "Shapes user journeys and design systems for high-scale products.",
    },
    {
      id: "team-03",
      name: "Nisha Verma",
      role: "Talent Partner",
      photo: DEFAULT_PROFILE_IMAGE,
      blurb: "Partners with hiring teams to build strong and inclusive pipelines.",
    },
  ],
  talentProfilesEyebrow: defaultTalentProfilesSectionContent.eyebrow,
  talentProfilesHeadline: defaultTalentProfilesSectionContent.title,
  talentProfilesDescription: defaultTalentProfilesSectionContent.description,
  talentProfiles: defaultTalentProfiles,
  notificationEmailProvider: "",
  notificationEmailApiKey: "",
  notificationFromEmail: "",
};

const dataDir = path.join(process.cwd(), "data");
const storageFilePath = path.join(dataDir, "site-settings.json");

function normalizeText(value: unknown, fallback: string, maxLength: number) {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim();

  if (!normalized) {
    return fallback;
  }

  return normalized.slice(0, maxLength);
}

function normalizeBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
}

function normalizeTeamMembers(value: unknown, fallback: CareersTeamMember[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .slice(0, 8)
    .map((item, index) => {
      const raw = item && typeof item === "object" ? (item as Partial<CareersTeamMember>) : {};
      const id = normalizeText(raw.id, `team-${String(index + 1).padStart(2, "0")}`, 80);
      const name = normalizeText(raw.name, "", 80);
      const role = normalizeText(raw.role, "", 120);
      const photo = normalizeText(raw.photo, "", 2_000_000);
      const blurb = normalizeText(raw.blurb, "", 240);

      if (!name && !role && !blurb && !photo) {
        return null;
      }

      return {
        id,
        name,
        role,
        photo,
        blurb,
      } satisfies CareersTeamMember;
    })
    .filter((item): item is CareersTeamMember => Boolean(item));

  return normalized;
}

function normalizeSiteSettings(raw: unknown): SiteSettings {
  if (!raw || typeof raw !== "object") {
    return { ...defaultSiteSettings };
  }

  const value = raw as Partial<SiteSettings>;
  const normalizedMembers = normalizeTeamMembers(value.careersTeamMembers, defaultSiteSettings.careersTeamMembers);
  const normalizedTalentProfiles = normalizeTalentProfiles(value.talentProfiles ?? defaultSiteSettings.talentProfiles);

  return {
    companyName: normalizeText(value.companyName, defaultSiteSettings.companyName, 120),
    companyEmail: normalizeText(value.companyEmail, defaultSiteSettings.companyEmail, 160),
    companyPhone: normalizeText(value.companyPhone, defaultSiteSettings.companyPhone, 40),
    companyAddress: normalizeText(value.companyAddress, defaultSiteSettings.companyAddress, 600),
    companyGoogleMapLink: normalizeText(
      value.companyGoogleMapLink,
      defaultSiteSettings.companyGoogleMapLink,
      2_000,
    ),
    careersDomain: normalizeText(value.careersDomain, defaultSiteSettings.careersDomain, 120),
    careersHeadline: normalizeText(value.careersHeadline, defaultSiteSettings.careersHeadline, 180),
    careersSubtitle: normalizeText(value.careersSubtitle, defaultSiteSettings.careersSubtitle, 500),
    careersPublished: normalizeBoolean(value.careersPublished, defaultSiteSettings.careersPublished),
    careersShowTeamPhotos: normalizeBoolean(value.careersShowTeamPhotos, defaultSiteSettings.careersShowTeamPhotos),
    careersAutoPublishJobs: normalizeBoolean(value.careersAutoPublishJobs, defaultSiteSettings.careersAutoPublishJobs),
    careersTeamMembers: normalizedMembers,
    talentProfilesEyebrow: normalizeText(
      value.talentProfilesEyebrow,
      defaultSiteSettings.talentProfilesEyebrow,
      160,
    ),
    talentProfilesHeadline: normalizeText(
      value.talentProfilesHeadline,
      defaultSiteSettings.talentProfilesHeadline,
      500,
    ),
    talentProfilesDescription: normalizeText(
      value.talentProfilesDescription,
      defaultSiteSettings.talentProfilesDescription,
      2_000,
    ),
    talentProfiles: normalizedTalentProfiles,
    notificationEmailProvider: normalizeText(
      value.notificationEmailProvider,
      defaultSiteSettings.notificationEmailProvider,
      160,
    ),
    notificationEmailApiKey: normalizeText(
      value.notificationEmailApiKey,
      defaultSiteSettings.notificationEmailApiKey,
      2_000,
    ),
    notificationFromEmail: normalizeText(
      value.notificationFromEmail,
      defaultSiteSettings.notificationFromEmail,
      320,
    ),
  };
}

async function readSiteSettingsFile() {
  try {
    const raw = await readFile(storageFilePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return normalizeSiteSettings(parsed);
  } catch {
    return { ...defaultSiteSettings };
  }
}

async function writeSiteSettingsFile(settings: SiteSettings) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(storageFilePath, JSON.stringify(settings, null, 2), "utf8");
}

export async function getSiteSettings() {
  return readSiteSettingsFile();
}

export async function updateSiteSettings(payload: SiteSettingsUpdateInput) {
  const current = await readSiteSettingsFile();
  const next = normalizeSiteSettings({
    ...current,
    ...payload,
  });

  await writeSiteSettingsFile(next);
  return next;
}
