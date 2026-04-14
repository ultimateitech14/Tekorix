import type { LucideIcon } from "lucide-react";
import { Award, Building2, GraduationCap } from "lucide-react";

export type AcademyProgram = {
  id: "corporate-training" | "upskilling" | "certification";
  title: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  focusPoints: string[];
  outcomes: string[];
};

export const academyPrograms: AcademyProgram[] = [
  {
    id: "corporate-training",
    title: "Corporate Training",
    shortDescription: "Structured training programs for teams to improve delivery readiness.",
    description:
      "Corporate training programs are designed for organizations that want practical skill uplift across teams without disrupting day-to-day delivery. The focus stays on role-level capability and project relevance.",
    icon: Building2,
    focusPoints: [
      "Team capability assessment and role-gap mapping",
      "Workshop-led training aligned to delivery workflows",
      "Scenario-based exercises tied to real project context",
      "Follow-up support for adoption and consistency",
    ],
    outcomes: [
      "Faster onboarding for internal teams",
      "Improved delivery quality and process adherence",
      "Stronger collaboration between managers and contributors",
      "Measurable learning impact within active projects",
    ],
  },
  {
    id: "upskilling",
    title: "Upskilling",
    shortDescription: "Role-based learning paths to grow technical and professional capability.",
    description:
      "Upskilling tracks help learners and teams move from baseline competency to role-ready capability. The structure is practical, progressive, and aligned with real engineering growth expectations.",
    icon: GraduationCap,
    focusPoints: [
      "Role-specific learning journeys with milestone tracking",
      "Hands-on exercises across engineering and delivery practices",
      "Guided improvement loops for technical depth",
      "Career-oriented progression support",
    ],
    outcomes: [
      "Higher role readiness for candidates and teams",
      "Clear capability growth over structured timelines",
      "Better confidence in practical implementation",
      "Stronger alignment to hiring and promotion expectations",
    ],
  },
  {
    id: "certification",
    title: "Certification",
    shortDescription: "Guided preparation support for recognized technical certifications.",
    description:
      "Certification support combines exam preparation with practical context so participants build both credential confidence and applied capability. The model is structured but outcome-oriented.",
    icon: Award,
    focusPoints: [
      "Certification pathway planning based on role goals",
      "Preparation support with study structure and mentoring",
      "Domain-focused revision and practice sessions",
      "Applied context reinforcement beyond exam theory",
    ],
    outcomes: [
      "Improved certification readiness and confidence",
      "Better retention of core technical concepts",
      "Practical relevance alongside exam preparation",
      "Stronger profile positioning for career progression",
    ],
  },
];

export function getAcademyProgramById(programId: string) {
  return academyPrograms.find((item) => item.id === programId);
}

export function getRelatedAcademyPrograms(programId: string, count = 2) {
  return academyPrograms.filter((item) => item.id !== programId).slice(0, count);
}
