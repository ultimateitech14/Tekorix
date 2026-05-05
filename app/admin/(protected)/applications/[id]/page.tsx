"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  Download,
  FileSearch2,
  Mail,
  Phone,
  UserCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { StatusChip } from "@/components/admin/status-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  downloadAdminJobApplicationResume,
  getAdminJobApplicationById,
  markAdminJobApplicationRead,
  updateAdminJobApplicationNotes,
  updateAdminJobApplicationStatus,
} from "@/lib/api/admin/job-applications";
import { cn } from "@/lib/utils";
import type { JobApplicationStatus } from "@/lib/validators/job-applications";

type ApplicationDetails = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  coverLetter: string;
  adminNotes: string;
  jobTitle: string;
  jobLocation: string;
  status: JobApplicationStatus;
  createdAt: string;
  reviewedAt: string | null;
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatStatusLabel(status: JobApplicationStatus) {
  if (status === "pending review") {
    return "Pending Review";
  }

  if (status === "shortlisted") {
    return "Shortlisted";
  }

  if (status === "rejected") {
    return "Rejected";
  }

  return "Interview";
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "Pending";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Pending";
  }

  return dateTimeFormatter.format(date);
}

export default function ApplicationDetailsPage() {
  const params = useParams<{ id: string }>();
  const applicationId = params?.id ?? "";

  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [status, setStatus] = useState<JobApplicationStatus>("pending review");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!applicationId) {
      setApplication(null);
      setIsLoading(false);
      return;
    }

    let active = true;

    async function loadApplication() {
      setIsLoading(true);

      try {
        const item = (await getAdminJobApplicationById(applicationId)) as ApplicationDetails;

        if (active) {
          setApplication(item);

          if (item) {
            setStatus(item.status);
            setNotes(
              item.adminNotes ||
                `Candidate location: ${item.location}\nExperience: ${item.experience}\n\nKey Skills:\n${item.coverLetter}`,
            );

            void markAdminJobApplicationRead(applicationId);
          }
        }
      } catch {
        if (active) {
          setApplication(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadApplication();

    return () => {
      active = false;
    };
  }, [applicationId]);

  async function handleStatusUpdate(nextStatus: JobApplicationStatus) {
    if (!application) {
      return;
    }

    setIsUpdatingStatus(true);

    try {
      const result = await updateAdminJobApplicationStatus(application.id, nextStatus);
      setApplication(result.data as ApplicationDetails);
      setStatus(result.data.status);
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleDownloadResume() {
    if (!application) {
      return;
    }

    setIsDownloadingResume(true);

    try {
      await downloadAdminJobApplicationResume(application.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to download resume.");
    } finally {
      setIsDownloadingResume(false);
    }
  }

  async function handleSaveNotes() {
    if (!application) {
      return;
    }

    setIsSavingNotes(true);

    try {
      const result = await updateAdminJobApplicationNotes(application.id, notes.trim());
      setApplication(result.data as ApplicationDetails);
      setNotes(result.data.adminNotes || notes.trim());
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save notes.");
    } finally {
      setIsSavingNotes(false);
    }
  }

  const timeline = useMemo(() => {
    if (!application) {
      return [];
    }

    const decisionComplete = status !== "pending review";

    return [
      {
        label: "Submitted",
        date: formatDateTime(application.createdAt),
        icon: FileSearch2,
        complete: true,
      },
      {
        label: "Reviewed",
        date: formatDateTime(application.reviewedAt),
        icon: Clock3,
        complete: decisionComplete,
      },
      {
        label: "Decision",
        date: decisionComplete ? "Updated just now" : "Pending",
        icon: status === "rejected" ? XCircle : CheckCircle2,
        complete: decisionComplete,
      },
    ];
  }, [application, status]);

  if (isLoading) {
    return (
      <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
        <CardContent className="p-6 text-sm text-slate-600">Loading application details...</CardContent>
      </Card>
    );
  }

  if (!application) {
    return (
      <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
        <CardContent className="p-6 text-sm text-slate-600">Application not found.</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="space-y-4 xl:col-span-2">
        <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-900">Candidate Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/20 text-amber-700">
                  <UserCircle2 className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{application.fullName}</p>
                  <p className="text-sm text-slate-500">
                    Applied for {application.jobTitle} ({application.jobLocation})
                  </p>
                </div>
              </div>
              <StatusChip status={formatStatusLabel(status)} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] p-3">
                <p className="mb-1 text-xs uppercase tracking-[0.14em] text-slate-500">Email</p>
                <p className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <Mail className="h-4 w-4 text-amber-700" />
                  {application.email}
                </p>
              </div>
              <div className="rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] p-3">
                <p className="mb-1 text-xs uppercase tracking-[0.14em] text-slate-500">Phone</p>
                <p className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <Phone className="h-4 w-4 text-amber-700" />
                  {application.phone}
                </p>
              </div>
            </div>

            <Button type="button" onClick={() => void handleDownloadResume()} disabled={isDownloadingResume}>
              <Download className="h-4 w-4" />
              {isDownloadingResume ? "Downloading..." : "Download Resume"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Internal Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add recruiter notes..."
              className="min-h-40 border-[#D4E8FC] bg-[#F8FBFF] text-slate-900 placeholder:text-slate-500"
            />
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => void handleSaveNotes()} disabled={isSavingNotes}>
                {isSavingNotes ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Application Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {timeline.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === timeline.length - 1;

                return (
                  <li key={step.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "inline-flex h-8 w-8 items-center justify-center rounded-full border",
                          step.complete
                            ? "border-amber-300/45 bg-amber-300/15 text-amber-700"
                            : "border-[#C3DDF9] bg-[#F8FBFF] text-slate-600",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      {!isLast ? <span className="mt-2 h-8 w-px bg-white/15" /> : null}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{step.label}</p>
                      <p className="text-xs text-slate-500">{step.date}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-center"
              disabled={isUpdatingStatus || status === "shortlisted"}
              onClick={() => handleStatusUpdate("shortlisted")}
            >
              Shortlist
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center text-rose-700 hover:text-rose-800"
              disabled={isUpdatingStatus || status === "rejected"}
              onClick={() => handleStatusUpdate("rejected")}
            >
              Reject
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center"
              disabled={isUpdatingStatus || status === "pending review"}
              onClick={() => handleStatusUpdate("pending review")}
            >
              Mark Pending
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



