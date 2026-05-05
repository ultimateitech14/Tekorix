"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, Eye, Link2, LoaderCircle, Paperclip, Users2 } from "lucide-react";
import { toast } from "sonner";

import { StatCard } from "@/components/admin/StatCard";
import { StatusChip } from "@/components/admin/status-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getAdminCandidateLeadById,
  getAdminCandidateLeads,
  getAdminCandidateLeadResume,
  markAdminCandidateLeadRead,
  type AdminCandidateLead,
} from "@/lib/api/admin/candidate-leads";
import { ApiError } from "@/lib/api/http";
import { clearAuthToken } from "@/lib/auth/store";
import { candidateLeadSubmissionTypeLabels } from "@/lib/validators/candidate-lead";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

type LeadDetailState = {
  open: boolean;
  leadId: string | null;
  lead: AdminCandidateLead | null;
  isLoading: boolean;
  isMarkingRead: boolean;
  error: string | null;
};

const emptyDetailState: LeadDetailState = {
  open: false,
  leadId: null,
  lead: null,
  isLoading: false,
  isMarkingRead: false,
  error: null,
};

function formatDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Recently" : dateFormatter.format(parsed);
}

function formatSourcePage(value: AdminCandidateLead["sourcePage"]) {
  if (value === "find-job") {
    return "Find Job";
  }

  if (value === "contact") {
    return "Contact";
  }

  return "Unknown";
}

function formatStatus(value: string) {
  if (!value) {
    return "Unknown";
  }

  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function getSubmissionBadgeClass(submissionType: AdminCandidateLead["submissionType"]) {
  if (submissionType === "market-resume") {
    return "border-fuchsia-300/35 bg-fuchsia-300/12 text-fuchsia-700";
  }

  if (submissionType === "resume-submission") {
    return "border-cyan-300/35 bg-cyan-300/12 text-cyan-700";
  }

  return "border-violet-300/35 bg-violet-300/12 text-violet-700";
}

function getSourceBadgeClass(sourcePage: AdminCandidateLead["sourcePage"]) {
  if (sourcePage === "find-job") {
    return "border-cyan-300/35 bg-cyan-300/12 text-cyan-700";
  }

  if (sourcePage === "contact") {
    return "border-violet-300/35 bg-violet-300/12 text-violet-700";
  }

  return "border-slate-300/30 bg-slate-300/10 text-slate-700";
}

function getReadBadgeClass(isRead: boolean) {
  return isRead
    ? "border-emerald-300/35 bg-emerald-300/12 text-emerald-700"
    : "border-amber-300/40 bg-amber-300/15 text-amber-700";
}

function isPdfResume(contentType: string) {
  return contentType === "application/pdf";
}

function getResumeActionLabel(contentType: string) {
  return isPdfResume(contentType) ? "Open Resume" : "Download Resume";
}

export function AdminCandidateLeadsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminCandidateLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [detailState, setDetailState] = useState<LeadDetailState>(emptyDetailState);
  const [resumeActionLeadId, setResumeActionLeadId] = useState<string | null>(null);

  const newestLead = items[0] ?? null;
  const resumeCount = useMemo(() => items.filter((item) => Boolean(item.resume)).length, [items]);
  const linkedInCount = useMemo(() => items.filter((item) => Boolean(item.linkedInUrl)).length, [items]);

  const handleApiError = useCallback(
    (error: unknown, fallbackMessage: string) => {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        toast.error("Admin session expired. Please sign in again.");
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : fallbackMessage);
    },
    [router],
  );

  const loadCandidateLeads = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const leads = await getAdminCandidateLeads();
      setItems(leads);
    } catch (error) {
      setItems([]);
      setLoadError(error instanceof Error ? error.message : "Unable to load candidate leads.");
      handleApiError(error, "Unable to load candidate leads.");
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    void loadCandidateLeads();
  }, [loadCandidateLeads]);

  async function openLeadDetail(leadId: string) {
    const preview = items.find((item) => item.id === leadId) ?? null;

    setDetailState({
      open: true,
      leadId,
      lead: preview,
      isLoading: true,
      isMarkingRead: false,
      error: null,
    });

    try {
      const lead = await getAdminCandidateLeadById(leadId);

      setDetailState((current) => {
        if (current.leadId !== leadId) {
          return current;
        }

        return {
          ...current,
          lead,
          isLoading: false,
          error: null,
        };
      });
    } catch (error) {
      setDetailState((current) => {
        if (current.leadId !== leadId) {
          return current;
        }

        return {
          ...current,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unable to load candidate lead details.",
        };
      });

      handleApiError(error, "Unable to load candidate lead details.");
    }
  }

  function handleDetailOpenChange(open: boolean) {
    setDetailState((current) => (open ? current : emptyDetailState));
  }

  async function handleMarkAsRead() {
    if (!detailState.leadId || detailState.lead?.isRead) {
      return;
    }

    setDetailState((current) => ({
      ...current,
      isMarkingRead: true,
    }));

    try {
      const updatedLead = await markAdminCandidateLeadRead(detailState.leadId);

      setItems((current) =>
        current.map((item) => (item.id === updatedLead.id ? { ...item, ...updatedLead } : item)),
      );

      setDetailState((current) => {
        if (current.leadId !== updatedLead.id) {
          return current;
        }

        return {
          ...current,
          lead: updatedLead,
          isMarkingRead: false,
          error: null,
        };
      });

      toast.success("Candidate lead marked as read.");
    } catch (error) {
      setDetailState((current) => ({
        ...current,
        isMarkingRead: false,
      }));

      handleApiError(error, "Unable to update read state.");
    }
  }

  async function handleResumeAction(lead: AdminCandidateLead) {
    if (!lead.resume) {
      return;
    }

    const shouldPreviewInline = isPdfResume(lead.resume.contentType);
    const previewWindow = shouldPreviewInline ? window.open("about:blank", "_blank") : null;
    setResumeActionLeadId(lead.id);

    try {
      const resumeFile = await getAdminCandidateLeadResume(lead.id);
      const objectUrl = URL.createObjectURL(resumeFile.blob);
      const canPreviewInline = shouldPreviewInline || isPdfResume(resumeFile.contentType);

      if (canPreviewInline) {
        if (previewWindow) {
          previewWindow.location.assign(objectUrl);
        } else {
          const link = document.createElement("a");
          link.href = objectUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      } else {
        previewWindow?.close();

        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = lead.resume.fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch (error) {
      previewWindow?.close();
      handleApiError(error, "Unable to access the candidate resume.");
    } finally {
      setResumeActionLeadId(null);
    }
  }

  const detailLead = detailState.lead;

  return (
    <>
      <div className="space-y-5 md:space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Candidate Leads"
            value={isLoading ? "..." : String(items.length)}
            detail="Newest first, Express-backed."
            icon={Users2}
          />
          <StatCard
            label="Resume Uploads"
            value={isLoading ? "..." : String(resumeCount)}
            detail={isLoading ? "..." : `${linkedInCount} leads also included a LinkedIn profile.`}
            icon={Paperclip}
          />
          <StatCard
            label="Latest Submission"
            value={
              newestLead
                ? formatDate(newestLead.createdAt).split(",")[0] || "Today"
                : isLoading
                  ? "..."
                  : "None"
            }
            detail={newestLead ? newestLead.fullName : "No candidate leads captured yet."}
            icon={Clock3}
          />
        </section>

        <Card className="border-[#D4E8FC] bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Candidate Leads</CardTitle>
            <p className="text-sm leading-relaxed text-slate-500">
              Candidate submissions from contact, submit-resume, and market-my-resume flows.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadError ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-700">
                <span>{loadError}</span>
                <Button size="sm" variant="outline" onClick={() => void loadCandidateLeads()}>
                  Retry
                </Button>
              </div>
            ) : null}

            <div className="overflow-hidden rounded-lg border border-[#D4E8FC]">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#D4E8FC] bg-[#F4F9FF] hover:bg-[#F4F9FF]">
                    <TableHead className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                      Candidate
                    </TableHead>
                    <TableHead className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                      Submission
                    </TableHead>
                    <TableHead className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                      Role / Targets
                    </TableHead>
                    <TableHead className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                      Profile
                    </TableHead>
                    <TableHead className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                      Created
                    </TableHead>
                    <TableHead className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow className="border-[#D4E8FC]">
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                        Loading candidate leads...
                      </TableCell>
                    </TableRow>
                  ) : items.length ? (
                    items.map((item) => (
                      <TableRow key={item.id} className="border-[#D4E8FC] hover:bg-[#F1F7FF]">
                        <TableCell className="py-3 text-sm text-slate-700">
                          <div className="space-y-2">
                            <div>
                              <p className="font-semibold text-slate-900">{item.fullName}</p>
                              <p className="text-xs text-slate-500">{item.email}</p>
                              <p className="text-xs text-slate-500">{item.phone}</p>
                            </div>
                            <Badge variant="outline" className={getReadBadgeClass(item.isRead)}>
                              {item.isRead ? "Read" : "Unread"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-slate-700">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className={getSubmissionBadgeClass(item.submissionType)}>
                                {candidateLeadSubmissionTypeLabels[item.submissionType]}
                              </Badge>
                              <Badge variant="outline" className={getSourceBadgeClass(item.sourcePage)}>
                                {formatSourcePage(item.sourcePage)}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <StatusChip status={formatStatus(item.status)} />
                              <p className="text-xs text-slate-500">
                                {item.experience ? `Experience: ${item.experience}` : "Experience not provided"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-slate-700">
                          <div className="space-y-2">
                            <p className="font-medium text-slate-900">{item.role}</p>
                            {item.desiredLocation ? (
                              <p className="text-xs text-slate-500">Location: {item.desiredLocation}</p>
                            ) : null}
                            {item.desiredSalaryRange ? (
                              <p className="text-xs text-slate-500">Salary: {item.desiredSalaryRange}</p>
                            ) : null}
                            {item.skills ? (
                              <p className="line-clamp-2 text-xs text-slate-500">Skills: {item.skills}</p>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-slate-600">
                          <div className="flex flex-wrap gap-2">
                            {item.linkedInUrl ? (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-8 border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-[#EDF5FF]"
                              >
                                <a href={item.linkedInUrl} target="_blank" rel="noreferrer">
                                  <Link2 className="h-4 w-4" />
                                  LinkedIn
                                </a>
                              </Button>
                            ) : null}
                            {item.resume ? (
                              <>
                                <Badge
                                  variant="outline"
                                  className="max-w-[15rem] gap-1 overflow-hidden border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
                                  title={item.resume.fileName}
                                >
                                  <Paperclip className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{item.resume.fileName}</span>
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-[#EDF5FF]"
                                  onClick={() => void handleResumeAction(item)}
                                  disabled={resumeActionLeadId === item.id}
                                >
                                  <Paperclip className="h-4 w-4" />
                                  {resumeActionLeadId === item.id
                                    ? "Preparing..."
                                    : getResumeActionLabel(item.resume.contentType)}
                                </Button>
                              </>
                            ) : null}
                            {!item.linkedInUrl && !item.resume ? (
                              <span className="text-xs text-slate-500">No profile asset</span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-slate-500">
                          {formatDate(item.createdAt)}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-slate-700">
                          <Button size="sm" variant="outline" onClick={() => void openLeadDetail(item.id)}>
                            {detailState.open && detailState.leadId === item.id && detailState.isLoading ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="border-[#D4E8FC]">
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                        No candidate leads captured yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={detailState.open} onOpenChange={handleDetailOpenChange}>
        <DialogContent className="border-[#D4E8FC] bg-[linear-gradient(145deg,#F9FCFF_0%,#EDF6FF_100%)] text-slate-900 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-slate-900">
              {detailLead ? detailLead.fullName : "Candidate lead details"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {detailLead ? `${detailLead.email} | ${detailLead.role}` : "Inspect profile details and update read state."}
            </DialogDescription>
          </DialogHeader>

          {detailState.isLoading && !detailLead ? (
            <div className="flex items-center gap-2 py-8 text-sm text-slate-600">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading candidate lead details...
            </div>
          ) : detailState.error && !detailLead ? (
            <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-4 py-4 text-sm text-rose-700">
              {detailState.error}
            </div>
          ) : detailLead ? (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Contact
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="text-slate-500">Name:</span> {detailLead.fullName}
                    </p>
                    <p>
                      <span className="text-slate-500">Email:</span> {detailLead.email}
                    </p>
                    <p>
                      <span className="text-slate-500">Phone:</span> {detailLead.phone}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Submission
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="text-slate-500">Type:</span> {candidateLeadSubmissionTypeLabels[detailLead.submissionType]}
                    </p>
                    <p>
                      <span className="text-slate-500">Source:</span> {formatSourcePage(detailLead.sourcePage)}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="outline" className={getReadBadgeClass(detailLead.isRead)}>
                        {detailLead.isRead ? "Read" : "Unread"}
                      </Badge>
                      <StatusChip status={formatStatus(detailLead.status)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Profile
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="text-slate-500">Role:</span> {detailLead.role}
                    </p>
                    <p>
                      <span className="text-slate-500">Experience:</span> {detailLead.experience || "Not provided"}
                    </p>
                    <p>
                      <span className="text-slate-500">LinkedIn:</span>{" "}
                      {detailLead.linkedInUrl ? (
                        <a
                          href={detailLead.linkedInUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-700 underline underline-offset-4"
                        >
                          Open profile
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Resume Metadata
                  </p>
                  {detailLead.resume ? (
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      <p>
                        <span className="text-slate-500">File:</span> {detailLead.resume.fileName}
                      </p>
                      <p>
                        <span className="text-slate-500">Type:</span> {detailLead.resume.contentType}
                      </p>
                      <p className="break-all">
                        <span className="text-slate-500">Object key:</span> {detailLead.resume.objectKey}
                      </p>
                      <div className="pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-[#EDF5FF]"
                          onClick={() => void handleResumeAction(detailLead)}
                          disabled={resumeActionLeadId === detailLead.id}
                        >
                          <Paperclip className="h-4 w-4" />
                          {resumeActionLeadId === detailLead.id
                            ? "Preparing..."
                            : getResumeActionLabel(detailLead.resume.contentType)}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">No resume uploaded for this lead.</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Targeting Details
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <p className="text-sm text-slate-700">
                    <span className="text-slate-500">Desired location:</span> {detailLead.desiredLocation || "Not provided"}
                  </p>
                  <p className="text-sm text-slate-700">
                    <span className="text-slate-500">Desired salary:</span> {detailLead.desiredSalaryRange || "Not provided"}
                  </p>
                </div>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                  <span className="text-slate-500">Skills:</span> {detailLead.skills || "Not provided"}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Created
                  </p>
                  <p className="mt-3 text-sm text-slate-700">{formatDate(detailLead.createdAt)}</p>
                </div>
                <div className="rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Updated
                  </p>
                  <p className="mt-3 text-sm text-slate-700">{formatDate(detailLead.updatedAt)}</p>
                </div>
              </div>

              {detailState.error ? (
                <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-700">
                  {detailState.error}
                </div>
              ) : null}
            </div>
          ) : null}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => handleDetailOpenChange(false)}>
              Close
            </Button>
            {detailLead && !detailLead.isRead ? (
              <Button onClick={() => void handleMarkAsRead()} disabled={detailState.isMarkingRead}>
                {detailState.isMarkingRead ? "Marking..." : "Mark as read"}
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


