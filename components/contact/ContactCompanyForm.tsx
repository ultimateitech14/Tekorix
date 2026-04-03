"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import {
  PublicFieldMessages,
  PublicPhoneField,
  publicFormDescriptionClass,
  publicFormEyebrowClass,
  publicFormHeadingClass,
  publicFormInputClass,
  publicFormLabelClass,
  publicFormSelectTriggerClass,
  publicFormTextareaClass,
} from "@/components/global/PublicFormFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/http";
import { submitCompanyLead } from "@/lib/api/company-leads";
import { themeTokens } from "@/lib/theme/tokens";
import {
  companyLeadNeedLabels,
  companyLeadNeedValues,
  companyLeadSchema,
} from "@/lib/validators/company-lead";
import {
  composePublicPhoneValue,
  defaultPublicPhonePrefix,
  getZodFieldError,
  normalizePublicPhoneDigits,
  sanitizeCompanyNameInput,
  sanitizeEmailInput,
  sanitizePersonNameInput,
  splitPublicPhoneValue,
} from "@/lib/validators/public-form-fields";

type CompanyLeadState = z.input<typeof companyLeadSchema>;
type CompanyLeadErrors = Partial<Record<keyof CompanyLeadState, string>>;

const initialValues: CompanyLeadState = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  need: "",
  message: "",
};

function mapZodErrors(error: z.ZodError<CompanyLeadState>) {
  return error.issues.reduce<CompanyLeadErrors>((acc, issue) => {
    const field = issue.path[0] as keyof CompanyLeadState | undefined;

    if (field && !acc[field]) {
      acc[field] = issue.message;
    }

    return acc;
  }, {});
}

export function ContactCompanyForm() {
  const { colors } = themeTokens;
  const initialPhone = splitPublicPhoneValue(initialValues.phone);
  const [values, setValues] = useState<CompanyLeadState>(initialValues);
  const [phonePrefix, setPhonePrefix] = useState<string>(initialPhone.prefix);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone.number);
  const [errors, setErrors] = useState<CompanyLeadErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFormValid = companyLeadSchema.safeParse(values).success;
  const canSubmit = isFormValid && !isSubmitting;

  function updateField<K extends keyof CompanyLeadState>(field: K, value: CompanyLeadState[K]) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function updatePhone(nextPrefix: string, nextNumber: string) {
    const normalizedNumber = normalizePublicPhoneDigits(nextPrefix, nextNumber);
    setPhonePrefix(nextPrefix);
    setPhoneNumber(normalizedNumber);
    updateField("phone", composePublicPhoneValue(nextPrefix, normalizedNumber));
  }

  function getFieldError(field: keyof CompanyLeadState, draft: CompanyLeadState = values) {
    const parsed = companyLeadSchema.safeParse(draft);
    return parsed.success ? undefined : getZodFieldError(parsed.error, field);
  }

  function handleFieldBlur(field: keyof CompanyLeadState) {
    setErrors((current) => ({
      ...current,
      [field]: getFieldError(field),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = companyLeadSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(mapZodErrors(parsed.error));
      toast.error("Please review the highlighted company inquiry fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitCompanyLead({
        ...parsed.data,
        sourcePage: "contact",
      });
      toast.success(result.message ?? "Your company inquiry has been captured.");
      setValues(initialValues);
      setPhonePrefix(defaultPublicPhonePrefix);
      setPhoneNumber("");
      setErrors({});
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message || "Unable to submit your team request right now.");
      } else {
        toast.error("Network error. Please try again in a moment.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      id="company-inquiry"
      className="rounded-[1.75rem] border bg-white p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.28)] sm:p-7"
      style={{ borderColor: colors.border }}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="space-y-3">
        <p className={publicFormEyebrowClass} style={{ color: colors.accent }}>
          For companies
        </p>
        <h3 className={publicFormHeadingClass}>Get My Team</h3>
        <p className={publicFormDescriptionClass}>
          Share the hiring need, team shape, or delivery gap and Tekorix can route the right staffing or
          team-building conversation.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-company-name" className={publicFormLabelClass}>
            Full Name
          </Label>
          <Input
            id="contact-company-name"
            value={values.name}
            onChange={(event) => updateField("name", sanitizePersonNameInput(event.target.value))}
            placeholder="Your full name"
            maxLength={80}
            className={publicFormInputClass}
            aria-invalid={Boolean(errors.name)}
            onBlur={() => handleFieldBlur("name")}
          />
          <PublicFieldMessages error={errors.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-company-company" className={publicFormLabelClass}>
            Company Name
          </Label>
          <Input
            id="contact-company-company"
            value={values.companyName}
            onChange={(event) => updateField("companyName", sanitizeCompanyNameInput(event.target.value))}
            placeholder="Your company name"
            maxLength={120}
            className={publicFormInputClass}
            aria-invalid={Boolean(errors.companyName)}
            onBlur={() => handleFieldBlur("companyName")}
          />
          <PublicFieldMessages error={errors.companyName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-company-email" className={publicFormLabelClass}>
            Work Email
          </Label>
          <Input
            id="contact-company-email"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", sanitizeEmailInput(event.target.value))}
            placeholder="you@company.com"
            className={publicFormInputClass}
            aria-invalid={Boolean(errors.email)}
            onBlur={() => handleFieldBlur("email")}
          />
          <PublicFieldMessages error={errors.email} />
        </div>

        <PublicPhoneField
          idPrefix="contact-company"
          countryCode={phonePrefix}
          phoneNumber={phoneNumber}
          onCountryCodeChange={(value) => updatePhone(value, phoneNumber)}
          onPhoneNumberChange={(value) => updatePhone(phonePrefix, value)}
          error={errors.phone}
          helperText="Use a direct work number for faster follow-up from the Tekorix team."
          onBlur={() => handleFieldBlur("phone")}
        />
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="contact-company-need" className={publicFormLabelClass}>
          What do you need?
        </Label>
        <Select
          value={values.need}
          onValueChange={(value) => {
            updateField("need", value);
            setErrors((current) => ({
              ...current,
              need: getFieldError("need", { ...values, need: value }),
            }));
          }}
        >
          <SelectTrigger
            id="contact-company-need"
            className={publicFormSelectTriggerClass}
            aria-invalid={Boolean(errors.need)}
          >
            <SelectValue placeholder="Select requirement" />
          </SelectTrigger>
          <SelectContent>
            {companyLeadNeedValues.map((item) => (
              <SelectItem key={item} value={item}>
                {companyLeadNeedLabels[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <PublicFieldMessages
          error={errors.need}
          helperText="Choose the closest hiring or team-building requirement."
        />
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="contact-company-message" className={publicFormLabelClass}>
          Additional Requirements / Message
        </Label>
        <Textarea
          id="contact-company-message"
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Share the roles, team size, expected timeline, delivery model, or any hiring constraints."
          className={publicFormTextareaClass}
          maxLength={700}
          aria-invalid={Boolean(errors.message)}
          onBlur={() => handleFieldBlur("message")}
        />
        <PublicFieldMessages
          error={errors.message}
          helperText="Add enough detail for a meaningful first response."
          note={`${values.message.length}/700 characters`}
        />
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          className="border-0 text-white hover:opacity-95"
          style={{ backgroundColor: colors.accent }}
        >
          {isSubmitting ? "Submitting..." : "Get My Team"}
        </Button>
      </div>
    </form>
  );
}
