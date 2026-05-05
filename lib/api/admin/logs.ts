import { requestApi } from "@/lib/api/http";

export type AdminLogRecord = {
  id: string;
  module?: string;
  action: string;
  actor: string;
  target: string;
  createdAt: string;
};

type AdminAuthContext = {
  token?: string | null;
};

type LogsTab = "activity" | "audit" | "notifications";

function withAdminAuth(context?: AdminAuthContext) {
  return {
    auth: true as const,
    token: context?.token,
  };
}

export async function getAdminLogs(context?: AdminAuthContext) {
  const result = await requestApi<{
    activity: AdminLogRecord[];
    audit: AdminLogRecord[];
    notifications: AdminLogRecord[];
  }>("/api/admin/logs", withAdminAuth(context));

  return result.data;
}

export async function clearAdminLogs(tab: LogsTab, context?: AdminAuthContext) {
  return requestApi<null, { tab: LogsTab }>("/api/admin/logs", {
    ...withAdminAuth(context),
    method: "DELETE",
    body: { tab },
  });
}
