import { z } from "zod";

const jobTypeSchema = z.string().trim().min(2, "Job type is required.");
const jobStatusSchema = z.enum(["draft", "published"]);
const optionalDescriptionSchema = z
  .string()
  .trim()
  .refine((value) => value.length === 0 || value.length >= 10, {
    message: "Description should be at least 10 characters when provided.",
  });

export const jobFormSchema = z.object({
  title: z.string().trim().min(3, "Title is required."),
  department: z.string().trim().min(2, "Department is required."),
  country: z.string().trim().min(2, "Country is required."),
  city: z.string().trim().min(2, "City is required."),
  location: z.string().trim().min(2, "Location is required."),
  experience: z.string().trim().min(1, "Experience is required."),
  type: jobTypeSchema,
  salaryRange: z.string().trim().max(80, "Salary range is too long.").optional().default(""),
  skills: z.array(z.string().trim().min(1, "Skill cannot be empty.")).max(20).optional().default([]),
  description: optionalDescriptionSchema,
  status: jobStatusSchema,
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
export type JobType = z.infer<typeof jobTypeSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
