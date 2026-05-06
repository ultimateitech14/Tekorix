import { z } from "zod";

import {
  experienceSummaryField,
  locationTextField,
  personNameField,
  publicPhoneField,
  skillsField,
} from "@/lib/validators/public-form-fields";

export const jobApplicationStatusValues = [
  "pending review",
  "shortlisted",
  "rejected",
  "interview",
] as const;

export const jobApplicationStatusSchema = z.enum(jobApplicationStatusValues);

export const jobApplicationSubmissionSchema = z.object({
  jobId: z.string().trim().min(1, "Invalid job reference."),
  jobTitle: z.string().trim().min(2, "Job title is required.").max(160, "Job title is too long."),
  jobLocation: z.string().trim().min(2, "Job location is required.").max(160, "Job location is too long."),
  fullName: personNameField("Full name", 2, 90),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: publicPhoneField(),
  location: locationTextField("Current location", 2, 160),
  experience: experienceSummaryField("Experience", 1, 160),
  coverLetter: skillsField("Key skills", 2, 300),
});

export type JobApplicationStatus = z.infer<typeof jobApplicationStatusSchema>;
export type JobApplicationSubmissionValues = z.infer<typeof jobApplicationSubmissionSchema>;
