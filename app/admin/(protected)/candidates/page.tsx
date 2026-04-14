"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, Mail, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { StatusChip } from "@/components/admin/status-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { JobApplicationStatus } from "@/lib/validators/job-applications";

type Candidate = {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  experience: string;
  status: string;
};

type AdminApplication = {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  location: string;
  experience: string;
  status: JobApplicationStatus;
};

type ResumeBankItem = {
  applicationId: string;
  fullName: string;
  jobTitle: string;
  updatedAt: string;
};

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  isActive: boolean;
};

type CandidateTab = "directory" | "resumes";
const DEFAULT_FROM_EMAIL = "noreply@startupwork.dev";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function parseTab(value: string | null): CandidateTab {
  return value === "resumes" ? "resumes" : "directory";
}

function mapCandidateStatus(status: JobApplicationStatus) {
  if (status === "rejected") {
    return "Paused";
  }

  return "Active";
}

function formatExperience(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return "N/A";
  }

  if (/[a-zA-Z]/.test(normalized)) {
    return normalized;
  }

  return `${normalized} years`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return dateFormatter.format(date);
}

function fillTemplateVariables(value: string, candidate: Candidate | null) {
  if (!candidate) {
    return value;
  }

  return value
    .replace(/\{\{\s*candidate_name\s*\}\}/gi, candidate.name)
    .replace(/\{\{\s*job_title\s*\}\}/gi, candidate.role)
    .replace(/\{\{\s*recruiter_name\s*\}\}/gi, "TekOrix Admin");
}

function CandidatesPageContent() {
  const router = useRouter();
  const pathname = usePathname() ?? "/admin/candidates";
  const searchParams = useSearchParams();
  const tab = parseTab(searchParams?.get("tab") ?? null);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [status, setStatus] = useState("all");
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [resumeBank, setResumeBank] = useState<ResumeBankItem[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);
  const [isLoadingResumeBank, setIsLoadingResumeBank] = useState(true);
  const [isClearingCandidates, setIsClearingCandidates] = useState(false);
  const [deletingCandidateId, setDeletingCandidateId] = useState<string | null>(null);
  const [selectedResumeIds, setSelectedResumeIds] = useState<string[]>([]);
  const [deletingResumeId, setDeletingResumeId] = useState<string | null>(null);
  const [isDeletingSelectedResumes, setIsDeletingSelectedResumes] = useState(false);
  const [isClearingResumeBank, setIsClearingResumeBank] = useState(false);

  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageCandidate, setMessageCandidate] = useState<Candidate | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [messageFromEmail, setMessageFromEmail] = useState(DEFAULT_FROM_EMAIL);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const loadCandidates = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/job-applications", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Unable to load candidates.");
      }

      const payload = (await response.json()) as { items?: AdminApplication[] };
      setApplications(payload.items ?? []);
    } catch {
      setApplications([]);
    } finally {
      setIsLoadingCandidates(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function poll() {
      if (!active) {
        return;
      }

      await loadCandidates();
    }

    void poll();
    const timer = window.setInterval(() => {
      void poll();
    }, 15000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [loadCandidates]);

  useEffect(() => {
    let active = true;

    async function loadResumeBank() {
      try {
        const response = await fetch("/api/admin/resume-bank", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Unable to load resume bank.");
        }

        const payload = (await response.json()) as { items?: ResumeBankItem[] };

        if (active) {
          setResumeBank(payload.items ?? []);
        }
      } catch {
        if (active) {
          setResumeBank([]);
        }
      } finally {
        if (active) {
          setIsLoadingResumeBank(false);
        }
      }
    }

    void loadResumeBank();
    const timer = window.setInterval(() => {
      void loadResumeBank();
    }, 15000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadTemplates() {
      try {
        const response = await fetch("/api/admin/email-templates", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Unable to load templates.");
        }

        const payload = (await response.json()) as { items?: EmailTemplate[] };

        if (active) {
          setTemplates(payload.items ?? []);
        }
      } catch {
        if (active) {
          setTemplates([]);
        }
      }
    }

    void loadTemplates();

    return () => {
      active = false;
    };
  }, []);

  const candidates = useMemo<Candidate[]>(() => {
    return applications.map((application) => ({
      id: application.id,
      name: application.fullName,
      email: application.email,
      role: application.jobTitle,
      location: application.location,
      experience: formatExperience(application.experience),
      status: mapCandidateStatus(application.status),
    }));
  }, [applications]);

  const locationOptions = useMemo(() => {
    return ["all", ...Array.from(new Set(candidates.map((candidate) => candidate.location)))];
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.role.toLowerCase().includes(search.toLowerCase());
      const matchesLocation = location === "all" || candidate.location === location;
      const matchesStatus = status === "all" || candidate.status.toLowerCase() === status;

      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [candidates, location, search, status]);

  const activeTemplates = useMemo(() => templates.filter((item) => item.isActive), [templates]);

  useEffect(() => {
    const allowed = new Set(resumeBank.map((item) => item.applicationId));
    setSelectedResumeIds((current) => current.filter((item) => allowed.has(item)));
  }, [resumeBank]);

  useEffect(() => {
    if (!isMessageDialogOpen || !messageCandidate) {
      return;
    }

    if (selectedTemplateId && activeTemplates.some((item) => item.id === selectedTemplateId)) {
      return;
    }

    const firstTemplate = activeTemplates[0];

    if (!firstTemplate) {
      setSelectedTemplateId("");
      setMessageSubject("");
      setMessageBody("");
      return;
    }

    setSelectedTemplateId(firstTemplate.id);
    setMessageSubject(fillTemplateVariables(firstTemplate.subject, messageCandidate));
    setMessageBody(fillTemplateVariables(firstTemplate.body, messageCandidate));
  }, [activeTemplates, isMessageDialogOpen, messageCandidate, selectedTemplateId]);

  function handleTabChange(nextValue: string) {
    const nextTab = parseTab(nextValue);
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (nextTab === "resumes") {
      params.set("tab", "resumes");
    } else {
      params.delete("tab");
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  async function handleDeleteCandidate(id: string) {
    if (!window.confirm("Delete this candidate?")) {
      return;
    }

    setDeletingCandidateId(id);

    try {
      const response = await fetch("/api/admin/job-applications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, scope: "candidates" }),
      });

      if (!response.ok) {
        throw new Error("Unable to delete candidate.");
      }

      setApplications((current) => current.filter((item) => item.id !== id));
      setResumeBank((current) => current.filter((item) => item.applicationId !== id));
      toast.success("Candidate deleted.");
    } catch {
      toast.error("Unable to delete candidate.");
    } finally {
      setDeletingCandidateId(null);
    }
  }

  async function handleClearCandidates() {
    if (!applications.length) {
      return;
    }

    if (!window.confirm("Clear all candidates? This action cannot be undone.")) {
      return;
    }

    setIsClearingCandidates(true);

    try {
      const response = await fetch("/api/admin/job-applications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteAll: true, scope: "candidates" }),
      });

      if (!response.ok) {
        throw new Error("Unable to clear candidates.");
      }

      setApplications([]);
      setResumeBank([]);
      toast.success("Candidate directory cleared.");
    } catch {
      toast.error("Unable to clear candidates.");
    } finally {
      setIsClearingCandidates(false);
    }
  }

  function toggleResumeSelection(applicationId: string) {
    setSelectedResumeIds((current) =>
      current.includes(applicationId)
        ? current.filter((item) => item !== applicationId)
        : [...current, applicationId],
    );
  }

  async function handleDeleteResumeEntry(applicationId: string) {
    setDeletingResumeId(applicationId);

    try {
      const response = await fetch("/api/admin/resume-bank", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId }),
      });

      if (!response.ok) {
        throw new Error("Unable to delete resume entry.");
      }

      setResumeBank((current) => current.filter((item) => item.applicationId !== applicationId));
      setSelectedResumeIds((current) => current.filter((item) => item !== applicationId));
      toast.success("Resume entry deleted.");
    } catch {
      toast.error("Unable to delete resume entry.");
    } finally {
      setDeletingResumeId(null);
    }
  }

  async function handleDeleteSelectedResumeEntries() {
    if (!selectedResumeIds.length) {
      return;
    }

    if (!window.confirm(`Delete ${selectedResumeIds.length} selected resume entries?`)) {
      return;
    }

    setIsDeletingSelectedResumes(true);

    try {
      const response = await fetch("/api/admin/resume-bank", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationIds: selectedResumeIds }),
      });

      if (!response.ok) {
        throw new Error("Unable to delete selected resume entries.");
      }

      const blocked = new Set(selectedResumeIds);
      setResumeBank((current) => current.filter((item) => !blocked.has(item.applicationId)));
      setSelectedResumeIds([]);
      toast.success("Selected resume entries deleted.");
    } catch {
      toast.error("Unable to delete selected resume entries.");
    } finally {
      setIsDeletingSelectedResumes(false);
    }
  }

  async function handleClearResumeBank() {
    if (!resumeBank.length) {
      return;
    }

    if (!window.confirm("Clear all resume bank entries?")) {
      return;
    }

    setIsClearingResumeBank(true);

    try {
      const response = await fetch("/api/admin/resume-bank", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteAll: true }),
      });

      if (!response.ok) {
        throw new Error("Unable to clear resume bank.");
      }

      setResumeBank([]);
      setSelectedResumeIds([]);
      toast.success("Resume bank cleared.");
    } catch {
      toast.error("Unable to clear resume bank.");
    } finally {
      setIsClearingResumeBank(false);
    }
  }

  function applyTemplate(templateId: string) {
    setSelectedTemplateId(templateId);
    const template = activeTemplates.find((item) => item.id === templateId);

    if (!template) {
      setMessageSubject("");
      setMessageBody("");
      return;
    }

    setMessageSubject(fillTemplateVariables(template.subject, messageCandidate));
    setMessageBody(fillTemplateVariables(template.body, messageCandidate));
  }

  function openMessageDialog(candidate: Candidate) {
    setMessageCandidate(candidate);
    setIsMessageDialogOpen(true);
    setMessageFromEmail(DEFAULT_FROM_EMAIL);

    const defaultTemplate = activeTemplates[0];

    if (defaultTemplate) {
      setSelectedTemplateId(defaultTemplate.id);
      setMessageSubject(fillTemplateVariables(defaultTemplate.subject, candidate));
      setMessageBody(fillTemplateVariables(defaultTemplate.body, candidate));
    } else {
      setSelectedTemplateId("");
      setMessageSubject("");
      setMessageBody("");
    }
  }

  async function handleSendMessage() {
    if (!messageCandidate) {
      return;
    }

    if (!selectedTemplateId) {
      toast.error("Select an active email template.");
      return;
    }

    const normalizedFromEmail = messageFromEmail.trim() || DEFAULT_FROM_EMAIL;

    if (!normalizedFromEmail.includes("@")) {
      toast.error("Enter a valid from email.");
      return;
    }

    if (!messageSubject.trim() || !messageBody.trim()) {
      toast.error("Subject and body are required.");
      return;
    }

    setIsSendingMessage(true);

    try {
      const response = await fetch("/api/admin/email-templates/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          toEmail: messageCandidate.email,
          fromEmail: normalizedFromEmail,
          subject: messageSubject.trim(),
          body: messageBody.trim(),
        }),
      });

      const payload = (await response.json()) as { emailSent?: boolean; message?: string; emailError?: string | null };

      if (!response.ok || !payload.emailSent) {
        toast.error(payload.message ?? payload.emailError ?? "Unable to send email.");
        return;
      }

      toast.success("Email sent.");
      setIsMessageDialogOpen(false);
    } catch {
      toast.error("Unable to send email right now.");
    } finally {
      setIsSendingMessage(false);
    }
  }

  const columns: DataTableColumn<Candidate>[] = [
    {
      id: "name",
      header: "Candidate",
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-500">{row.id}</p>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (row) => <span className="text-slate-600">{row.role}</span>,
    },
    {
      id: "location",
      header: "Location",
      cell: (row) => <span className="text-slate-600">{row.location}</span>,
    },
    {
      id: "experience",
      header: "Experience",
      cell: (row) => <span className="text-slate-600">{row.experience}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusChip status={row.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/admin/applications/${row.id}`}>View</Link>
          </Button>
          <Button size="sm" variant="outline" onClick={() => openMessageDialog(row)}>
            <Mail className="h-4 w-4" />
            Message
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteCandidate(row.id)}
            disabled={deletingCandidateId === row.id}
          >
            <Trash2 className="h-4 w-4" />
            {deletingCandidateId === row.id ? "Deleting..." : "Delete"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="bg-white/10">
          <TabsTrigger value="directory">Candidate Directory</TabsTrigger>
          <TabsTrigger value="resumes">Resume Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          <FiltersBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search candidates by name or role"
            filters={[
              {
                label: "Location",
                value: location,
                onChange: setLocation,
                options: locationOptions.map((option) => ({
                  label: option === "all" ? "All Locations" : option,
                  value: option,
                })),
              },
              {
                label: "Status",
                value: status,
                onChange: setStatus,
                options: [
                  { label: "All Statuses", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Paused", value: "paused" },
                ],
              },
            ]}
          />

          <DataTable
            title="Candidate Directory"
            description="Talent pool and active pipeline profiles."
            actions={
              <Button
                type="button"
                variant="destructive"
                onClick={handleClearCandidates}
                disabled={!applications.length || isClearingCandidates}
              >
                <Trash2 className="h-4 w-4" />
                {isClearingCandidates ? "Clearing..." : "Clear Candidates"}
              </Button>
            }
            columns={columns}
            data={filteredCandidates}
            getRowId={(row) => row.id}
            emptyMessage={isLoadingCandidates ? "Loading candidates..." : "No candidates found."}
          />
        </TabsContent>

        <TabsContent value="resumes" className="space-y-3">
          {isLoadingResumeBank ? <p className="text-sm text-slate-500">Loading resume bank...</p> : null}

          {!isLoadingResumeBank && !resumeBank.length ? (
            <p className="text-sm text-slate-500">
              No resumes in the bank yet. Download a resume from an application to add it here.
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteSelectedResumeEntries}
              disabled={!selectedResumeIds.length || isDeletingSelectedResumes || isClearingResumeBank}
            >
              <Trash2 className="h-4 w-4" />
              {isDeletingSelectedResumes ? "Deleting..." : `Delete Selected (${selectedResumeIds.length})`}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleClearResumeBank}
              disabled={!resumeBank.length || isClearingResumeBank || isDeletingSelectedResumes}
            >
              <Trash2 className="h-4 w-4" />
              {isClearingResumeBank ? "Clearing..." : "Clean All"}
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {resumeBank.map((resume) => (
              <Card key={resume.applicationId} className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
                <CardContent className="space-y-2 p-4">
                  <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={selectedResumeIds.includes(resume.applicationId)}
                      onChange={() => toggleResumeSelection(resume.applicationId)}
                    />
                    Select
                  </label>
                  <p className="text-sm font-semibold text-slate-900">{resume.fullName}</p>
                  <p className="text-xs text-slate-500">{resume.jobTitle}</p>
                  <p className="text-xs text-slate-500">Updated {formatDate(resume.updatedAt)}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline" className="mt-1">
                      <a href={`/api/admin/job-applications/${resume.applicationId}/resume`}>
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="mt-1"
                      onClick={() => handleDeleteResumeEntry(resume.applicationId)}
                      disabled={deletingResumeId === resume.applicationId || isDeletingSelectedResumes || isClearingResumeBank}
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingResumeId === resume.applicationId ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isMessageDialogOpen}
        onOpenChange={(open) => {
          setIsMessageDialogOpen(open);
          if (!open) {
            setMessageCandidate(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Send Message</DialogTitle>
            <DialogDescription className="text-slate-500">
              Send email to {messageCandidate?.name ?? "candidate"} using an active email template.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">To Email</Label>
                <Input value={messageCandidate?.email ?? ""} readOnly className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Template</Label>
                <select
                  value={selectedTemplateId}
                  onChange={(event) => applyTemplate(event.target.value)}
                  className="h-10 w-full rounded-md border border-[#D4E8FC] bg-[#F8FBFF] px-3 text-sm text-slate-900"
                >
                  <option value="" className="bg-slate-900">
                    Select Active Template
                  </option>
                  {activeTemplates.map((template) => (
                    <option key={template.id} value={template.id} className="bg-slate-900">
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500">From Email</Label>
              <Input
                value={messageFromEmail}
                onChange={(event) => setMessageFromEmail(event.target.value)}
                className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Subject</Label>
              <Input
                value={messageSubject}
                onChange={(event) => setMessageSubject(event.target.value)}
                className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Body</Label>
              <Textarea
                value={messageBody}
                onChange={(event) => setMessageBody(event.target.value)}
                className="min-h-48 border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsMessageDialogOpen(false)} disabled={isSendingMessage}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSendMessage} disabled={isSendingMessage}>
                <Send className="h-4 w-4" />
                {isSendingMessage ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading candidates...</p>}>
      <CandidatesPageContent />
    </Suspense>
  );
}

