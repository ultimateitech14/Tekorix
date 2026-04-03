"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import {
  PublicFieldMessages,
  PublicPhoneField,
  publicFormFileInputClass,
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
import {
  requestCandidateLeadUploadUrl,
  submitCandidateLead,
  uploadCandidateResumeToR2,
} from "@/lib/api/candidate-leads";
import { themeTokens } from "@/lib/theme/tokens";
import {
  candidateLeadExperienceLabels,
  candidateLeadExperienceValues,
  candidateLeadSchema,
} from "@/lib/validators/candidate-lead";
import {
  composePublicPhoneValue,
  defaultPublicPhonePrefix,
  getPublicResumeValidationError,
  getZodFieldError,
  normalizePublicPhoneDigits,
  publicResumeAccept,
  sanitizeEmailInput,
  sanitizeLocationTextInput,
  sanitizePersonNameInput,
  sanitizeRoleTextInput,
  sanitizeUrlInput,
  splitPublicPhoneValue,
} from "@/lib/validators/public-form-fields";

type CandidateLeadFormVariant = "resume-submission" | "market-resume";
type CandidateLeadState = z.input<typeof candidateLeadSchema>;
type CandidateLeadErrors = Partial<Record<keyof CandidateLeadState, string>> & {
  resume?: string;
  submission?: string;
};
type SubmissionStage = "idle" | "requesting-upload-url" | "uploading-resume" | "submitting-final";

type FindJobCandidateLeadFormProps = {
  variant: CandidateLeadFormVariant;
  buttonLabel: string;
};

function createInitialValues(variant: CandidateLeadFormVariant): CandidateLeadState {
  return {
    fullName: "",
    email: "",
    phone: "",
    role: "",
    experience: "",
    submissionType: variant,
    desiredLocation: "",
    desiredSalaryRange: "",
    skills: "",
    linkedInUrl: "",
  };
}

function mapZodErrors(error: z.ZodError<CandidateLeadState>) {
  return error.issues.reduce<CandidateLeadErrors>((acc, issue) => {
    const field = issue.path[0] as keyof CandidateLeadState | undefined;

    if (field && !acc[field]) {
      acc[field] = issue.message;
    }

    return acc;
  }, {});
}

function getSubmissionErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

function getSubmitButtonLabel(stage: SubmissionStage, defaultLabel: string) {
  switch (stage) {
    case "requesting-upload-url":
      return "Preparing upload...";
    case "uploading-resume":
      return "Uploading resume...";
    case "submitting-final":
      return "Submitting...";
    default:
      return defaultLabel;
  }
}

export function FindJobCandidateLeadForm({ variant, buttonLabel }: FindJobCandidateLeadFormProps) {
  const { colors } = themeTokens;
  const isMarketResume = variant === "market-resume";
  const initialPhone = splitPublicPhoneValue("");
  const [values, setValues] = useState<CandidateLeadState>(() => createInitialValues(variant));
  const [phonePrefix, setPhonePrefix] = useState<string>(initialPhone.prefix);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone.number);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [errors, setErrors] = useState<CandidateLeadErrors>({});
  const [submissionStage, setSubmissionStage] = useState<SubmissionStage>("idle");
  const parsed = candidateLeadSchema.safeParse({
    ...values,
    submissionType: variant,
  });
  const canSubmit = parsed.success && Boolean(resumeFile) && submissionStage === "idle";

  function updateField<K extends keyof CandidateLeadState>(field: K, value: CandidateLeadState[K]) {
    setValues((current) => ({
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

  function getFieldError(field: keyof CandidateLeadState, draft: CandidateLeadState = values) {
    const parsedValue = candidateLeadSchema.safeParse({
      ...draft,
      submissionType: variant,
    });
    return parsedValue.success ? undefined : getZodFieldError(parsedValue.error, field);
  }

  function handleFieldBlur(field: keyof CandidateLeadState) {
    setErrors((current) => ({
      ...current,
      [field]: getFieldError(field),
    }));
  }

  function handleResumeChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    const nextError = getPublicResumeValidationError(file);

    if (nextError) {
      setResumeFile(null);
      setFileInputKey((current) => current + 1);
      setErrors((current) => ({
        ...current,
        resume: nextError,
        submission: undefined,
      }));
      toast.error(nextError);
      return;
    }

    setResumeFile(file);
    setErrors((current) => ({
      ...current,
      resume: undefined,
      submission: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validated = candidateLeadSchema.safeParse({
      ...values,
      submissionType: variant,
    });

    if (!validated.success) {
      setErrors(mapZodErrors(validated.error));
      toast.error("Please review the highlighted candidate fields.");
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

    setSubmissionStage("requesting-upload-url");
    let failurePhase: "upload-url" | "upload" | "submit" = "upload-url";

    try {
      const uploadResponse = await requestCandidateLeadUploadUrl({
        fileName: resumeFile.name,
        contentType: resumeFile.type,
        submissionType: variant,
      });

      failurePhase = "upload";
      setSubmissionStage("uploading-resume");

      await uploadCandidateResumeToR2({
        uploadUrl: uploadResponse.data.uploadUrl,
        file: resumeFile,
        contentType: uploadResponse.data.contentType,
      });

      failurePhase = "submit";
      setSubmissionStage("submitting-final");

      const response = await submitCandidateLead({
        ...validated.data,
        submissionType: variant,
        sourcePage: "find-job",
        resume_object_key: uploadResponse.data.objectKey,
        resume_file_name: resumeFile.name,
        resume_content_type: uploadResponse.data.contentType,
      });

      toast.success(
        isMarketResume
          ? (response.message ?? "Your profile has been shared for future role marketing.")
          : (response.message ?? "Your resume has been submitted."),
      );
      setValues(createInitialValues(variant));
      setPhonePrefix(defaultPublicPhonePrefix);
      setPhoneNumber("");
      setResumeFile(null);
      setFileInputKey((current) => current + 1);
      setErrors({});
    } catch (error) {
      const fallbackMessage =
        failurePhase === "upload-url"
          ? "Unable to prepare your resume upload right now."
          : failurePhase === "upload"
            ? "Resume upload failed. Please try again."
            : "Unable to submit your profile right now.";
      toast.error(getSubmissionErrorMessage(error, fallbackMessage));
    } finally {
      setSubmissionStage("idle");
    }
  }

  return (
    <form
      className="rounded-[1.75rem] border bg-white p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.28)] sm:p-7"
      style={{ borderColor: colors.border }}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${variant}-full-name`} className={publicFormLabelClass}>
            Full Name
          </Label>
          <Input
            id={`${variant}-full-name`}
            value={values.fullName}
            onChange={(event) => updateField("fullName", sanitizePersonNameInput(event.target.value))}
            placeholder="Your full name"
            maxLength={80}
            className={publicFormInputClass}
            aria-invalid={Boolean(errors.fullName)}
            onBlur={() => handleFieldBlur("fullName")}
          />
          <PublicFieldMessages error={errors.fullName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${variant}-email`} className={publicFormLabelClass}>
            Email Address
          </Label>
          <Input
            id={`${variant}-email`}
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", sanitizeEmailInput(event.target.value))}
            placeholder="you@example.com"
            className={publicFormInputClass}
            aria-invalid={Boolean(errors.email)}
            onBlur={() => handleFieldBlur("email")}
          />
          <PublicFieldMessages error={errors.email} />
        </div>

        <PublicPhoneField
          idPrefix={variant}
          countryCode={phonePrefix}
          phoneNumber={phoneNumber}
          onCountryCodeChange={(value) => updatePhone(value, phoneNumber)}
          onPhoneNumberChange={(value) => updatePhone(phonePrefix, value)}
          error={errors.phone}
          helperText="Use a number where recruiters can contact you for interview coordination."
          onBlur={() => handleFieldBlur("phone")}
        />

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${variant}-role`} className={publicFormLabelClass}>
            {isMarketResume ? "Desired Role" : "Current Role"}
          </Label>
          <Input
            id={`${variant}-role`}
            value={values.role}
            onChange={(event) => updateField("role", sanitizeRoleTextInput(event.target.value))}
            placeholder={isMarketResume ? "Senior Backend Engineer" : "Current or recent role"}
            maxLength={120}
            className={publicFormInputClass}
            aria-invalid={Boolean(errors.role)}
            onBlur={() => handleFieldBlur("role")}
          />
          <PublicFieldMessages error={errors.role} />
        </div>

        {!isMarketResume ? (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${variant}-experience`} className={publicFormLabelClass}>
              Years of Experience
            </Label>
            <Select
              value={values.experience}
              onValueChange={(value) => {
                updateField("experience", value);
                setErrors((current) => ({
                  ...current,
                  experience: getFieldError("experience", { ...values, experience: value }),
                }));
              }}
            >
              <SelectTrigger
                id={`${variant}-experience`}
                className={publicFormSelectTriggerClass}
                aria-invalid={Boolean(errors.experience)}
              >
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                {candidateLeadExperienceValues.map((item) => (
                  <SelectItem key={item} value={item}>
                    {candidateLeadExperienceLabels[item]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <PublicFieldMessages error={errors.experience} />
          </div>
        ) : null}

        {!isMarketResume ? (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${variant}-linkedin`} className={publicFormLabelClass}>
              LinkedIn Profile URL (Optional)
            </Label>
            <Input
              id={`${variant}-linkedin`}
              type="url"
              value={values.linkedInUrl}
              onChange={(event) => updateField("linkedInUrl", sanitizeUrlInput(event.target.value))}
              placeholder="https://linkedin.com/in/your-profile"
              maxLength={240}
              className={publicFormInputClass}
              aria-invalid={Boolean(errors.linkedInUrl)}
              onBlur={() => handleFieldBlur("linkedInUrl")}
            />
            <PublicFieldMessages
              error={errors.linkedInUrl}
              helperText="Add LinkedIn if you want recruiters to review your recent projects faster."
            />
          </div>
        ) : null}

        {isMarketResume ? (
          <>
            <div className="space-y-2">
              <Label htmlFor={`${variant}-desired-location`} className={publicFormLabelClass}>
                Desired Location
              </Label>
              <Input
                id={`${variant}-desired-location`}
                value={values.desiredLocation}
                onChange={(event) =>
                  updateField("desiredLocation", sanitizeLocationTextInput(event.target.value))
                }
                placeholder="Bengaluru / Remote"
                maxLength={120}
                className={publicFormInputClass}
                aria-invalid={Boolean(errors.desiredLocation)}
                onBlur={() => handleFieldBlur("desiredLocation")}
              />
              <PublicFieldMessages error={errors.desiredLocation} />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${variant}-desired-salary`} className={publicFormLabelClass}>
                Desired Salary Range
              </Label>
              <Input
                id={`${variant}-desired-salary`}
                value={values.desiredSalaryRange}
                onChange={(event) => updateField("desiredSalaryRange", event.target.value)}
                placeholder="INR 18L - 24L"
                maxLength={120}
                className={publicFormInputClass}
                aria-invalid={Boolean(errors.desiredSalaryRange)}
                onBlur={() => handleFieldBlur("desiredSalaryRange")}
              />
              <PublicFieldMessages
                error={errors.desiredSalaryRange}
                helperText="You can share a broad range if exact compensation is flexible."
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor={`${variant}-skills`} className={publicFormLabelClass}>
                Skills / Technologies
              </Label>
              <Textarea
                id={`${variant}-skills`}
                value={values.skills}
                onChange={(event) => updateField("skills", event.target.value)}
                placeholder="React, Node.js, AWS, Python, Kafka"
                className={publicFormTextareaClass}
                maxLength={300}
                aria-invalid={Boolean(errors.skills)}
                onBlur={() => handleFieldBlur("skills")}
              />
              <PublicFieldMessages
                error={errors.skills}
                helperText="List the stacks or capabilities you want Tekorix to position more strongly."
                note={`${(values.skills ?? "").length}/300 characters`}
              />
            </div>
          </>
        ) : null}

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${variant}-resume`} className={publicFormLabelClass}>
            Resume Upload
          </Label>
          <input
            key={fileInputKey}
            id={`${variant}-resume`}
            type="file"
            accept={publicResumeAccept}
            onChange={handleResumeChange}
            className={publicFormFileInputClass}
            aria-invalid={Boolean(errors.resume)}
          />
          <PublicFieldMessages
            error={errors.resume}
            helperText="Accepted formats: PDF, DOC, or DOCX."
            note={resumeFile ? `Selected file: ${resumeFile.name}` : "Maximum file size: 5 MB."}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          className="border-0 text-white hover:opacity-95"
          style={{ backgroundColor: colors.accent }}
        >
          {getSubmitButtonLabel(submissionStage, buttonLabel)}
        </Button>
      </div>
    </form>
  );
}
