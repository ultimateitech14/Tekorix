"use client";

import { JobEditorForm } from "@/components/admin/job-editor-form";

type JobFormProps = {
  mode: "create" | "edit";
  jobId?: string;
};

export function JobForm({ mode, jobId }: JobFormProps) {
  return <JobEditorForm mode={mode} jobId={jobId} />;
}
