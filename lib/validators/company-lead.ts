import { z } from "zod";

import {
  companyNameField,
  optionField,
  personNameField,
  publicPhoneField,
} from "@/lib/validators/public-form-fields";

export const companyLeadNeedValues = [
  "on-roll-consultants",
  "dedicated-product-team",
  "permanent-hire",
  "contractual-hire",
  "hourly-hire",
  "bench-resources",
  "team-restructure-support",
  "mixed-requirement",
] as const;

export const companyLeadNeedLabels: Record<(typeof companyLeadNeedValues)[number], string> = {
  "on-roll-consultants": "On-roll consultants",
  "dedicated-product-team": "Dedicated product team",
  "permanent-hire": "Permanent hire",
  "contractual-hire": "Contractual hire",
  "hourly-hire": "Hourly hire",
  "bench-resources": "Bench resources",
  "team-restructure-support": "Team restructure support",
  "mixed-requirement": "Not sure yet / mixed requirement",
};

export const companyLeadSchema = z.object({
  name: personNameField("Full name", 2, 80),
  companyName: companyNameField("Company name", 2, 120),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: publicPhoneField(),
  need: optionField(companyLeadNeedValues, "Please select what you need."),
  message: z
    .string()
    .trim()
    .max(700, "Message must be 700 characters or less.")
    .refine((value) => value.length === 0 || value.length >= 20, {
      message: "Please enter at least 20 characters in your message.",
    })
    .refine((value) => value.length === 0 || /[A-Za-z]/.test(value), {
      message: "Message must include clear text, not only numbers or symbols.",
    }),
});

export type CompanyLeadValues = z.infer<typeof companyLeadSchema>;
