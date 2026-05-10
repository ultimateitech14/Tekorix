import { ApiError, requestApi } from "@/lib/api/http";
import type { CandidateLeadValues } from "@/lib/validators/candidate-lead";

export type CandidateLeadSourcePage = "contact" | "find-job";
export type CandidateLeadSubmissionType =
  | "contact-candidate"
  | "resume-submission"
  | "market-resume";
export type CandidateLeadResumeContentType =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type RequestCandidateLeadUploadUrlPayload = {
  fileName: string;
  contentType: string;
  fileSize: number;
  submissionType: CandidateLeadSubmissionType;
};

export type CandidateLeadUploadUrlResponse = {
  uploadUrl: string;
  objectKey: string;
  contentType: CandidateLeadResumeContentType;
};

export type UploadCandidateResumeToR2Payload = {
  uploadUrl: string;
  file: File;
  contentType: CandidateLeadResumeContentType;
};

export type SubmitCandidateLeadPayload = CandidateLeadValues & {
  sourcePage: CandidateLeadSourcePage;
  resume_object_key?: string;
  resume_file_name?: string;
  resume_content_type?: CandidateLeadResumeContentType;
};

const resumeContentTypeByExtension: Record<string, CandidateLeadResumeContentType> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function getFileExtension(fileName: string) {
  const normalized = fileName.trim().toLowerCase();
  const extensionIndex = normalized.lastIndexOf(".");

  return extensionIndex > 0 ? normalized.slice(extensionIndex) : "";
}

function resolveCandidateResumeContentType(fileName: string, contentType: string) {
  const normalizedContentType = contentType.trim().toLowerCase();
  const extension = getFileExtension(fileName);
  const fallbackContentType = resumeContentTypeByExtension[extension];

  if (normalizedContentType === "application/x-msword") {
    return "application/msword" satisfies CandidateLeadResumeContentType;
  }

  if (
    normalizedContentType === "application/pdf" ||
    normalizedContentType === "application/msword" ||
    normalizedContentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return normalizedContentType;
  }

  if (fallbackContentType) {
    return fallbackContentType;
  }

  throw new ApiError(400, "Resume file type is not supported. Please upload a PDF, DOC, or DOCX file.");
}

export async function requestCandidateLeadUploadUrl(payload: RequestCandidateLeadUploadUrlPayload) {
  const normalizedContentType = resolveCandidateResumeContentType(payload.fileName, payload.contentType);
  const response = await requestApi<
    {
      uploadUrl: string;
      objectKey: string;
    },
    {
      fileName: string;
      contentType: CandidateLeadResumeContentType;
      fileSize: number;
      submissionType: CandidateLeadSubmissionType;
    }
  >("/api/v1/candidate-leads/upload-url", {
    method: "POST",
    body: {
      fileName: payload.fileName,
      contentType: normalizedContentType,
      fileSize: payload.fileSize,
      submissionType: payload.submissionType,
    },
  });

  return {
    message: response.message,
    data: {
      ...response.data,
      contentType: normalizedContentType,
    } satisfies CandidateLeadUploadUrlResponse,
  };
}

export async function uploadCandidateResumeToR2(payload: UploadCandidateResumeToR2Payload) {
  const response = await fetch(payload.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": payload.contentType,
    },
    body: payload.file,
  });

  if (!response.ok) {
    let message = "Resume upload failed. Please try again.";

    try {
      const errorPayload = (await response.json()) as { message?: unknown };

      if (typeof errorPayload.message === "string" && errorPayload.message.trim()) {
        message = errorPayload.message;
      }
    } catch {
      // Ignore non-JSON uploads such as direct R2 responses.
    }

    throw new Error(message);
  }
}

export async function submitCandidateLead(payload: SubmitCandidateLeadPayload) {
  return requestApi<unknown, SubmitCandidateLeadPayload>("/api/v1/candidate-leads", {
    method: "POST",
    body: payload,
  });
}
