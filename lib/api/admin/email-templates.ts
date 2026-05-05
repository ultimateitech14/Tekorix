import { requestApi } from "@/lib/api/http";

export type AdminEmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  channel: "Email";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export async function getAdminEmailTemplates(context?: AdminAuthContext) {
  const result = await requestApi<{ items: AdminEmailTemplate[] }>("/api/admin/email-templates", withAdminAuth(context));
  return result.data;
}

export async function createAdminEmailTemplate(
  payload: {
    name: string;
    subject: string;
    body: string;
    isActive: boolean;
  },
  context?: AdminAuthContext,
) {
  return requestApi<AdminEmailTemplate, typeof payload>("/api/admin/email-templates", {
    ...withAdminAuth(context),
    method: "POST",
    body: payload,
  });
}

export async function updateAdminEmailTemplate(
  payload: {
    id: string;
    name?: string;
    subject?: string;
    body?: string;
    isActive?: boolean;
  },
  context?: AdminAuthContext,
) {
  return requestApi<AdminEmailTemplate, typeof payload>("/api/admin/email-templates", {
    ...withAdminAuth(context),
    method: "PATCH",
    body: payload,
  });
}

export async function deleteAdminEmailTemplate(id: string, context?: AdminAuthContext) {
  return requestApi<null, { id: string }>("/api/admin/email-templates", {
    ...withAdminAuth(context),
    method: "DELETE",
    body: { id },
  });
}

export async function deleteAllAdminEmailTemplates(context?: AdminAuthContext) {
  return requestApi<null, { deleteAll: true }>("/api/admin/email-templates", {
    ...withAdminAuth(context),
    method: "DELETE",
    body: { deleteAll: true },
  });
}

export async function sendAdminTemplateEmail(
  payload: {
    templateId: string;
    toEmail: string;
    fromEmail: string;
    subject: string;
    body: string;
  },
  context?: AdminAuthContext,
) {
  return requestApi<
    {
      emailSent: boolean;
      emailError: string | null;
    },
    typeof payload
  >("/api/admin/email-templates/send", {
    ...withAdminAuth(context),
    method: "POST",
    body: payload,
  });
}
