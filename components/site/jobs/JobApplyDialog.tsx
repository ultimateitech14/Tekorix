"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import {
  PublicFieldMessages,
  PublicPhoneField,
  publicFormFileInputClass,
  publicFormInputClass,
  publicFormLabelClass,
  publicFormTextareaClass,
} from "@/components/global/PublicFormFields";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestFormDataApi } from "@/lib/api/http";
import { Textarea } from "@/components/ui/textarea";
import type { PublicJob } from "@/lib/api/jobs";
import { formatPublicJobReference } from "@/lib/public-jobs";
import { themeTokens } from "@/lib/theme/tokens";
import { jobApplicationSubmissionSchema } from "@/lib/validators/job-applications";
import {
  composePublicPhoneValue,
  defaultPublicPhonePrefix,
  getPublicResumeValidationError,
  publicResumeMaxSizeLabel,
  getZodFieldError,
  normalizePublicPhoneDigits,
  publicResumeAccept,
  sanitizeEmailInput,
  sanitizeLocationTextInput,
  sanitizePersonNameInput,
  splitPublicPhoneValue,
} from "@/lib/validators/public-form-fields";

type JobApplyDialogProps = {
  job: PublicJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type JobApplicationFormValues = Pick<
  z.input<typeof jobApplicationSubmissionSchema>,
  "fullName" | "email" | "phone" | "location" | "experience" | "coverLetter"
>;

type JobApplicationErrors = Partial<Record<keyof JobApplicationFormValues, string>> & {
  resume?: string;
  submission?: string;
};

const initialState: JobApplicationFormValues = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  experience: "",
  coverLetter: "",
};

function mapZodErrors(error: z.ZodError<z.input<typeof jobApplicationSubmissionSchema>>) {
  return error.issues.reduce<JobApplicationErrors>((acc, issue) => {
    const field = issue.path[0] as keyof JobApplicationFormValues | undefined;

    if (field && !acc[field]) {
      acc[field] = issue.message;
    }

    return acc;
  }, {});
}

export function JobApplyDialog({ job, open, onOpenChange }: JobApplyDialogProps) {
  const { colors } = themeTokens;
  const initialPhone = splitPublicPhoneValue(initialState.phone);
  const [formValues, setFormValues] = useState<JobApplicationFormValues>(initialState);
  const [phonePrefix, setPhonePrefix] = useState<string>(initialPhone.prefix);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone.number);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [errors, setErrors] = useState<JobApplicationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormValues(initialState);
    setPhonePrefix(defaultPublicPhonePrefix);
    setPhoneNumber("");
    setResumeFile(null);
    setFileInputKey((current) => current + 1);
    setErrors({});
    setIsSubmitting(false);
  }, [open, job?.id]);

  const parsedValues = useMemo(() => {
    if (!job) {
      return null;
    }

    return jobApplicationSubmissionSchema.safeParse({
      jobId: job.id,
      jobTitle: job.title,
      jobLocation: job.location,
      ...formValues,
    });
  }, [formValues, job]);

  const canSubmit = Boolean(job) && Boolean(resumeFile) && Boolean(parsedValues?.success) && !isSubmitting;

  function updateField<K extends keyof JobApplicationFormValues>(
    field: K,
    value: JobApplicationFormValues[K],
  ) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      resume: undefined,
      submission: undefined,
    }));
  }

  function updatePhone(nextPrefix: string, nextNumber: string) {
    const normalizedNumber = normalizePublicPhoneDigits(nextPrefix, nextNumber);
    setPhonePrefix(nextPrefix);
    setPhoneNumber(normalizedNumber);
    updateField("phone", composePublicPhoneValue(nextPrefix, normalizedNumber));
  }

  function getFieldError(
    field: keyof JobApplicationFormValues,
    draft: JobApplicationFormValues = formValues,
  ) {
    if (!job) {
      return undefined;
    }

    const parsed = jobApplicationSubmissionSchema.safeParse({
      jobId: job.id,
      jobTitle: job.title,
      jobLocation: job.location,
      ...draft,
    });

    return parsed.success ? undefined : getZodFieldError(parsed.error, field);
  }

  function handleFieldBlur(field: keyof JobApplicationFormValues) {
    setErrors((current) => ({
      ...current,
      [field]: getFieldError(field),
    }));
  }

  function updateResumeFile(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    const nextError = getPublicResumeValidationError(nextFile, {
      required: true,
      requiredMessage: "Please upload your resume to continue.",
    });

    if (nextError) {
      setResumeFile(null);
      setFileInputKey((current) => current + 1);
      setErrors((current) => ({
        ...current,
        resume: nextError,
      }));
      toast.error(nextError);
      return;
    }

    setResumeFile(nextFile);
    setErrors((current) => ({
      ...current,
      resume: undefined,
      submission: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!job) {
      return;
    }

    const validated = jobApplicationSubmissionSchema.safeParse({
      jobId: job.id,
      jobTitle: job.title,
      jobLocation: job.location,
      ...formValues,
    });

    if (!validated.success) {
      setErrors(mapZodErrors(validated.error));
      toast.error("Please review the highlighted application fields.");
      return;
    }

    if (!resumeFile) {
      setErrors((current) => ({
        ...current,
        resume: "Please upload your resume to continue.",
      }));
      toast.error("Please upload your resume to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.set("jobId", job.id);
      payload.set("jobTitle", job.title);
      payload.set("jobLocation", job.location);
      payload.set("fullName", validated.data.fullName);
      payload.set("email", validated.data.email);
      payload.set("phone", validated.data.phone);
      payload.set("location", validated.data.location);
      payload.set("experience", validated.data.experience);
      payload.set("coverLetter", validated.data.coverLetter);
      payload.set("resume", resumeFile);

      const result = await requestFormDataApi<{ id: string }>("/api/v1/job-applications", payload);
      toast.success(result.message ?? `Application submitted for ${job.title}.`);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit your application right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-[1.75rem] border border-slate-200 bg-white p-0 shadow-[0_34px_90px_-48px_rgba(15,23,42,0.45)]">
        <div className="h-1.5" style={{ backgroundColor: colors.primary }} />
        <div className="space-y-6 px-6 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-7">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="font-display text-3xl leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Apply for {job?.title ?? "this role"}
            </DialogTitle>
            {job ? (
              <DialogDescription className="space-y-1 text-sm text-slate-600">
                <span className="block">Reference Number {formatPublicJobReference(job.id)}</span>
                <span className="block">{job.location}</span>
              </DialogDescription>
            ) : null}
          </DialogHeader>

          <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="job-apply-name" className={publicFormLabelClass}>
                  Full Name
                </Label>
                <Input
                  id="job-apply-name"
                  value={formValues.fullName}
                  onChange={(event) => updateField("fullName", sanitizePersonNameInput(event.target.value))}
                  placeholder="Your full name"
                  className={publicFormInputClass}
                  aria-invalid={Boolean(errors.fullName)}
                  onBlur={() => handleFieldBlur("fullName")}
                />
                <PublicFieldMessages error={errors.fullName} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-apply-email" className={publicFormLabelClass}>
                  Email Address
                </Label>
                <Input
                  id="job-apply-email"
                  type="email"
                  value={formValues.email}
                  onChange={(event) => updateField("email", sanitizeEmailInput(event.target.value))}
                  placeholder="you@email.com"
                  className={publicFormInputClass}
                  aria-invalid={Boolean(errors.email)}
                  onBlur={() => handleFieldBlur("email")}
                />
                <PublicFieldMessages error={errors.email} />
              </div>

              <PublicPhoneField
                idPrefix="job-apply"
                countryCode={phonePrefix}
                phoneNumber={phoneNumber}
                onCountryCodeChange={(value) => updatePhone(value, phoneNumber)}
                onPhoneNumberChange={(value) => updatePhone(phonePrefix, value)}
                error={errors.phone}
                helperText="Use the best number for interview coordination and recruiter follow-up."
                className="sm:col-span-2"
                onBlur={() => handleFieldBlur("phone")}
              />

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="job-apply-location" className={publicFormLabelClass}>
                  Current Location
                </Label>
                <Input
                  id="job-apply-location"
                  value={formValues.location}
                  onChange={(event) => updateField("location", sanitizeLocationTextInput(event.target.value))}
                  placeholder="City, Country"
                  className={publicFormInputClass}
                  aria-invalid={Boolean(errors.location)}
                  onBlur={() => handleFieldBlur("location")}
                />
                <PublicFieldMessages error={errors.location} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-apply-experience" className={publicFormLabelClass}>
                Experience Summary
              </Label>
              <Input
                id="job-apply-experience"
                value={formValues.experience}
                onChange={(event) => updateField("experience", event.target.value)}
                placeholder="Example: 4 years in frontend engineering"
                className={publicFormInputClass}
                aria-invalid={Boolean(errors.experience)}
                onBlur={() => handleFieldBlur("experience")}
              />
              <PublicFieldMessages
                error={errors.experience}
                helperText="Keep it short and specific to your most relevant experience."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-apply-key-skills" className={publicFormLabelClass}>
                Key Skills
              </Label>
              <Textarea
                id="job-apply-key-skills"
                value={formValues.coverLetter}
                onChange={(event) => updateField("coverLetter", event.target.value)}
                placeholder="Example: React, TypeScript, Node.js, GraphQL"
                className={publicFormTextareaClass}
                maxLength={300}
                aria-invalid={Boolean(errors.coverLetter)}
                onBlur={() => handleFieldBlur("coverLetter")}
              />
              <PublicFieldMessages
                error={errors.coverLetter}
                helperText="Add 2-5 core skills that map directly to this role."
                note={`${formValues.coverLetter.length}/300 characters`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-apply-resume" className={publicFormLabelClass}>
                Resume Upload
              </Label>
              <input
                key={fileInputKey}
                id="job-apply-resume"
                type="file"
                accept={publicResumeAccept}
                onChange={updateResumeFile}
                className={publicFormFileInputClass}
                aria-invalid={Boolean(errors.resume)}
              />
              <PublicFieldMessages
                error={errors.resume}
                helperText="Accepted formats: PDF, DOC, or DOCX."
                note={resumeFile ? `Selected file: ${resumeFile.name}` : `Maximum file size: ${publicResumeMaxSizeLabel}.`}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-slate-500">
                Submit once and Tekorix will route your application through the current hiring workflow.
              </p>
              <Button
                type="submit"
                disabled={!canSubmit}
                className="rounded-xl border-0 px-6 text-white shadow-[0_18px_36px_-20px_rgba(37,99,235,0.6)] hover:opacity-95"
                style={{ backgroundColor: colors.primary }}
              >
                {isSubmitting ? "Submitting..." : "Apply Now"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
