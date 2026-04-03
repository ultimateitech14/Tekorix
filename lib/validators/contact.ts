import { z } from "zod";

import {
  companyNameField,
  optionField,
  personNameField,
  phoneDigitsField,
  publicPhonePrefixValues,
  roleTextField,
} from "@/lib/validators/public-form-fields";

export const contactInquiryValues = ["candidate", "former-employee", "client"] as const;

export const contactCountryValues = [
  "United States",
  "India",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Australia",
  "Singapore",
  "United Arab Emirates",
] as const;

export const contactIndustryValues = [
  "Aerospace & Defense",
  "Automotive",
  "Banking & Financial Services",
  "Energy & Utilities",
  "Healthcare & Life Sciences",
  "Manufacturing",
  "Telecommunications",
  "Technology",
] as const;

export const contactPhonePrefixValues = publicPhonePrefixValues;

export const contactFormSchema = z.object({
  inquiryType: optionField(contactInquiryValues, "Please select who you are."),
  firstName: personNameField("First name", 2, 40),
  lastName: personNameField("Last name", 2, 40),
  email: z.string().trim().email("Please enter a valid email address."),
  country: optionField(contactCountryValues, "Please select a country."),
  industry: optionField(contactIndustryValues, "Please select an industry."),
  company: companyNameField("Company", 2, 80),
  position: roleTextField("Position", 2, 60),
  phonePrefix: optionField(contactPhonePrefixValues, "Please select a phone prefix."),
  phoneNumber: phoneDigitsField("Phone number", 6, 14),
  message: z
    .string()
    .trim()
    .min(15, "Please enter at least 15 characters in your message.")
    .max(500, "Message must be 500 characters or less.")
    .refine((value) => /[A-Za-z]/.test(value), {
      message: "Message must include clear text, not only numbers or symbols.",
    }),
  acceptTerms: z.boolean().refine((value) => value, {
    message: "You must agree to the terms before submitting.",
  }),
  marketingConsent: z.boolean().refine((value) => value, {
    message: "Please confirm communication consent before submitting.",
  }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
