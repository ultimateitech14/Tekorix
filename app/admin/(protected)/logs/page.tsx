"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LogRow = {
  id: string;
  module: string;
  change: string;
  details: string;
  actor: string;
  time: string;
};

type AdminLogRecord = {
  id: string;
  module?: string;
  action: string;
  actor: string;
  target: string;
  createdAt: string;
};

type LogsResponsePayload = {
  success: boolean;
  data?: {
    activity?: AdminLogRecord[];
    audit?: AdminLogRecord[];
    notifications?: AdminLogRecord[];
  };
};

const timestampFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const columns: DataTableColumn<LogRow>[] = [
  {
    id: "module",
    header: "Module",
    cell: (row) => <span className="font-medium text-amber-700">{row.module}</span>,
  },
  {
    id: "change",
    header: "What Changed",
    className: "max-w-[260px] whitespace-normal break-words",
    cell: (row) => <span className="font-medium text-slate-900">{row.change}</span>,
  },
  {
    id: "details",
    header: "Details",
    className: "max-w-[420px] whitespace-normal break-words",
    cell: (row) => <span className="text-slate-600">{row.details}</span>,
  },
  {
    id: "actor",
    header: "By",
    cell: (row) => <span className="text-slate-600">{row.actor}</span>,
  },
  {
    id: "time",
    header: "Timestamp",
    cell: (row) => <span className="text-slate-600">{row.time}</span>,
  },
];

type LogsTab = "activity" | "audit" | "notifications";

function parseLogsTab(value: string | null): LogsTab {
  if (value === "audit" || value === "notifications" || value === "activity") {
    return value;
  }

  return "activity";
}

function formatTimestamp(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return timestampFormatter.format(parsed);
}

function toSentenceCase(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatChange(action: string) {
  const normalized = action.trim();

  if (!normalized) {
    return "Updated record";
  }

  return toSentenceCase(normalized);
}

function inferModuleFromRecord(item: AdminLogRecord) {
  const explicitModule = item.module?.trim();

  if (explicitModule) {
    return explicitModule;
  }

  const text = `${item.action} ${item.target}`.toLowerCase();

  if (text.includes("application")) {
    return "Applications";
  }

  if (text.includes("resume") || text.includes("candidate")) {
    return "Candidates";
  }

  if (text.includes("job")) {
    return "Jobs";
  }

  if (text.includes("contact submission") || text.includes("notification") || text.includes("provider")) {
    return "Email & Notifications";
  }

  if (text.includes("settings")) {
    return "Settings";
  }

  return "System";
}

function formatDetails(target: string) {
  const normalized = target.trim();

  if (!normalized) {
    return "-";
  }

  return normalized.replace(/\s+-\s+/g, " -> ");
}

function toLogRows(items: AdminLogRecord[] = []): LogRow[] {
  return items.map((item) => ({
    id: item.id,
    module: inferModuleFromRecord(item),
    change: formatChange(item.action),
    details: formatDetails(item.target),
    actor: item.actor,
    time: formatTimestamp(item.createdAt),
  }));
}

function LogsPageContent() {
  const router = useRouter();
  const pathname = usePathname() ?? "/admin/logs";
  const searchParams = useSearchParams();
  const [activityLogs, setActivityLogs] = useState<LogRow[]>([]);
  const [auditTrail, setAuditTrail] = useState<LogRow[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<LogRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearingActivityLogs, setIsClearingActivityLogs] = useState(false);
  const [isClearingAuditTrail, setIsClearingAuditTrail] = useState(false);
  const [isClearingNotificationLogs, setIsClearingNotificationLogs] = useState(false);

  const tab = useMemo(() => parseLogsTab(searchParams?.get("tab") ?? null), [searchParams]);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/logs", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logs.");
      }

      const payload = (await response.json()) as LogsResponsePayload;

      if (!payload.success || !payload.data) {
        throw new Error("Invalid logs response.");
      }

      setActivityLogs(toLogRows(payload.data.activity ?? []));
      setAuditTrail(toLogRows(payload.data.audit ?? []));
      setNotificationLogs(toLogRows(payload.data.notifications ?? []));
    } catch {
      setActivityLogs([]);
      setAuditTrail([]);
      setNotificationLogs([]);
      toast.error("Unable to load logs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  function handleTabChange(nextTab: string) {
    const parsed = parseLogsTab(nextTab);
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (parsed === "activity") {
      params.delete("tab");
    } else {
      params.set("tab", parsed);
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  async function clearLogs(tabToClear: LogsTab) {
    if (tabToClear === "activity") {
      setIsClearingActivityLogs(true);
    } else if (tabToClear === "audit") {
      setIsClearingAuditTrail(true);
    } else {
      setIsClearingNotificationLogs(true);
    }

    try {
      const response = await fetch("/api/admin/logs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tab: tabToClear }),
      });

      if (!response.ok) {
        throw new Error("Failed to clear logs.");
      }

      const payload = (await response.json()) as { success?: boolean };

      if (!payload.success) {
        throw new Error("Failed to clear logs.");
      }

      if (tabToClear === "activity") {
        toast.success("Activity logs cleared.");
      } else if (tabToClear === "audit") {
        toast.success("Audit trail cleared.");
      } else {
        toast.success("Notification logs cleared.");
      }
      await loadLogs();
    } catch {
      toast.error("Unable to clear logs.");
    } finally {
      if (tabToClear === "activity") {
        setIsClearingActivityLogs(false);
      } else if (tabToClear === "audit") {
        setIsClearingAuditTrail(false);
      } else {
        setIsClearingNotificationLogs(false);
      }
    }
  }

  function handleClear(tabToClear: LogsTab) {
    const label =
      tabToClear === "activity"
        ? "activity logs"
        : tabToClear === "audit"
          ? "audit trail entries"
          : "notification logs";

    toast(`Clear all ${label}?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Clear",
        onClick: () => {
          void clearLogs(tabToClear);
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      duration: 7000,
    });
  }

  return (
    <Tabs value={tab} onValueChange={handleTabChange}>
      <TabsList className="bg-white/10">
        <TabsTrigger value="activity">Activity Logs</TabsTrigger>
        <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        <TabsTrigger value="notifications">Notification Logs</TabsTrigger>
      </TabsList>

      <TabsContent value="activity" className="mt-4">
        <DataTable
          title="Activity Logs"
          description="Track updates by module with clear action details."
          actions={
            <Button
              type="button"
              variant="outline"
              className="border-[#BAD7F6] text-slate-900 hover:bg-[#EDF5FF]"
              disabled={isClearingActivityLogs || isLoading}
              onClick={() => handleClear("activity")}
            >
              {isClearingActivityLogs ? "Clearing..." : "Clear Activity"}
            </Button>
          }
          columns={columns}
          data={activityLogs}
          getRowId={(row) => row.id}
          emptyMessage={isLoading ? "Loading logs..." : "No activity logs found."}
        />
      </TabsContent>

      <TabsContent value="audit" className="mt-4">
        <DataTable
          title="Audit Trail"
          description="Shows what changed and where it changed (Applications, Candidates, Jobs, Settings)."
          actions={
            <Button
              type="button"
              variant="outline"
              className="border-[#BAD7F6] text-slate-900 hover:bg-[#EDF5FF]"
              disabled={isClearingAuditTrail || isLoading}
              onClick={() => handleClear("audit")}
            >
              {isClearingAuditTrail ? "Clearing..." : "Clear Audit Trail"}
            </Button>
          }
          columns={columns}
          data={auditTrail}
          getRowId={(row) => row.id}
          emptyMessage={isLoading ? "Loading logs..." : "No audit logs found."}
        />
      </TabsContent>

      <TabsContent value="notifications" className="mt-4">
        <DataTable
          title="Notification Logs"
          description="Outgoing provider delivery events."
          actions={
            <Button
              type="button"
              variant="outline"
              className="border-[#BAD7F6] text-slate-900 hover:bg-[#EDF5FF]"
              disabled={isClearingNotificationLogs || isLoading}
              onClick={() => handleClear("notifications")}
            >
              {isClearingNotificationLogs ? "Clearing..." : "Clear Notifications"}
            </Button>
          }
          columns={columns}
          data={notificationLogs}
          getRowId={(row) => row.id}
          emptyMessage={isLoading ? "Loading logs..." : "No notification logs found."}
        />
      </TabsContent>
    </Tabs>
  );
}

export default function LogsPage() {
  return (
    <Suspense fallback={<div className="space-y-4">Loading logs...</div>}>
      <LogsPageContent />
    </Suspense>
  );
}


