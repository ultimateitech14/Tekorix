"use client";

import Link from "next/link";
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

export function FindTalentLeadForm() {
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
      toast.error("Please review the highlighted fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitCompanyLead({
        ...parsed.data,
        sourcePage: "find-talent",
      });
      toast.success(result.message ?? "Your request has been captured.");
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
    <section id="company-lead-form" style={{ backgroundColor: colors.surfaceAlt }} className="public-section">
      <div className="site-container grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div
          className="rounded-[2rem] border bg-white p-7 shadow-[0_28px_70px_-44px_rgba(15,23,42,0.22)] sm:p-8"
          style={{
            borderColor: colors.border,
          }}
        >
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: colors.primary }}>
              Company inquiry
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Tell us the role, team shape, or delivery gap you need to solve.
            </h2>
            <p className="text-base leading-7 text-slate-600">
              Use this form when you need a consultant, a bench-ready specialist, or a broader team-building
              conversation. Tekorix can support the hiring route and the operating model around it.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <div
              className="rounded-2xl border bg-slate-50 px-4 py-4 text-sm text-slate-700"
              style={{
                borderColor: colors.border,
              }}
            >
              Permanent, contractual, hourly, and mixed engagement requests.
            </div>
            <div
              className="rounded-2xl border bg-slate-50 px-4 py-4 text-sm text-slate-700"
              style={{
                borderColor: colors.border,
              }}
            >
              On-roll consultants, payroll, HR, and compliance coordination can stay with Tekorix.
            </div>
            <div
              className="rounded-2xl border bg-slate-50 px-4 py-4 text-sm text-slate-700"
              style={{
                borderColor: colors.border,
              }}
            >
              Team build and restructure conversations are supported alongside individual hiring needs.
            </div>
          </div>

          <div
            className="mt-8 rounded-2xl border px-5 py-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surfaceAlt,
            }}
          >
            <p className="text-sm font-semibold" style={{ color: colors.primary }}>
              Need a direct conversation instead?
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              If your requirement needs a live discussion first, use the direct contact path and we will route
              it to the right Tekorix team.
            </p>
            <div className="mt-4">
              <Button
                asChild
                variant="outline"
                className="border-[#BED9F3] bg-[#F8FBFF] text-slate-950 hover:bg-[#E6F1FF] hover:text-slate-950"
              >
                <Link href="/contact">Talk to Us</Link>
              </Button>
            </div>
          </div>
        </div>

        <form
          className="rounded-[2rem] border bg-white p-6 shadow-[0_28px_70px_-48px_rgba(15,23,42,0.26)] sm:p-8"
          style={{ borderColor: colors.border }}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="space-y-3">
            <p className={publicFormEyebrowClass} style={{ color: colors.accent }}>
              Submit your inquiry
            </p>
            <h3 className={publicFormHeadingClass}>Get My Team</h3>
            <p className={publicFormDescriptionClass}>
              Share the basics and Tekorix can respond with the right hiring or team-building path.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-lead-name" className={publicFormLabelClass}>
                Full Name
              </Label>
              <Input
                id="company-lead-name"
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
              <Label htmlFor="company-lead-company" className={publicFormLabelClass}>
                Company Name
              </Label>
              <Input
                id="company-lead-company"
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
              <Label htmlFor="company-lead-email" className={publicFormLabelClass}>
                Work Email
              </Label>
              <Input
                id="company-lead-email"
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
              idPrefix="company-lead"
              countryCode={phonePrefix}
              phoneNumber={phoneNumber}
              onCountryCodeChange={(value) => updatePhone(value, phoneNumber)}
              onPhoneNumberChange={(value) => updatePhone(phonePrefix, value)}
              error={errors.phone}
              helperText="Use a direct work number for faster coordination."
              onBlur={() => handleFieldBlur("phone")}
            />
          </div>

          <div className="mt-5 space-y-2">
            <Label htmlFor="company-lead-need" className={publicFormLabelClass}>
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
                id="company-lead-need"
                className={publicFormSelectTriggerClass}
                aria-invalid={Boolean(errors.need)}
              >
                <SelectValue placeholder="Select hiring need" />
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
              helperText="Choose the route closest to your current hiring need."
            />
          </div>

          <div className="mt-5 space-y-2">
            <Label htmlFor="company-lead-message" className={publicFormLabelClass}>
              Message
            </Label>
            <Textarea
              id="company-lead-message"
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Tell us the roles, team size, timeline, delivery challenge, or operating model you want help with."
              className={publicFormTextareaClass}
              maxLength={700}
              aria-invalid={Boolean(errors.message)}
              onBlur={() => handleFieldBlur("message")}
            />
            <PublicFieldMessages
              error={errors.message}
              helperText="Add enough detail for a faster first conversation."
              note={`${values.message.length}/700 characters`}
            />
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-slate-500">
              Prefer a broader discovery discussion?{" "}
              <Link href="/contact" className="font-medium text-slate-900 underline underline-offset-4">
                Use the contact page.
              </Link>
            </p>
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
      </div>
    </section>
  );
}
