import { requestApi } from "@/lib/api/http";

export type ContactSubmissionReply = {
  id: string;
  message: string;
  sentAt: string;
  fromEmail: string;
  toEmail: string;
  deliveryStatus: "saved" | "sent" | "failed";
  deliveryError: string | null;
};

export type AdminContactSubmission = {
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
  replies: ContactSubmissionReply[];
};

type AdminAuthContext = {
  token?: string | null;
};

function withAdminAuth(context?: AdminAuthContext) {
  return {
    auth: true as const,
    token: context?.token,
  };
}

export async function getAdminContactSubmissions(context?: AdminAuthContext) {
  const result = await requestApi<{
    items: AdminContactSubmission[];
    unreadCount: number;
  }>("/api/admin/contact-submissions", withAdminAuth(context));

  return result.data;
}

export async function markAdminContactSubmissionRead(id: string, context?: AdminAuthContext) {
  return requestApi<AdminContactSubmission, { id: string }>("/api/admin/contact-submissions", {
    ...withAdminAuth(context),
    method: "PATCH",
    body: { id },
  });
}

export async function markAllAdminContactSubmissionsRead(context?: AdminAuthContext) {
  return requestApi<null, { markAll: true }>("/api/admin/contact-submissions", {
    ...withAdminAuth(context),
    method: "PATCH",
    body: { markAll: true },
  });
}

export async function replyToAdminContactSubmission(
  id: string,
  payload: {
    replyMessage: string;
    replyFromEmail: string;
  },
  context?: AdminAuthContext,
) {
  return requestApi<
    {
      item: AdminContactSubmission;
      emailSent: boolean;
      emailError: string | null;
    },
    {
      id: string;
      replyMessage: string;
      replyFromEmail: string;
    }
  >("/api/admin/contact-submissions", {
    ...withAdminAuth(context),
    method: "PATCH",
    body: {
      id,
      ...payload,
    },
  });
}

export async function deleteAdminContactSubmission(id: string, context?: AdminAuthContext) {
  return requestApi<null, { id: string }>("/api/admin/contact-submissions", {
    ...withAdminAuth(context),
    method: "DELETE",
    body: { id },
  });
}

export async function deleteAllAdminContactSubmissions(context?: AdminAuthContext) {
  return requestApi<null, { deleteAll: true }>("/api/admin/contact-submissions", {
    ...withAdminAuth(context),
    method: "DELETE",
    body: { deleteAll: true },
  });
}
