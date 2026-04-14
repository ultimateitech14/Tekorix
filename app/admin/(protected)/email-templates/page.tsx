"use client";

import { useEffect, useMemo, useState } from "react";
import { MailCheck, PencilLine, Plus, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  channel: "Email";
  isActive: boolean;
  updatedAt: string;
};

type JobApplicationRecipient = {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return dateFormatter.format(parsed);
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [recipients, setRecipients] = useState<JobApplicationRecipient[]>([]);
  const [activeTab, setActiveTab] = useState<"library" | "preview">("library");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [templateIsActive, setTemplateIsActive] = useState(true);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [sendingTemplateId, setSendingTemplateId] = useState<string | null>(null);
  const [selectedRecipientId, setSelectedRecipientId] = useState("manual");
  const [toEmail, setToEmail] = useState("");
  const [fromEmail, setFromEmail] = useState("noreply@startupwork.dev");
  const [sendSubject, setSendSubject] = useState("");
  const [sendBody, setSendBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const selectedTemplate = useMemo(() => {
    if (!templates.length) {
      return null;
    }

    if (!selectedTemplateId) {
      return templates[0];
    }

    return templates.find((item) => item.id === selectedTemplateId) ?? templates[0];
  }, [selectedTemplateId, templates]);

  useEffect(() => {
    let active = true;

    async function loadTemplates() {
      try {
        const response = await fetch("/api/admin/email-templates", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Unable to load templates.");
        }

        const payload = (await response.json()) as { items?: EmailTemplate[] };
        const items = payload.items ?? [];

        if (active) {
          setTemplates(items);
          setSelectedTemplateId((current) => {
            if (current && items.some((item) => item.id === current)) {
              return current;
            }

            return items[0]?.id ?? null;
          });
        }
      } catch {
        if (active) {
          setTemplates([]);
          setSelectedTemplateId(null);
          toast.error("Unable to load email templates.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    async function loadRecipients() {
      try {
        const response = await fetch("/api/admin/job-applications", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Unable to load recipients.");
        }

        const payload = (await response.json()) as { items?: JobApplicationRecipient[] };
        const items = payload.items ?? [];
        const seenEmails = new Set<string>();

        const unique = items.filter((item) => {
          const key = item.email.trim().toLowerCase();

          if (!key || seenEmails.has(key)) {
            return false;
          }

          seenEmails.add(key);
          return true;
        });

        if (active) {
          setRecipients(unique);
        }
      } catch {
        if (active) {
          setRecipients([]);
        }
      }
    }

    void Promise.all([loadTemplates(), loadRecipients()]);

    return () => {
      active = false;
    };
  }, []);

  function openNewTemplateDialog() {
    setEditingTemplateId(null);
    setTemplateName("");
    setTemplateSubject("");
    setTemplateBody("");
    setTemplateIsActive(true);
    setIsEditorOpen(true);
  }

  function openEditTemplateDialog(template: EmailTemplate) {
    setEditingTemplateId(template.id);
    setTemplateName(template.name);
    setTemplateSubject(template.subject);
    setTemplateBody(template.body);
    setTemplateIsActive(template.isActive);
    setIsEditorOpen(true);
  }

  async function saveTemplate() {
    const name = templateName.trim();
    const subject = templateSubject.trim();
    const body = templateBody.trim();

    if (!name) {
      toast.error("Template name is required.");
      return;
    }

    if (!subject) {
      toast.error("Email subject is required.");
      return;
    }

    if (!body) {
      toast.error("Email body is required.");
      return;
    }

    setIsSavingTemplate(true);

    try {
      const isEditing = Boolean(editingTemplateId);

      const response = await fetch("/api/admin/email-templates", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingTemplateId ? { id: editingTemplateId } : {}),
          name,
          subject,
          body,
          isActive: templateIsActive,
        }),
      });

      const payload = (await response.json()) as { success?: boolean; message?: string; item?: EmailTemplate };

      if (!response.ok || !payload.success || !payload.item) {
        toast.error(payload.message ?? "Unable to save template.");
        return;
      }

      setTemplates((current) => {
        const existing = current.findIndex((item) => item.id === payload.item?.id);

        if (existing < 0) {
          return [payload.item!, ...current];
        }

        const next = [...current];
        next[existing] = payload.item!;
        return next.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
      });
      setSelectedTemplateId(payload.item.id);
      setIsEditorOpen(false);
      toast.success(isEditing ? "Template updated." : "Template created.");
    } catch {
      toast.error("Unable to save template right now.");
    } finally {
      setIsSavingTemplate(false);
    }
  }

  async function deleteTemplate(id: string) {
    if (!window.confirm("Delete this template?")) {
      return;
    }

    setDeletingTemplateId(id);

    try {
      const response = await fetch("/api/admin/email-templates", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Unable to delete template.");
      }

      setTemplates((current) => {
        const next = current.filter((item) => item.id !== id);
        setSelectedTemplateId((selectedCurrent) => {
          if (selectedCurrent !== id) {
            return selectedCurrent;
          }

          return next[0]?.id ?? null;
        });
        return next;
      });
      toast.success("Template deleted.");
    } catch {
      toast.error("Unable to delete template.");
    } finally {
      setDeletingTemplateId(null);
    }
  }

  async function deleteAllTemplates() {
    if (!templates.length) {
      return;
    }

    if (!window.confirm("Delete all templates? This action cannot be undone.")) {
      return;
    }

    setIsDeletingAll(true);

    try {
      const response = await fetch("/api/admin/email-templates", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteAll: true }),
      });

      if (!response.ok) {
        throw new Error("Unable to clear templates.");
      }

      setTemplates([]);
      setSelectedTemplateId(null);
      toast.success("All templates deleted.");
    } catch {
      toast.error("Unable to clear templates.");
    } finally {
      setIsDeletingAll(false);
    }
  }

  async function toggleTemplateActive(template: EmailTemplate) {
    try {
      const response = await fetch("/api/admin/email-templates", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: template.id,
          isActive: !template.isActive,
        }),
      });

      const payload = (await response.json()) as { success?: boolean; message?: string; item?: EmailTemplate };

      if (!response.ok || !payload.success || !payload.item) {
        toast.error(payload.message ?? "Unable to update template status.");
        return;
      }

      setTemplates((current) => current.map((item) => (item.id === payload.item?.id ? payload.item! : item)));
      toast.success(payload.item.isActive ? "Template activated." : "Template deactivated.");
    } catch {
      toast.error("Unable to update template status.");
    }
  }

  function openSendDialog(template: EmailTemplate) {
    setSendingTemplateId(template.id);
    setSelectedRecipientId("manual");
    setToEmail("");
    setSendSubject(template.subject);
    setSendBody(template.body);
    setIsSendDialogOpen(true);
  }

  function handleRecipientChange(value: string) {
    setSelectedRecipientId(value);

    if (value === "manual") {
      setToEmail("");
      return;
    }

    const recipient = recipients.find((item) => item.id === value);
    setToEmail(recipient?.email ?? "");
  }

  async function sendTemplateEmail() {
    const templateId = sendingTemplateId ?? "";
    const recipient = toEmail.trim();
    const sender = fromEmail.trim();
    const subject = sendSubject.trim();
    const body = sendBody.trim();

    if (!templateId) {
      toast.error("Select a template first.");
      return;
    }

    if (!recipient || !recipient.includes("@")) {
      toast.error("Please select a valid recipient email.");
      return;
    }

    if (!sender || !sender.includes("@")) {
      toast.error("Please enter a valid from email.");
      return;
    }

    if (!subject || !body) {
      toast.error("Subject and email body are required.");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/admin/email-templates/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId,
          toEmail: recipient,
          fromEmail: sender,
          subject,
          body,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        emailSent?: boolean;
        emailError?: string | null;
      };

      if (!response.ok || !payload.emailSent) {
        toast.error(payload.message ?? payload.emailError ?? "Unable to send email.");
        return;
      }

      toast.success("Email sent successfully.");
      setIsSendDialogOpen(false);
    } catch {
      toast.error("Unable to send email right now.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl text-slate-900">Email Templates</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              Create, edit, activate, and send template emails directly from this page.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={deleteAllTemplates}
              disabled={!templates.length || isDeletingAll}
            >
              <Trash2 className="h-4 w-4" />
              {isDeletingAll ? "Deleting..." : "Delete All"}
            </Button>
            <Button type="button" onClick={openNewTemplateDialog}>
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "library" | "preview")}>
        <TabsList className="bg-white/10">
          <TabsTrigger value="library">Template Library</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="grid gap-3 md:grid-cols-2">
          {isLoading ? <p className="text-sm text-slate-500">Loading templates...</p> : null}

          {!isLoading && !templates.length ? (
              <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl md:col-span-2">
                <CardContent className="p-4 text-sm text-slate-500">
                  No templates found. Click New Template to add one.
                </CardContent>
              </Card>
            ) : null}

          {templates.map((template) => (
            <Card key={template.id} className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                    <p className="text-xs text-slate-500">{template.id}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="rounded-full border border-amber-300/40 bg-amber-300/15 px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
                      {template.channel}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
                        template.isActive
                          ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-700"
                          : "border-slate-300/35 bg-slate-300/10 text-slate-600",
                      )}
                    >
                      {template.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{template.subject}</p>
                <p className="text-xs text-slate-500">Updated {formatDate(template.updatedAt)}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openSendDialog(template)}
                    disabled={!template.isActive}
                  >
                    <MailCheck className="h-4 w-4" />
                    Use
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => openEditTemplateDialog(template)}>
                    <PencilLine className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => toggleTemplateActive(template)}>
                    <Power className="h-4 w-4" />
                    {template.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTemplate(template.id)}
                    disabled={deletingTemplateId === template.id}
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingTemplateId === template.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="preview" className="space-y-3">
          {!templates.length ? (
            <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
              <CardContent className="p-4 text-sm text-slate-500">No template available for preview.</CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
                <CardContent className="p-4">
                  <Label className="text-xs uppercase tracking-[0.14em] text-slate-500">Choose template</Label>
                  <select
                    value={selectedTemplate?.id ?? ""}
                    onChange={(event) => setSelectedTemplateId(event.target.value)}
                    className="mt-2 w-full rounded-md border border-[#D4E8FC] bg-[#F8FBFF] px-3 py-2 text-sm text-slate-900"
                  >
                    {templates.map((template) => (
                      <option key={template.id} value={template.id} className="bg-slate-900">
                        {template.name}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>

              {selectedTemplate ? (
                <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900">{selectedTemplate.name} Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600">
                    <div className="rounded-md border border-[#D4E8FC] bg-[#F8FBFF] p-3">
                      <p className="text-xs text-slate-500">Subject</p>
                      <p className="mt-1 text-slate-900">{selectedTemplate.subject}</p>
                    </div>
                    <div className="rounded-md border border-[#D4E8FC] bg-[#F8FBFF]/80 p-3">
                      <p className="text-xs text-slate-500">Body</p>
                      <p className="mt-1 whitespace-pre-wrap text-slate-900">{selectedTemplate.body}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-3xl border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{editingTemplateId ? "Edit Email Template" : "New Email Template"}</DialogTitle>
            <DialogDescription className="text-slate-500">
              Configure subject and body format. You can use placeholders like {`{{candidate_name}}`} and{" "}
              {`{{job_title}}`}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Template Name</Label>
                <Input
                  value={templateName}
                  onChange={(event) => setTemplateName(event.target.value)}
                  className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Status</Label>
                <select
                  value={templateIsActive ? "active" : "inactive"}
                  onChange={(event) => setTemplateIsActive(event.target.value === "active")}
                  className="h-10 w-full rounded-md border border-[#D4E8FC] bg-[#F8FBFF] px-3 text-sm text-slate-900"
                >
                  <option value="active" className="bg-slate-900">
                    Active
                  </option>
                  <option value="inactive" className="bg-slate-900">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Email Subject</Label>
              <Input
                value={templateSubject}
                onChange={(event) => setTemplateSubject(event.target.value)}
                className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Email Body</Label>
              <Textarea
                value={templateBody}
                onChange={(event) => setTemplateBody(event.target.value)}
                className="min-h-52 border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditorOpen(false)} disabled={isSavingTemplate}>
                Cancel
              </Button>
              <Button type="button" onClick={saveTemplate} disabled={isSavingTemplate}>
                {isSavingTemplate ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="max-w-3xl border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Send Email From Template</DialogTitle>
            <DialogDescription className="text-slate-500">
              Choose candidate email or enter manually, then send directly from here.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Choose Candidate</Label>
                <select
                  value={selectedRecipientId}
                  onChange={(event) => handleRecipientChange(event.target.value)}
                  className="h-10 w-full rounded-md border border-[#D4E8FC] bg-[#F8FBFF] px-3 text-sm text-slate-900"
                >
                  <option value="manual" className="bg-slate-900">
                    Manual Email Entry
                  </option>
                  {recipients.map((item) => (
                    <option key={item.id} value={item.id} className="bg-slate-900">
                      {item.fullName} ({item.jobTitle}) - {item.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">To Email</Label>
                <Input
                  value={toEmail}
                  onChange={(event) => setToEmail(event.target.value)}
                  placeholder="candidate@domain.com"
                  className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500">From Email</Label>
              <Input
                value={fromEmail}
                onChange={(event) => setFromEmail(event.target.value)}
                className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Subject</Label>
              <Input
                value={sendSubject}
                onChange={(event) => setSendSubject(event.target.value)}
                className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Email Body</Label>
              <Textarea
                value={sendBody}
                onChange={(event) => setSendBody(event.target.value)}
                className="min-h-52 border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsSendDialogOpen(false)} disabled={isSending}>
                Cancel
              </Button>
              <Button type="button" onClick={sendTemplateEmail} disabled={isSending}>
                {isSending ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


