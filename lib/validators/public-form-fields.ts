import { z } from "zod";

export const publicPhonePrefixValues = ["+91", "+1", "+44", "+61", "+49", "+33", "+65", "+971"] as const;
export type PublicPhonePrefix = (typeof publicPhonePrefixValues)[number];
export const defaultPublicPhonePrefix = publicPhonePrefixValues[0];

export const publicPhoneMetadata: Record<
  PublicPhonePrefix,
  {
    country: string;
    placeholder: string;
    minLength: number;
    maxLength: number;
    helperText: string;
  }
> = {
  "+91": {
    country: "India",
    placeholder: "9876543210",
    minLength: 10,
    maxLength: 10,
    helperText: "Use a 10-digit India mobile or direct work number.",
  },
  "+1": {
    country: "United States / Canada",
    placeholder: "5550101000",
    minLength: 10,
    maxLength: 10,
    helperText: "Use a 10-digit US or Canada phone number.",
  },
  "+44": {
    country: "United Kingdom",
    placeholder: "7400123456",
    minLength: 10,
    maxLength: 10,
    helperText: "Use a 10-digit UK mobile or direct phone number.",
  },
  "+61": {
    country: "Australia",
    placeholder: "412345678",
    minLength: 9,
    maxLength: 9,
    helperText: "Use a 9-digit Australia mobile or direct phone number.",
  },
  "+49": {
    country: "Germany",
    placeholder: "15123456789",
    minLength: 10,
    maxLength: 11,
    helperText: "Use a 10 to 11 digit Germany mobile or direct phone number.",
  },
  "+33": {
    country: "France",
    placeholder: "612345678",
    minLength: 9,
    maxLength: 9,
    helperText: "Use a 9-digit France mobile or direct phone number.",
  },
  "+65": {
    country: "Singapore",
    placeholder: "81234567",
    minLength: 8,
    maxLength: 8,
    helperText: "Use an 8-digit Singapore mobile or direct phone number.",
  },
  "+971": {
    country: "United Arab Emirates",
    placeholder: "501234567",
    minLength: 9,
    maxLength: 9,
    helperText: "Use a 9-digit UAE mobile or direct phone number.",
  },
};

export const publicResumeMaxSizeInBytes = 5 * 1024 * 1024;
export const publicResumeAllowedExtensions = [".pdf", ".doc", ".docx"] as const;
export const publicResumeAccept = publicResumeAllowedExtensions.join(",");

const supportedPhonePrefixes = [...publicPhonePrefixValues].sort((left, right) => right.length - left.length);
const personNamePattern = /^(?=.*[A-Za-z])[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/;
const companyNamePattern = /^(?=.*[A-Za-z])[A-Za-z&.,'()\/ -]+$/;
const roleTextPattern = /^(?=.*[A-Za-z])[A-Za-z&.,'()\/+ -]+$/;
const locationTextPattern = /^(?=.*[A-Za-z])[A-Za-z&.,'()\/+ -]+$/;
const experienceTextPattern = /^(?=.*[A-Za-z0-9])[A-Za-z0-9&.,'()\/+ -]+$/;
const skillsTextPattern = /^(?=.*[A-Za-z])[A-Za-z0-9#&.,'()\/+ -]+$/;
const salaryTextPattern = /^(?=.*[A-Za-z0-9])[A-Za-z0-9$&.,'()\/+ -]+$/;
const phoneValuePattern = /^(\+\d{1,4})\s(\d{6,14})$/;
const linkedInUrlPattern = /^https?:\/\/(www\.)?linkedin\.com\/.+/i;

function trimAndCollapseWhitespace(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function collapseInputWhitespace(value: string) {
  return value.replace(/\s+/g, " ");
}

function baseTextField(label: string, minimum: number, maximum: number) {
  return z
    .string()
    .transform(trimAndCollapseWhitespace)
    .pipe(z.string().min(minimum, `${label} is required.`).max(maximum, `${label} is too long.`));
}

export function personNameField(label: string, minimum = 2, maximum = 80) {
  return baseTextField(label, minimum, maximum).refine((value) => personNamePattern.test(value), {
    message: `${label} must use letters and standard name punctuation only.`,
  });
}

export function companyNameField(label: string, minimum = 2, maximum = 120) {
  return baseTextField(label, minimum, maximum).refine((value) => companyNamePattern.test(value), {
    message: `${label} must look like a valid company name.`,
  });
}

export function roleTextField(label: string, minimum = 2, maximum = 120) {
  return baseTextField(label, minimum, maximum).refine((value) => roleTextPattern.test(value), {
    message: `${label} must look like a valid role or designation.`,
  });
}

export function locationTextField(label: string, minimum = 2, maximum = 160) {
  return baseTextField(label, minimum, maximum).refine((value) => locationTextPattern.test(value), {
    message: `${label} must look like a valid location.`,
  });
}

export function experienceSummaryField(label: string, minimum = 1, maximum = 160) {
  return baseTextField(label, minimum, maximum).refine((value) => experienceTextPattern.test(value), {
    message: `${label} must describe your experience in a readable format.`,
  });
}

export function salaryRangeField(label: string, minimum = 2, maximum = 120) {
  return baseTextField(label, minimum, maximum).refine((value) => salaryTextPattern.test(value), {
    message: `${label} must look like a valid salary range.`,
  });
}

export function skillsField(label: string, minimum = 2, maximum = 300) {
  return baseTextField(label, minimum, maximum).refine((value) => skillsTextPattern.test(value), {
    message: `${label} must list readable technologies or skills.`,
  });
}

export function normalizePublicPhonePrefix(value: string): PublicPhonePrefix {
  const normalized = value.trim();
  return (publicPhonePrefixValues as readonly string[]).includes(normalized)
    ? (normalized as PublicPhonePrefix)
    : defaultPublicPhonePrefix;
}

export function getPublicPhoneMetadata(prefix: string) {
  return publicPhoneMetadata[normalizePublicPhonePrefix(prefix)];
}

export function getPublicPhoneOptionLabel(prefix: string) {
  const metadata = getPublicPhoneMetadata(prefix);
  return `${metadata.country} (${normalizePublicPhonePrefix(prefix)})`;
}

export function getPublicPhoneLengthMessage(prefix: string, label = "Phone number") {
  const metadata = getPublicPhoneMetadata(prefix);
  const lengthLabel =
    metadata.minLength === metadata.maxLength
      ? `${metadata.maxLength} digits`
      : `${metadata.minLength}-${metadata.maxLength} digits`;

  return `${label} must be ${lengthLabel} for ${normalizePublicPhonePrefix(prefix)}.`;
}

export function sanitizePhoneNumberDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function sanitizeEmailInput(value: string) {
  return value.replace(/\s+/g, "");
}

export function sanitizeUrlInput(value: string) {
  return value.replace(/\s+/g, "");
}

export function sanitizePersonNameInput(value: string) {
  return collapseInputWhitespace(value.replace(/[^A-Za-z .'-]/g, ""));
}

export function sanitizeCompanyNameInput(value: string) {
  return collapseInputWhitespace(value.replace(/[^A-Za-z&.,'()\/ -]/g, ""));
}

export function sanitizeRoleTextInput(value: string) {
  return collapseInputWhitespace(value.replace(/[^A-Za-z&.,'()\/+ -]/g, ""));
}

export function sanitizeLocationTextInput(value: string) {
  return collapseInputWhitespace(value.replace(/[^A-Za-z&.,'()\/+ -]/g, ""));
}

export function normalizePublicPhoneDigits(prefix: string, value: string) {
  const metadata = getPublicPhoneMetadata(prefix);
  return sanitizePhoneNumberDigits(value).slice(0, metadata.maxLength);
}

export function publicPhoneField(label = "Phone number") {
  return z
    .string()
    .transform(trimAndCollapseWhitespace)
    .pipe(z.string().min(1, `${label} is required.`).max(20, `${label} is too long.`))
    .superRefine((value, context) => {
      const match = value.match(phoneValuePattern);

      if (!match) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Please enter ${label.toLowerCase()} with a valid country code and number.`,
        });
        return;
      }

      const [, prefix, digits] = match;
      const normalizedPrefix = normalizePublicPhonePrefix(prefix);

      if (prefix !== normalizedPrefix) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} uses an unsupported country code.`,
        });
        return;
      }

      const metadata = getPublicPhoneMetadata(normalizedPrefix);

      if (digits.length < metadata.minLength || digits.length > metadata.maxLength) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: getPublicPhoneLengthMessage(normalizedPrefix, label),
        });
      }
    });
}

export function composePublicPhoneValue(prefix: string, number: string) {
  const normalizedPrefix = normalizePublicPhonePrefix(prefix);
  const digits = normalizePublicPhoneDigits(normalizedPrefix, number);
  return digits ? `${normalizedPrefix} ${digits}` : "";
}

export function splitPublicPhoneValue(value: string | null | undefined) {
  const normalized = trimAndCollapseWhitespace(value ?? "");
  const matchedPrefix = supportedPhonePrefixes.find((prefix) => normalized.startsWith(prefix));

  if (matchedPrefix) {
    return {
      prefix: matchedPrefix,
      number: normalizePublicPhoneDigits(matchedPrefix, normalized.slice(matchedPrefix.length)),
    };
  }

  return {
    prefix: defaultPublicPhonePrefix,
    number: normalizePublicPhoneDigits(defaultPublicPhonePrefix, normalized),
  };
}

export function isAllowedPublicResumeFileName(fileName: string) {
  const normalized = fileName.trim().toLowerCase();
  return publicResumeAllowedExtensions.some((extension) => normalized.endsWith(extension));
}

export function sanitizeUploadedFileName(fileName: string) {
  return fileName.replace(/[^A-Za-z0-9._-]/g, "_");
}

export function getPublicResumeValidationError(
  file: Pick<File, "name" | "size"> | null | undefined,
  options?: {
    required?: boolean;
    requiredMessage?: string;
  },
) {
  if (!file) {
    return options?.required ? (options.requiredMessage ?? "Please upload your resume to continue.") : null;
  }

  if (!isAllowedPublicResumeFileName(file.name)) {
    return "Resume must be PDF, DOC, or DOCX.";
  }

  if (file.size > publicResumeMaxSizeInBytes) {
    return "Resume file must be 5 MB or smaller.";
  }

  return null;
}

export function optionField<T extends readonly string[]>(options: T, message: string) {
  return z
    .string()
    .transform(trimAndCollapseWhitespace)
    .pipe(z.string().min(1, message))
    .refine((value): value is T[number] => (options as readonly string[]).includes(value), {
      message,
    });
}

export function phoneDigitsField(label = "Phone number", minimum = 6, maximum = 14) {
  return z
    .string()
    .transform((value) => sanitizePhoneNumberDigits(value).slice(0, maximum))
    .pipe(z.string().min(minimum, `${label} is required.`).max(maximum, `${label} is too long.`))
    .refine((value) => /^\d+$/.test(value), {
      message: `${label} must contain numbers only.`,
    });
}

export function getZodFieldError<TField extends string>(error: z.ZodError<unknown>, field: TField) {
  return error.issues.find((issue) => issue.path[0] === field)?.message;
}

export function isValidLinkedInUrl(value: string) {
  return linkedInUrlPattern.test(value);
}
