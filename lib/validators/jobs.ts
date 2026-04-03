import { z } from "zod";
import { getCitiesForCountry, jobCountries } from "@/lib/job-locations";

const jobTypeSchema = z.enum(["full-time", "part-time", "contract"]);
const jobStatusSchema = z.enum(["draft", "published"]);

export const jobFormSchema = z.object({
  title: z.string().trim().min(3, "Title is required."),
  department: z.string().trim().min(2, "Department is required."),
  country: z.enum(jobCountries, {
    message: "Please select a country.",
  }),
  city: z.string().trim().min(2, "City is required."),
  location: z.string().trim().min(2, "Location is required."),
  experience: z.string().trim().min(2, "Experience is required."),
  type: jobTypeSchema,
  salaryRange: z.string().trim().max(80, "Salary range is too long.").optional().default(""),
  skills: z.array(z.string().trim().min(1, "Skill cannot be empty.")).max(20).optional().default([]),
  description: z.string().trim().min(20, "Description should be at least 20 characters."),
  status: jobStatusSchema,
}).superRefine((value, context) => {
  const validCities = getCitiesForCountry(value.country);

  if (!validCities.includes(value.city)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["city"],
      message: "Please select a valid city for the selected country.",
    });
  }
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
export type JobType = z.infer<typeof jobTypeSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
