import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { createJobApplication, ensureJobApplicationResumesDir } from "@/lib/job-applications-store";
import { jobApplicationSubmissionSchema } from "@/lib/validators/job-applications";
import {
  getPublicResumeValidationError,
  sanitizeUploadedFileName,
} from "@/lib/validators/public-form-fields";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request payload.",
      },
      { status: 400 },
    );
  }

  const parsed = jobApplicationSubmissionSchema.safeParse({
    jobId: getString(formData, "jobId"),
    jobTitle: getString(formData, "jobTitle"),
    jobLocation: getString(formData, "jobLocation"),
    fullName: getString(formData, "fullName"),
    email: getString(formData, "email"),
    phone: getString(formData, "phone"),
    location: getString(formData, "location"),
    experience: getString(formData, "experience"),
    coverLetter: getString(formData, "coverLetter"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid request.",
      },
      { status: 400 },
    );
  }

  const resumeField = formData.get("resume");

  if (!(resumeField instanceof File) || resumeField.size <= 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Resume file is required.",
      },
      { status: 400 },
    );
  }

  const resumeValidationError = getPublicResumeValidationError(resumeField, {
    required: true,
    requiredMessage: "Resume file is required.",
  });

  if (resumeValidationError) {
    return NextResponse.json(
      {
        success: false,
        message: resumeValidationError,
      },
      { status: 400 },
    );
  }

  const originalName = sanitizeUploadedFileName(resumeField.name || "resume");
  const extension = path.extname(originalName).toLowerCase();

  const storedName = `${randomUUID()}${extension}`;
  const absolutePath = path.join(process.cwd(), "data", "job-application-resumes", storedName);

  try {
    await ensureJobApplicationResumesDir();
    const buffer = Buffer.from(await resumeField.arrayBuffer());
    await writeFile(absolutePath, buffer);

    const created = await createJobApplication({
      ...parsed.data,
      resume: {
        originalName,
        storedName,
        contentType: resumeField.type || "application/octet-stream",
        size: resumeField.size,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully.",
        data: {
          id: created.id,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit application right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
