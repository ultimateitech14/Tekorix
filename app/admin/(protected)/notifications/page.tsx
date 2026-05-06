"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  BellRing,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  Mail,
  MessageSquareText,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { StatusChip } from "@/components/admin/status-chip";
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
import {
  deleteAdminContactSubmission,
  deleteAllAdminContactSubmissions,
  getAdminContactSubmissions,
  markAdminContactSubmissionRead,
  markAllAdminContactSubmissionsRead,
  replyToAdminContactSubmission,
} from "@/lib/api/admin/contact-submissions";
import {
  deleteAdminJobApplication,
  deleteAllAdminJobApplications,
  getAdminJobApplications,
  markAdminJobApplicationRead,
  markAllAdminJobApplicationsRead,
} from "@/lib/api/admin/job-applications";
import { clearAdminLogs, getAdminLogs } from "@/lib/api/admin/logs";
import { getAdminEmailTemplates, type AdminEmailTemplate } from "@/lib/api/admin/email-templates";
import { requestApi } from "@/lib/api/http";
import { cn } from "@/lib/utils";

type ContactSubmission = {
  replies?: Array<{
    id: string;
    message: string;
    sentAt: string;
    fromEmail: string;
    toEmail: string;
    deliveryStatus: "saved" | "sent" | "failed";
    deliveryError: string | null;
  }>;
  id: string;
  inquiryType: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  industry: string;
  company: string;
  position: string;
  phonePrefix: string;
  phoneNumber: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

type JobApplicationNotification = {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  status: string;
  createdAt: string;
  isRead: boolean;
};

type NotificationLogRecord = {
  id: string;
  action: string;
  target: string;
  createdAt: string;
};

type SiteSettingsPayload = {
  companyEmail?: string;
  notificationEmailProvider?: string;
  notificationEmailApiKey?: string;
  notificationFromEmail?: string;
  notificationTemplateMappings?: {
    contactSubmissionAcknowledgementTemplateId?: string;
    jobApplicationAcknowledgementTemplateId?: string;
  };
};

const inquiryLabels: Record<string, string> = {
  candidate: "Candidate",
  "former-employee": "Former Employee",
  client: "Client",
};

function formatInquiryType(value: string) {
  return inquiryLabels[value] ?? value;
}

function formatApplicationStatus(value: string) {
  if (value === "pending review") {
    return "Pending Review";
  }

  if (value === "shortlisted") {
    return "Shortlisted";
  }

  if (value === "rejected") {
    return "Rejected";
  }

  if (value === "interview") {
    return "Interview";
  }

  return value;
}

function formatReplyDeliveryStatus(value: "saved" | "sent" | "failed") {
  if (value === "sent") {
    return "Sent";
  }

  if (value === "failed") {
    return "Failed";
  }

  return "Saved";
}

function formatNotificationStatus(item: NotificationLogRecord) {
  const text = `${item.action} ${item.target}`.toLowerCase();

  if (text.includes("failed")) {
    return "Failed";
  }

  if (text.includes("sent")) {
    return "Sent";
  }

  return "Logged";
}

function getProviderHelpText(provider: string) {
  const normalized = provider.trim().toLowerCase();

  if (normalized === "gmail" || normalized === "google") {
    return "Use your Gmail address as the From Address. For the credential, use a Google App Password from your Google account security settings.";
  }

  if (normalized === "outlook" || normalized === "office365" || normalized === "microsoft") {
    return "Use your Outlook or Microsoft 365 mailbox as the From Address. Use the mailbox password or app password in the credential field.";
  }

  if (normalized === "sendgrid") {
    return "Create an API key in your SendGrid dashboard and paste it into the credential field.";
  }

  if (normalized === "resend") {
    return "Create an SMTP/API key in your Resend dashboard and paste it into the credential field.";
  }

  if (normalized === "brevo" || normalized === "sendinblue") {
    return "Use your Brevo SMTP login and password in the credential field, for example login|password.";
  }

  if (normalized.startsWith("smtp://") || normalized.startsWith("smtps://")) {
    return "You can paste a full SMTP URL here, for example smtps://user:pass@smtp.yourdomain.com:465.";
  }

  if (normalized.includes(".")) {
    return "Direct SMTP host detected. Use a host like smtp.yourdomain.com and add username:password in the credential field.";
  }

  return "Supported values: sendgrid, resend, gmail, outlook, office365, brevo, a direct SMTP host, or a full smtp:// URL.";
}

function getCredentialHelpText(provider: string, fromEmail: string) {
  const normalized = provider.trim().toLowerCase();

  if (normalized.startsWith("smtp://") || normalized.startsWith("smtps://")) {
    return "Credential can be left blank when the full SMTP URL already contains the username and password.";
  }

  if (normalized === "sendgrid" || normalized === "resend") {
    return "Paste the provider API key exactly as issued in the provider dashboard.";
  }

  if (normalized === "gmail" || normalized === "google") {
    return "Recommended format: yourgmail@gmail.com:app-password. If you only paste the password, the From Address is used as the username.";
  }

  if (normalized === "outlook" || normalized === "office365" || normalized === "microsoft") {
    return "Recommended format: mailbox@domain.com:password or mailbox@domain.com|password.";
  }

  if (normalized === "brevo" || normalized === "sendinblue") {
    return "Recommended format: smtp-login|smtp-password.";
  }

  if (normalized.includes(".")) {
    return `Recommended format: username:password. If you only paste the password, ${fromEmail || "the From Address"} is used as the username.`;
  }

  return "For SMTP-style providers, use username:password or username|password.";
}

function NotificationsPageContent() {
  const [emailProvider, setEmailProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [templateOptions, setTemplateOptions] = useState<AdminEmailTemplate[]>([]);
  const [contactTemplateId, setContactTemplateId] = useState("");
  const [jobApplicationTemplateId, setJobApplicationTemplateId] = useState("");
  const [activeTab, setActiveTab] = useState("providers");
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplicationNotification[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLogRecord[]>([]);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyFromEmails, setReplyFromEmails] = useState<Record<string, string>>({});
  const [selectedContactSubmissionId, setSelectedContactSubmissionId] = useState<string | null>(null);
  const [sendingReplyFor, setSendingReplyFor] = useState<string | null>(null);
  const [deletingSubmissionId, setDeletingSubmissionId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [isLoadingNotificationLogs, setIsLoadingNotificationLogs] = useState(true);
  const [markingReadApplicationId, setMarkingReadApplicationId] = useState<string | null>(null);
  const [markingAllApplicationsRead, setMarkingAllApplicationsRead] = useState(false);
  const [deletingApplicationId, setDeletingApplicationId] = useState<string | null>(null);
  const [isDeletingAllApplications, setIsDeletingAllApplications] = useState(false);
  const [isClearingNotificationLogs, setIsClearingNotificationLogs] = useState(false);
  const [isLoadingProviderSettings, setIsLoadingProviderSettings] = useState(true);
  const [isSavingProviderSettings, setIsSavingProviderSettings] = useState(false);
  const [isSendingProviderTest, setIsSendingProviderTest] = useState(false);

  const selectedContactSubmission = useMemo(
    () => contactSubmissions.find((item) => item.id === selectedContactSubmissionId) ?? null,
    [contactSubmissions, selectedContactSubmissionId],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");

    if (tab === "contact-leads" || tab === "job-applications" || tab === "providers" || tab === "logs") {
      setActiveTab(tab);
      return;
    }

    setActiveTab("providers");
  }, []);

  const unreadCount = useMemo(
    () => contactSubmissions.filter((item) => !item.isRead).length,
    [contactSubmissions],
  );

  const applicationUnreadCount = useMemo(
    () => jobApplications.filter((item) => !item.isRead).length,
    [jobApplications],
  );

  const normalizedProvider = emailProvider.trim().toLowerCase();
  const providerUsesInlineSmtpUrl =
    normalizedProvider.startsWith("smtp://") || normalizedProvider.startsWith("smtps://");
  const hasProviderCredential = providerUsesInlineSmtpUrl || Boolean(apiKey.trim());
  const hasProviderConfig = Boolean(emailProvider.trim() && fromEmail.trim() && hasProviderCredential);

  useEffect(() => {
    let active = true;

    async function loadContacts() {
      setIsLoadingContacts(true);

      try {
        if (active) {
          const payload = await getAdminContactSubmissions();
          setContactSubmissions((payload.items ?? []) as ContactSubmission[]);
        }
      } catch {
        if (active) {
          setContactSubmissions([]);
        }
      } finally {
        if (active) {
          setIsLoadingContacts(false);
        }
      }
    }

    async function loadJobApplications() {
      setIsLoadingApplications(true);

      try {
        if (active) {
          const payload = await getAdminJobApplications();
          setJobApplications((payload.items ?? []) as JobApplicationNotification[]);
        }
      } catch {
        if (active) {
          setJobApplications([]);
        }
      } finally {
        if (active) {
          setIsLoadingApplications(false);
        }
      }
    }

    async function loadNotificationLogs() {
      setIsLoadingNotificationLogs(true);

      try {
        if (active) {
          const payload = await getAdminLogs();
          setNotificationLogs((payload.notifications ?? []) as NotificationLogRecord[]);
        }
      } catch {
        if (active) {
          setNotificationLogs([]);
        }
      } finally {
        if (active) {
          setIsLoadingNotificationLogs(false);
        }
      }
    }

    async function loadProviderSettings() {
      setIsLoadingProviderSettings(true);

      try {
        const result = await requestApi<SiteSettingsPayload>("/api/admin/site-settings", {
          auth: true,
        });

        if (active) {
          setEmailProvider(result.data.notificationEmailProvider ?? "");
          setApiKey(result.data.notificationEmailApiKey ?? "");
          setFromEmail(result.data.notificationFromEmail ?? result.data.companyEmail ?? "");
          setContactTemplateId(result.data.notificationTemplateMappings?.contactSubmissionAcknowledgementTemplateId ?? "");
          setJobApplicationTemplateId(result.data.notificationTemplateMappings?.jobApplicationAcknowledgementTemplateId ?? "");
        }
      } catch {
        if (active) {
          setEmailProvider("");
          setApiKey("");
          setFromEmail("");
          setContactTemplateId("");
          setJobApplicationTemplateId("");
        }
      } finally {
        if (active) {
          setIsLoadingProviderSettings(false);
        }
      }
    }

    async function loadEmailTemplateOptions() {
      try {
        const payload = await getAdminEmailTemplates();

        if (active) {
          setTemplateOptions((payload.items ?? []) as AdminEmailTemplate[]);
        }
      } catch {
        if (active) {
          setTemplateOptions([]);
        }
      }
    }

    loadContacts();
    loadJobApplications();
    loadNotificationLogs();
    loadProviderSettings();
    loadEmailTemplateOptions();

    return () => {
      active = false;
    };
  }, []);

  async function markAsRead(id: string) {
    try {
      await markAdminContactSubmissionRead(id);
      setContactSubmissions((current) => current.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
      toast.success("Marked as read.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to mark as read right now.");
    }
  }

  async function markAllAsRead() {
    try {
      await markAllAdminContactSubmissionsRead();
      setContactSubmissions((current) => current.map((item) => ({ ...item, isRead: true })));
      toast.success("All contact notifications marked as read.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to mark all as read.");
    }
  }

  async function markApplicationRead(id: string) {
    setMarkingReadApplicationId(id);

    try {
      await markAdminJobApplicationRead(id);
      setJobApplications((current) => current.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
      toast.success("Application notification marked as read.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to mark notification as read.");
    } finally {
      setMarkingReadApplicationId(null);
    }
  }

  async function markAllApplicationsAsRead() {
    setMarkingAllApplicationsRead(true);

    try {
      await markAllAdminJobApplicationsRead();
      setJobApplications((current) => current.map((item) => ({ ...item, isRead: true })));
      toast.success("All job application notifications marked as read.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to mark all as read.");
    } finally {
      setMarkingAllApplicationsRead(false);
    }
  }

  async function deleteApplicationNotification(id: string) {
    if (!window.confirm("Delete this job application notification? This action cannot be undone.")) {
      return;
    }

    setDeletingApplicationId(id);

    try {
      await deleteAdminJobApplication(id);
      setJobApplications((current) => current.filter((item) => item.id !== id));
      toast.success("Application notification deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete notification right now.");
    } finally {
      setDeletingApplicationId(null);
    }
  }

  async function deleteAllApplicationNotifications() {
    if (!jobApplications.length) {
      return;
    }

    if (!window.confirm("Delete all job application notifications? This action cannot be undone.")) {
      return;
    }

    setIsDeletingAllApplications(true);

    try {
      await deleteAllAdminJobApplications();
      setJobApplications([]);
      toast.success("All application notifications deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete notifications right now.");
    } finally {
      setIsDeletingAllApplications(false);
    }
  }

  async function clearNotificationLogItems() {
    if (!notificationLogs.length) {
      return;
    }

    if (!window.confirm("Clear notification logs from the database?")) {
      return;
    }

    setIsClearingNotificationLogs(true);

    try {
      await clearAdminLogs("notifications");
      setNotificationLogs([]);
      toast.success("Notification logs cleared.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to clear notification logs right now.");
    } finally {
      setIsClearingNotificationLogs(false);
    }
  }

  async function sendReply(item: ContactSubmission) {
    const replyMessage = (replyDrafts[item.id] ?? "").trim();
    const replyFromEmail = (replyFromEmails[item.id] ?? fromEmail).trim();

    if (!replyMessage) {
      toast.error("Please write a reply message.");
      return;
    }

    if (!replyFromEmail || !replyFromEmail.includes("@")) {
      toast.error("Please enter a valid reply-from email.");
      return;
    }

    setSendingReplyFor(item.id);

    try {
      const result = await replyToAdminContactSubmission(item.id, {
        replyMessage,
        replyFromEmail,
      });
      const updated = result.data.item;

      setContactSubmissions((current) =>
        current.map((entry) => (entry.id === item.id ? { ...entry, ...(updated ?? {}), isRead: true } : entry)),
      );
      setReplyDrafts((current) => ({ ...current, [item.id]: "" }));
      setReplyFromEmails((current) => ({ ...current, [item.id]: replyFromEmail }));

      if (result.data.emailSent) {
        toast.success("Reply sent successfully.");
      } else {
        toast.error(result.data.emailError ?? "Reply saved, but email could not be sent.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send reply right now.");
    } finally {
      setSendingReplyFor(null);
    }
  }

  async function deleteSubmission(id: string) {
    if (!window.confirm("Delete this contact submission? This action cannot be undone.")) {
      return;
    }

    setDeletingSubmissionId(id);

    try {
      await deleteAdminContactSubmission(id);
      setContactSubmissions((current) => current.filter((item) => item.id !== id));
      setReplyDrafts((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      setReplyFromEmails((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      setSelectedContactSubmissionId((current) => (current === id ? null : current));
      toast.success("Submission deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete submission right now.");
    } finally {
      setDeletingSubmissionId(null);
    }
  }

  async function deleteAllSubmissions() {
    if (!contactSubmissions.length) {
      return;
    }

    if (!window.confirm("Delete all contact submissions? This action cannot be undone.")) {
      return;
    }

    setIsDeletingAll(true);

    try {
      await deleteAllAdminContactSubmissions();
      setContactSubmissions([]);
      setReplyDrafts({});
      setReplyFromEmails({});
      setSelectedContactSubmissionId(null);
      toast.success("All submissions deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete submissions right now.");
    } finally {
      setIsDeletingAll(false);
    }
  }

  async function persistProviderSettings(showSuccessToast: boolean) {
    const normalizedProvider = emailProvider.trim();
    const normalizedApiKey = apiKey.trim();
    const normalizedFromEmail = fromEmail.trim();

    if (!normalizedProvider) {
      toast.error("Provider name is required.");
      return;
    }

    if (!normalizedFromEmail || !normalizedFromEmail.includes("@")) {
      toast.error("Enter a valid from email.");
      return false;
    }

    try {
      await requestApi("/api/admin/site-settings", {
        auth: true,
        method: "PUT",
        body: {
          notificationEmailProvider: normalizedProvider,
          notificationEmailApiKey: normalizedApiKey,
          notificationFromEmail: normalizedFromEmail,
          notificationTemplateMappings: {
            contactSubmissionAcknowledgementTemplateId: contactTemplateId.trim(),
            jobApplicationAcknowledgementTemplateId: jobApplicationTemplateId.trim(),
          },
        },
      });

      if (showSuccessToast) {
        toast.success("Provider settings saved.");
      }
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save provider settings.");
      return false;
    }
  }

  async function saveProviderSettings() {
    setIsSavingProviderSettings(true);

    try {
      await persistProviderSettings(true);
    } finally {
      setIsSavingProviderSettings(false);
    }
  }

  async function sendProviderTest() {
    setIsSendingProviderTest(true);

    try {
      const didSave = await persistProviderSettings(false);

      if (!didSave) {
        return;
      }

      const result = await requestApi<{
        emailSent: boolean;
        emailError?: string | null;
      }>("/api/admin/notification-settings/test", {
        auth: true,
        method: "POST",
      });

      toast.success(result.message ?? "Test email sent.");
      const logsPayload = await getAdminLogs();
      setNotificationLogs((logsPayload.notifications ?? []) as NotificationLogRecord[]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send provider test email.");
    } finally {
      setIsSendingProviderTest(false);
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/10">
          <TabsTrigger value="providers">Provider Settings</TabsTrigger>
          <TabsTrigger value="logs">Notification Logs</TabsTrigger>
          <TabsTrigger value="contact-leads">
            Contact Leads {unreadCount > 0 ? `(${unreadCount})` : ""}
          </TabsTrigger>
          <TabsTrigger value="job-applications">
            Job Applications {applicationUnreadCount > 0 ? `(${applicationUnreadCount})` : ""}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="grid gap-4 xl:grid-cols-3">
          <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">Notification Providers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <section className="space-y-4 rounded-2xl border border-[#D4E8FC] bg-white/70 p-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-900">Email channel</h3>
                  <p className="text-sm text-slate-500">Use this for admin email notifications and provider test messages.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Email Provider</Label>
                  <Input
                    value={emailProvider}
                    onChange={(event) => setEmailProvider(event.target.value)}
                    disabled={isLoadingProviderSettings || isSavingProviderSettings || isSendingProviderTest}
                    placeholder="e.g. gmail, resend, sendgrid, smtp.yourdomain.com, or smtps://user:pass@host:465"
                    className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
                  />
                  <p className="text-xs leading-5 text-slate-500">{getProviderHelpText(emailProvider)}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">API Key / Credential</Label>
                  <Input
                    value={apiKey}
                    onChange={(event) => setApiKey(event.target.value)}
                    disabled={isLoadingProviderSettings || isSavingProviderSettings || isSendingProviderTest}
                    placeholder="API key, app password, or username:password"
                    className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
                  />
                  <p className="text-xs leading-5 text-slate-500">{getCredentialHelpText(emailProvider, fromEmail.trim())}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">From Address</Label>
                  <Input
                    value={fromEmail}
                    onChange={(event) => setFromEmail(event.target.value)}
                    disabled={isLoadingProviderSettings || isSavingProviderSettings || isSendingProviderTest}
                    placeholder="notifications@yourdomain.com"
                    className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
                  />
                  <p className="text-xs leading-5 text-slate-500">
                    The test email is sent to this same address, so use a real mailbox you can access.
                  </p>
                </div>
              </section>

              <section className="space-y-4 rounded-2xl border border-[#D4E8FC] bg-white/70 p-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-900">Automatic email templates</h3>
                  <p className="text-sm text-slate-500">
                    Pick which active template should be sent automatically after each public form submission.
                  </p>
                  {!templateOptions.length ? (
                    <p className="text-xs text-slate-500">
                      No templates found yet. Create them in{" "}
                      <Link href="/admin/email-templates" className="text-[#1B66B3] hover:text-[#145188]">
                        Email Templates
                      </Link>
                      .
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Contact form acknowledgement
                    </Label>
                    <select
                      value={contactTemplateId}
                      onChange={(event) => setContactTemplateId(event.target.value)}
                      disabled={isLoadingProviderSettings || isSavingProviderSettings || isSendingProviderTest}
                      className="h-10 w-full rounded-md border border-[#D4E8FC] bg-[#F8FBFF] px-3 text-sm text-slate-900"
                    >
                      <option value="" className="bg-[#F8FBFF] text-slate-900">
                        No automatic email
                      </option>
                      {templateOptions.map((template) => (
                        <option key={template.id} value={template.id} className="bg-[#F8FBFF] text-slate-900">
                          {template.name}
                          {template.isActive ? "" : " (Inactive)"}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs leading-5 text-slate-500">
                      Sent after someone submits the public contact form. Only active templates are delivered automatically.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Job application acknowledgement
                    </Label>
                    <select
                      value={jobApplicationTemplateId}
                      onChange={(event) => setJobApplicationTemplateId(event.target.value)}
                      disabled={isLoadingProviderSettings || isSavingProviderSettings || isSendingProviderTest}
                      className="h-10 w-full rounded-md border border-[#D4E8FC] bg-[#F8FBFF] px-3 text-sm text-slate-900"
                    >
                      <option value="" className="bg-[#F8FBFF] text-slate-900">
                        No automatic email
                      </option>
                      {templateOptions.map((template) => (
                        <option key={template.id} value={template.id} className="bg-[#F8FBFF] text-slate-900">
                          {template.name}
                          {template.isActive ? "" : " (Inactive)"}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs leading-5 text-slate-500">
                      Sent after someone submits the public job application form. Only active templates are delivered automatically.
                    </p>
                  </div>
                </div>
              </section>

              {isLoadingProviderSettings ? (
                <p className="text-sm text-slate-500">Loading provider settings...</p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    void saveProviderSettings();
                  }}
                  disabled={isLoadingProviderSettings || isSavingProviderSettings || isSendingProviderTest}
                >
                  {isSavingProviderSettings ? "Saving..." : "Save Settings"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void sendProviderTest();
                  }}
                  disabled={isLoadingProviderSettings || isSavingProviderSettings || isSendingProviderTest || !hasProviderConfig}
                >
                  <Send className="h-4 w-4" />
                  {isSendingProviderTest ? "Sending..." : "Send Test"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Channel Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] px-3 py-2">
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-700" />
                  Email
                </span>
                {hasProviderConfig ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Configured
                  </span>
                ) : (
                  <span className="text-xs text-amber-700">Missing config</span>
                )}
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] px-3 py-2">
                <span className="inline-flex items-center gap-2">
                  <BellRing className="h-4 w-4 text-amber-700" />
                  In-app
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Active
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-xl text-slate-900">Notification Logs</CardTitle>
              <Button
                type="button"
                variant="outline"
                className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-[#EDF5FF]"
                onClick={() => {
                  void clearNotificationLogItems();
                }}
                disabled={!notificationLogs.length || isLoadingNotificationLogs || isClearingNotificationLogs}
              >
                {isClearingNotificationLogs ? "Clearing..." : "Clear logs"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoadingNotificationLogs ? (
                <p className="text-sm text-slate-500">Loading notification logs...</p>
              ) : null}

              {!isLoadingNotificationLogs && !notificationLogs.length ? (
                <div className="rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] p-4 text-sm text-slate-500">
                  No notification logs found.
                </div>
              ) : null}

              {notificationLogs.map((item) => {
                const status = formatNotificationStatus(item);

                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.action}</p>
                      <p className="text-xs text-slate-500">{item.target || "-"}</p>
                      <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
                        status === "Sent"
                          ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-700"
                          : status === "Failed"
                            ? "border-rose-300/40 bg-rose-300/15 text-rose-700"
                            : "border-amber-300/40 bg-amber-300/15 text-amber-700",
                      )}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact-leads">
          <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-xl text-slate-900">Contact Form Submissions</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-[#EDF5FF]"
                  onClick={markAllAsRead}
                  disabled={!unreadCount || isDeletingAll}
                >
                  Mark all as read
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={deleteAllSubmissions}
                  disabled={!contactSubmissions.length || isDeletingAll}
                >
                  {isDeletingAll ? "Deleting..." : "Delete all"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoadingContacts ? (
                <p className="text-sm text-slate-500">Loading contact submissions...</p>
              ) : null}

              {!isLoadingContacts && !contactSubmissions.length ? (
                <div className="rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] p-4 text-sm text-slate-500">
                  No contact submissions yet.
                </div>
              ) : null}

              {contactSubmissions.map((item) => (
                <article key={item.id} className="space-y-3 rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">
                        {item.firstName} {item.lastName} ({formatInquiryType(item.inquiryType)})
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.email} | {item.phonePrefix} {item.phoneNumber}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.company} | {item.position} | {item.country} | {item.industry}
                      </p>
                      <p className="text-xs text-slate-500">
                        Received: {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!item.isRead ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/35 bg-amber-300/15 px-2 py-1 text-xs text-amber-700">
                          <BellRing className="h-3.5 w-3.5" />
                          New
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/35 bg-emerald-300/15 px-2 py-1 text-xs text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Read
                        </span>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-[#EDF5FF]"
                        onClick={() => {
                          setSelectedContactSubmissionId(item.id);
                          if (!item.isRead) {
                            void markAsRead(item.id);
                          }
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                      {!item.isRead ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-[#EDF5FF]"
                          onClick={() => markAsRead(item.id)}
                        >
                          Mark read
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteSubmission(item.id)}
                        disabled={deletingSubmissionId === item.id || isDeletingAll}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingSubmissionId === item.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border border-[#D4E8FC] bg-[#F8FBFF]/70 p-3">
                    <p className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                      <MessageSquareText className="h-3.5 w-3.5 text-amber-700" />
                      Message
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-700">{item.message}</p>
                  </div>
                </article>
              ))}

              <Dialog
                open={Boolean(selectedContactSubmission)}
                onOpenChange={(open) => {
                  if (!open) {
                    setSelectedContactSubmissionId(null);
                  }
                }}
              >
                <DialogContent className="max-h-[88vh] w-[min(96vw,64rem)] overflow-y-auto border-[#D4E8FC] bg-[#F8FBFF] text-slate-900 sm:w-full sm:max-w-4xl">
                  {selectedContactSubmission ? (
                    <div className="space-y-4">
                      <DialogHeader>
                        <DialogTitle className="text-xl text-slate-900">
                          {selectedContactSubmission.firstName} {selectedContactSubmission.lastName} -{" "}
                          {formatInquiryType(selectedContactSubmission.inquiryType)}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                          Received: {new Date(selectedContactSubmission.createdAt).toLocaleString()}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-md border border-[#D4E8FC] bg-[#F8FBFF] p-3 text-sm">
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="text-slate-900">{selectedContactSubmission.email}</p>
                        </div>
                        <div className="rounded-md border border-[#D4E8FC] bg-[#F8FBFF] p-3 text-sm">
                          <p className="text-xs text-slate-500">Phone</p>
                          <p className="text-slate-900">
                            {selectedContactSubmission.phonePrefix} {selectedContactSubmission.phoneNumber}
                          </p>
                        </div>
                        <div className="rounded-md border border-[#D4E8FC] bg-[#F8FBFF] p-3 text-sm">
                          <p className="text-xs text-slate-500">Company / Position</p>
                          <p className="text-slate-900">
                            {selectedContactSubmission.company} / {selectedContactSubmission.position}
                          </p>
                        </div>
                        <div className="rounded-md border border-[#D4E8FC] bg-[#F8FBFF] p-3 text-sm">
                          <p className="text-xs text-slate-500">Country / Industry</p>
                          <p className="text-slate-900">
                            {selectedContactSubmission.country} / {selectedContactSubmission.industry}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-md border border-[#D4E8FC] bg-[#F8FBFF]/80 p-3">
                        <p className="text-xs font-medium text-slate-600">Original Message</p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-900">
                          {selectedContactSubmission.message}
                        </p>
                      </div>

                      <div className="space-y-2 rounded-md border border-[#D4E8FC] bg-[#F8FBFF] p-3">
                        <p className="text-xs font-medium text-slate-600">Reply History</p>
                        {!selectedContactSubmission.replies?.length ? (
                          <p className="text-sm text-slate-500">No replies yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedContactSubmission.replies.map((reply) => (
                              <div key={reply.id} className="rounded-md border border-[#D4E8FC] bg-[#F8FBFF]/80 p-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-xs text-slate-500">
                                    From: {reply.fromEmail} | To: {reply.toEmail}
                                  </p>
                                  <span
                                    className={cn(
                                      "rounded-full border px-2 py-0.5 text-xs",
                                      reply.deliveryStatus === "sent"
                                        ? "border-emerald-300/35 bg-emerald-300/15 text-emerald-700"
                                        : reply.deliveryStatus === "failed"
                                          ? "border-rose-300/35 bg-rose-300/15 text-rose-700"
                                          : "border-amber-300/35 bg-amber-300/15 text-amber-700",
                                    )}
                                  >
                                    {formatReplyDeliveryStatus(reply.deliveryStatus)}
                                  </span>
                                </div>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-900">{reply.message}</p>
                                <p className="mt-2 text-xs text-slate-500">
                                  {new Date(reply.sentAt).toLocaleString()}
                                </p>
                                {reply.deliveryError ? (
                                  <p className="mt-1 text-xs text-rose-200">{reply.deliveryError}</p>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 rounded-md border border-[#D4E8FC] bg-[#F8FBFF]/70 p-3">
                        <Label className="text-xs text-slate-500">Reply from email</Label>
                        <Input
                          value={replyFromEmails[selectedContactSubmission.id] ?? fromEmail}
                          onChange={(event) =>
                            setReplyFromEmails((current) => ({
                              ...current,
                              [selectedContactSubmission.id]: event.target.value,
                            }))
                          }
                          placeholder="support@yourdomain.com"
                          className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                        />
                        <Label className="text-xs text-slate-500">Reply message</Label>
                        <textarea
                          value={replyDrafts[selectedContactSubmission.id] ?? ""}
                          onChange={(event) =>
                            setReplyDrafts((current) => ({
                              ...current,
                              [selectedContactSubmission.id]: event.target.value,
                            }))
                          }
                          placeholder="Write your response..."
                          className="min-h-24 w-full rounded-md border border-[#D4E8FC] bg-[#F4F9FF] px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-[#1B66B3]/55 focus:outline-none"
                        />
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            onClick={() => sendReply(selectedContactSubmission)}
                            disabled={
                              sendingReplyFor === selectedContactSubmission.id ||
                              deletingSubmissionId === selectedContactSubmission.id ||
                              isDeletingAll
                            }
                          >
                            {sendingReplyFor === selectedContactSubmission.id ? "Sending..." : "Send Reply"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="job-applications">
          <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-xl text-slate-900">Job Application Notifications</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-[#EDF5FF]"
                  onClick={markAllApplicationsAsRead}
                  disabled={!applicationUnreadCount || markingAllApplicationsRead || isDeletingAllApplications}
                >
                  {markingAllApplicationsRead ? "Marking..." : "Mark all as read"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    void deleteAllApplicationNotifications();
                  }}
                  disabled={!jobApplications.length || isDeletingAllApplications}
                >
                  {isDeletingAllApplications ? "Deleting..." : "Delete all"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoadingApplications ? (
                <p className="text-sm text-slate-500">Loading application notifications...</p>
              ) : null}

              {!isLoadingApplications && !jobApplications.length ? (
                <div className="rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] p-4 text-sm text-slate-500">
                  No job applications yet.
                </div>
              ) : null}

              {jobApplications.map((item) => (
                <article key={item.id} className="space-y-3 rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">{item.fullName}</p>
                      <p className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <BriefcaseBusiness className="h-3.5 w-3.5 text-amber-700" />
                        {item.jobTitle}
                      </p>
                      <p className="text-xs text-slate-500">{item.email}</p>
                      <p className="text-xs text-slate-500">
                        Received: {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusChip status={formatApplicationStatus(item.status)} />
                      {!item.isRead ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/35 bg-amber-300/15 px-2 py-1 text-xs text-amber-700">
                          <BellRing className="h-3.5 w-3.5" />
                          New
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/35 bg-emerald-300/15 px-2 py-1 text-xs text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Read
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link href={`/admin/applications/${item.id}`} className="text-xs text-amber-700 hover:text-amber-700">
                      View application
                    </Link>
                    <div className="flex flex-wrap items-center gap-2">
                      {!item.isRead ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-[#EDF5FF]"
                          disabled={markingReadApplicationId === item.id || deletingApplicationId === item.id}
                          onClick={() => markApplicationRead(item.id)}
                        >
                          {markingReadApplicationId === item.id ? "Marking..." : "Mark read"}
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        disabled={deletingApplicationId === item.id || isDeletingAllApplications}
                        onClick={() => {
                          void deleteApplicationNotification(item.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingApplicationId === item.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div className="h-10 w-56 rounded-md bg-[#F8FBFF]" />}>
      <NotificationsPageContent />
    </Suspense>
  );
}


