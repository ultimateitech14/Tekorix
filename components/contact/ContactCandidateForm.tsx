"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import {
  PublicFieldMessages,
  PublicPhoneField,
  publicFormDescriptionClass,
  publicFormEyebrowClass,
  publicFormFileInputClass,
  publicFormHeadingClass,
  publicFormInputClass,
  publicFormLabelClass,
  publicFormSelectTriggerClass,
} from "@/components/global/PublicFormFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  requestCandidateLeadUploadUrl,
  submitCandidateLead,
  uploadCandidateResumeToR2,
} from "@/lib/api/candidate-leads";
import { themeTokens } from "@/lib/theme/tokens";
import { cn } from "@/lib/utils";
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
  sanitizePersonNameInput,
  sanitizeRoleTextInput,
  sanitizeUrlInput,
  splitPublicPhoneValue,
} from "@/lib/validators/public-form-fields";

type CandidateLeadState = z.input<typeof candidateLeadSchema>;
type CandidateLeadErrors = Partial<Record<keyof CandidateLeadState, string>> & {
  resume?: string;
  submission?: string;
};
type SubmissionStage = "idle" | "requesting-upload-url" | "uploading-resume" | "submitting-final";

const initialValues: CandidateLeadState = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  experience: "",
  linkedInUrl: "",
};

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

function getSubmitButtonLabel(stage: SubmissionStage) {
  switch (stage) {
    case "requesting-upload-url":
      return "Preparing upload...";
    case "uploading-resume":
      return "Uploading resume...";
    case "submitting-final":
      return "Submitting...";
    default:
      return "Apply Now";
  }
}

type ContactCandidateFormProps = {
  isActive?: boolean;
};

export function ContactCandidateForm({ isActive = false }: ContactCandidateFormProps) {
  const { colors } = themeTokens;
  const initialPhone = splitPublicPhoneValue(initialValues.phone);
  const [values, setValues] = useState<CandidateLeadState>(initialValues);
  const [phonePrefix, setPhonePrefix] = useState<string>(initialPhone.prefix);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone.number);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [errors, setErrors] = useState<CandidateLeadErrors>({});
  const [submissionStage, setSubmissionStage] = useState<SubmissionStage>("idle");
  const isFormValid =
    candidateLeadSchema.safeParse(values).success && (Boolean(values.linkedInUrl) || Boolean(resumeFile));
  const canSubmit = isFormValid && submissionStage === "idle";

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
    const parsed = candidateLeadSchema.safeParse(draft);
    return parsed.success ? undefined : getZodFieldError(parsed.error, field);
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

    const parsed = candidateLeadSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(mapZodErrors(parsed.error));
      toast.error("Please review the highlighted candidate inquiry fields.");
      return;
    }

    if (!values.linkedInUrl && !resumeFile) {
      setErrors((current) => ({
        ...current,
        resume: "Please provide either a LinkedIn URL or a resume upload.",
      }));
      toast.error("Please provide either a LinkedIn URL or a resume upload.");
      return;
    }

    setSubmissionStage(resumeFile ? "requesting-upload-url" : "submitting-final");
    let failurePhase: "upload-url" | "upload" | "submit" = resumeFile ? "upload-url" : "submit";

    try {
      let resumePayload:
        | {
            resume_object_key: string;
            resume_file_name: string;
            resume_content_type: "application/pdf" | "application/msword" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          }
        | undefined;

      if (resumeFile) {
        const uploadResponse = await requestCandidateLeadUploadUrl({
          fileName: resumeFile.name,
          contentType: resumeFile.type,
          submissionType: parsed.data.submissionType,
        });

        failurePhase = "upload";
        setSubmissionStage("uploading-resume");

        await uploadCandidateResumeToR2({
          uploadUrl: uploadResponse.data.uploadUrl,
          file: resumeFile,
          contentType: uploadResponse.data.contentType,
        });

        resumePayload = {
          resume_object_key: uploadResponse.data.objectKey,
          resume_file_name: resumeFile.name,
          resume_content_type: uploadResponse.data.contentType,
        };
      }

      failurePhase = "submit";
      setSubmissionStage("submitting-final");

      const response = await submitCandidateLead({
        ...parsed.data,
        sourcePage: "contact",
        ...resumePayload,
      });

      toast.success(response.message ?? "Your candidate inquiry has been received.");
      setValues(initialValues);
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
            : "Unable to submit your candidate inquiry right now.";
      toast.error(getSubmissionErrorMessage(error, fallbackMessage));
    } finally {
      setSubmissionStage("idle");
    }
  }

  return (
    <form
      id="candidate-inquiry"
      className={cn(
        "rounded-[1.75rem] border bg-white p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B6D5F6] hover:shadow-[0_28px_66px_-42px_rgba(27,102,179,0.2)] sm:p-7",
        isActive
          ? "border-[#1B66B3] bg-[linear-gradient(180deg,#FFFFFF_0%,#F7FBFF_100%)] shadow-[0_28px_68px_-40px_rgba(27,102,179,0.28)] ring-2 ring-[#D7E8FA]"
          : "border-transparent",
      )}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="space-y-3">
        <p className={publicFormEyebrowClass} style={{ color: colors.primary }}>
          For candidates
        </p>
        <h3 className={publicFormHeadingClass}>Apply Now</h3>
        <p className={publicFormDescriptionClass}>
          Share your profile, target role, and either a LinkedIn URL or resume so Tekorix can review your
          background and follow up with the right next step.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-candidate-name" className={publicFormLabelClass}>
            Full Name
          </Label>
          <Input
            id="contact-candidate-name"
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
          <Label htmlFor="contact-candidate-email" className={publicFormLabelClass}>
            Email Address
          </Label>
          <Input
            id="contact-candidate-email"
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
          idPrefix="contact-candidate"
          countryCode={phonePrefix}
          phoneNumber={phoneNumber}
          onCountryCodeChange={(value) => updatePhone(value, phoneNumber)}
          onPhoneNumberChange={(value) => updatePhone(phonePrefix, value)}
          error={errors.phone}
          showSupportText={false}
          onBlur={() => handleFieldBlur("phone")}
        />

        <div className="space-y-2">
          <Label htmlFor="contact-candidate-role" className={publicFormLabelClass}>
            Current / Desired Role
          </Label>
          <Input
            id="contact-candidate-role"
            value={values.role}
            onChange={(event) => updateField("role", sanitizeRoleTextInput(event.target.value))}
            placeholder="Full-Stack Engineer"
            maxLength={120}
            className={publicFormInputClass}
            aria-invalid={Boolean(errors.role)}
            onBlur={() => handleFieldBlur("role")}
          />
          <PublicFieldMessages error={errors.role} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-candidate-experience" className={publicFormLabelClass}>
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
              id="contact-candidate-experience"
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
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-candidate-linkedin" className={publicFormLabelClass}>
            LinkedIn URL
          </Label>
          <Input
            id="contact-candidate-linkedin"
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
            helperText="Add LinkedIn if you want your recent work and stack to be reviewed faster."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-candidate-resume" className={publicFormLabelClass}>
            Resume Upload
          </Label>
          <input
            key={fileInputKey}
            id="contact-candidate-resume"
            type="file"
            accept={publicResumeAccept}
            onChange={handleResumeChange}
            className={publicFormFileInputClass}
            aria-invalid={Boolean(errors.resume)}
          />
          <PublicFieldMessages
            error={errors.resume}
            helperText="Provide a LinkedIn URL or upload a resume. Either option is accepted."
            note={
              resumeFile
                ? `Selected file: ${resumeFile.name}`
                : "Accepted formats: PDF, DOC, or DOCX up to 5 MB."
            }
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
          {getSubmitButtonLabel(submissionStage)}
        </Button>
      </div>
    </form>
  );
}
