export type TalentProfile = {
  id: string;
  name: string;
  role: string;
  yearsOfExperience: number;
  rating: number;
  summary: string;
  detailedSummary: string;
  expertise: string[];
  avatar: string;
  resumeCtaLabel: string;
};

const DEFAULT_PROFILE_IMAGE = "/images/profiles/profile-3.svg";

export const TALENT_PROFILES_STORAGE_KEY = "tekorix_talent_profiles_v1";
export const MAX_TALENT_PROFILES = 20;

export const defaultTalentProfiles: TalentProfile[] = [
  {
    id: "ankit-dagadu",
    name: "Ankit Dagadu",
    role: "Databricks DevOps Engineer (Azure)",
    yearsOfExperience: 9,
    rating: 5,
    summary:
      "Cloud and Databricks professional with 9+ years of experience in cloud infrastructure, data engineering, and DevOps.",
    detailedSummary:
      "Designs and deploys secure Databricks workspaces, Unity Catalog governance, and Azure CI/CD pipelines. Proven ability to optimize performance, cost, and availability for large-scale enterprise cloud workloads.",
    expertise: ["Azure", "Databricks", "Unity Catalog", "ADF", "Terraform"],
    avatar: DEFAULT_PROFILE_IMAGE,
    resumeCtaLabel: "View Resume",
  },
  {
    id: "naeem-akhtar",
    name: "Naeem Akhtar",
    role: "DevOps Engineer (Databricks)",
    yearsOfExperience: 15,
    rating: 5,
    summary:
      "Dynamic IT professional with 15 years of industry experience including 8+ years in cloud, DevOps, and big data platforms.",
    detailedSummary:
      "Leads secure platform rollouts across Azure services with strong governance and automation standards. Delivers production-ready infrastructure patterns for enterprise data programs.",
    expertise: ["Data Factory", "Azure Compute", "AKS", "Storage", "BLOB", "ADLS Gen2"],
    avatar: DEFAULT_PROFILE_IMAGE,
    resumeCtaLabel: "View Resume",
  },
  {
    id: "shivam-shukla",
    name: "Shivam Shukla",
    role: "Databricks DevOps Engineer",
    yearsOfExperience: 10,
    rating: 5,
    summary:
      "Seasoned data architect with 10+ years designing and optimizing large-scale Azure data lakehouse solutions.",
    detailedSummary:
      "Builds reliable engineering pipelines for analytics and ML-ready foundations. Strong record of reducing deployment friction with robust observability and infrastructure standards.",
    expertise: ["Python", "PySpark", "SQL", "Spark", "Azure", "AWS"],
    avatar: DEFAULT_PROFILE_IMAGE,
    resumeCtaLabel: "View Resume",
  },
  {
    id: "melake-kebede",
    name: "Melake Kebede",
    role: "ML Engineer / AI Specialist",
    yearsOfExperience: 18,
    rating: 5,
    summary:
      "AI and ML specialist with 18 years experience across model lifecycle delivery, MLOps, and data product design.",
    detailedSummary:
      "Supports enterprise AI adoption with model governance, feature engineering frameworks, and cloud-native deployment standards focused on measurable business outcomes.",
    expertise: ["Machine Learning", "MLOps", "Feature Stores", "Model Governance", "Python"],
    avatar: DEFAULT_PROFILE_IMAGE,
    resumeCtaLabel: "View Resume",
  },
  {
    id: "sofiya-khan",
    name: "Sofiya Khan",
    role: "Data Platform Architect",
    yearsOfExperience: 12,
    rating: 5,
    summary:
      "Data platform architect with 12+ years of experience in scalable data foundations and modern cloud transformation.",
    detailedSummary:
      "Drives lakehouse modernization, platform reliability engineering, and governance design for distributed teams operating across regulated and high-volume environments.",
    expertise: ["Lakehouse", "Data Governance", "Cloud Migration", "DataOps", "Monitoring"],
    avatar: DEFAULT_PROFILE_IMAGE,
    resumeCtaLabel: "View Resume",
  },
];

export function createTalentProfileTemplate(index: number): TalentProfile {
  const profileNumber = index + 1;

  return {
    id: `custom-profile-${profileNumber}`,
    name: "",
    role: "",
    yearsOfExperience: 0,
    rating: 0,
    summary: "",
    detailedSummary: "",
    expertise: [],
    avatar: DEFAULT_PROFILE_IMAGE,
    resumeCtaLabel: "",
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function sanitizeText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function sanitizeOptionalText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeSkills(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return cleaned.length ? cleaned.slice(0, 12) : fallback;
}

function sanitizeNumber(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return clamp(Math.round(parsed), min, max);
}

export function normalizeTalentProfiles(input: unknown): TalentProfile[] {
  if (!Array.isArray(input)) {
    return defaultTalentProfiles;
  }

  const merged = input
    .slice(0, MAX_TALENT_PROFILES)
    .map((raw, index) => {
      const fallback = defaultTalentProfiles[index] ?? createTalentProfileTemplate(index);
      const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

      return {
        ...fallback,
        id: sanitizeText(data.id, fallback.id),
        name: sanitizeText(data.name, fallback.name),
        role: sanitizeText(data.role, fallback.role),
        yearsOfExperience: sanitizeNumber(data.yearsOfExperience, fallback.yearsOfExperience, 1, 40),
        rating: sanitizeNumber(data.rating, fallback.rating, 1, 5),
        summary: sanitizeText(data.summary, fallback.summary),
        detailedSummary: sanitizeText(data.detailedSummary, fallback.detailedSummary),
        expertise: sanitizeSkills(data.expertise, fallback.expertise),
        avatar: sanitizeOptionalText(data.avatar),
        resumeCtaLabel: sanitizeText(data.resumeCtaLabel, fallback.resumeCtaLabel),
      };
    });

  if (!merged.length) {
    return defaultTalentProfiles;
  }

  const seenIds = new Set<string>();

  return merged.map((profile, index) => {
    let candidateId = profile.id || `custom-profile-${index + 1}`;

    while (seenIds.has(candidateId)) {
      candidateId = `${candidateId}-${index + 1}`;
    }

    seenIds.add(candidateId);

    return {
      ...profile,
      id: candidateId,
    };
  });
}
