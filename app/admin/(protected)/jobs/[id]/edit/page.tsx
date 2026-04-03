import { JobEditorForm } from "@/components/admin/job-editor-form";

type AdminEditJobPageProps = {
  params: {
    id: string;
  };
};

export default function AdminEditJobPage({ params }: AdminEditJobPageProps) {
  return <JobEditorForm mode="edit" jobId={params.id} />;
}
