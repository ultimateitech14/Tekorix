import { z } from "zod";

import {
  locationTextField,
  optionField,
  personNameField,
  publicPhoneField,
  publicResumeAllowedExtensions,
  publicResumeMaxSizeInBytes,
  roleTextField,
  salaryRangeField,
  skillsField,
  isValidLinkedInUrl,
  isAllowedPublicResumeFileName,
} from "@/lib/validators/public-form-fields";

export const candidateLeadExperienceValues = ["0-2 years", "3-5 years", "6-9 years", "10+ years"] as const;

export const candidateLeadSubmissionTypeValues = [
  "contact-candidate",
  "resume-submission",
  "market-resume",
] as const;

export const candidateLeadExperienceLabels: Record<(typeof candidateLeadExperienceValues)[number], string> = {
  "0-2 years": "0-2 years",
  "3-5 years": "3-5 years",
  "6-9 years": "6-9 years",
  "10+ years": "10+ years",
};

export const candidateLeadSubmissionTypeLabels: Record<
  (typeof candidateLeadSubmissionTypeValues)[number],
  string
> = {
  "contact-candidate": "Contact candidate",
  "resume-submission": "Submit resume",
  "market-resume": "Market my resume",
};

export const candidateLeadResumeMaxSizeInBytes = publicResumeMaxSizeInBytes;
export const candidateLeadResumeAllowedExtensions = publicResumeAllowedExtensions;

export function isAllowedCandidateResumeFileName(fileName: string) {
  return isAllowedPublicResumeFileName(fileName);
}

export const candidateLeadSchema = z
  .object({
    fullName: personNameField("Full name", 2, 80),
    email: z.string().trim().email("Please enter a valid email address."),
    phone: publicPhoneField(),
    role: roleTextField("Role", 2, 120),
    submissionType: optionField(candidateLeadSubmissionTypeValues, "Please select a submission type.")
      .optional()
      .default("contact-candidate"),
    experience: z.string().trim().optional().default(""),
    desiredLocation: z.string().trim().max(120, "Desired location is too long.").optional().default(""),
    desiredSalaryRange: z
      .string()
      .trim()
      .max(120, "Desired salary range is too long.")
      .optional()
      .default(""),
    skills: z.string().trim().max(300, "Skills are too long.").optional().default(""),
    linkedInUrl: z
      .string()
      .trim()
      .max(240, "LinkedIn URL is too long.")
      .refine((value) => !value || isValidLinkedInUrl(value), {
        message: "Please enter a valid LinkedIn URL.",
      })
      .optional()
      .default(""),
  })
  .superRefine((value, context) => {
    const hasExperience = Boolean(value.experience);
    const isKnownExperience = (candidateLeadExperienceValues as readonly string[]).includes(value.experience);

    if (value.submissionType !== "market-resume" && !hasExperience) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["experience"],
        message: "Please select your experience range.",
      });
      return;
    }

    if (hasExperience && !isKnownExperience) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["experience"],
        message: "Please select your experience range.",
      });
    }

    if (value.desiredLocation) {
      const result = locationTextField("Desired location", 2, 120).safeParse(value.desiredLocation);

      if (!result.success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["desiredLocation"],
          message: result.error.issues[0]?.message ?? "Please enter a valid desired location.",
        });
      }
    }

    if (value.desiredSalaryRange) {
      const result = salaryRangeField("Desired salary range", 2, 120).safeParse(value.desiredSalaryRange);

      if (!result.success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["desiredSalaryRange"],
          message: result.error.issues[0]?.message ?? "Please enter a valid desired salary range.",
        });
      }
    }

    if (value.skills) {
      const result = skillsField("Skills / technologies", 2, 300).safeParse(value.skills);

      if (!result.success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["skills"],
          message: result.error.issues[0]?.message ?? "Please enter readable skills or technologies.",
        });
      }
    }

    if (value.submissionType === "market-resume") {
      if (!value.desiredLocation) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["desiredLocation"],
          message: "Please enter your desired location.",
        });
      }

      if (!value.desiredSalaryRange) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["desiredSalaryRange"],
          message: "Please enter your desired salary range.",
        });
      }

      if (!value.skills) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["skills"],
          message: "Please enter your core skills or technologies.",
        });
      }
    }
  });

export type CandidateLeadValues = z.infer<typeof candidateLeadSchema>;
