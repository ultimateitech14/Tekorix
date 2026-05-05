"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  ClipboardCheck,
  Clock3,
  Download,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { StatCard } from "@/components/admin/StatCard";
import { StatusChip } from "@/components/admin/status-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  downloadAdminJobApplicationResume,
  updateAdminJobApplicationStatus,
} from "@/lib/api/admin/job-applications";
import { requestApi } from "@/lib/api/http";
import { ENABLE_ADMIN_LIGHTER_TYPE, ENABLE_ADMIN_UI_REFRESH } from "@/lib/ui-flags";
import { cn } from "@/lib/utils";
import type { JobApplicationStatus } from "@/lib/validators/job-applications";

type ApplicationRow = {
  id: string;
  candidate: string;
  job: string;
  status: JobApplicationStatus;
  date: string;
  hasResume: boolean;
};

type DashboardPayload = {
  kpis: {
    totalJobs: number;
    publishedJobs: number;
    draftJobs: number;
    closedJobs: number;
    totalApplications: number;
    unreadApplications: number;
    shortlistedApplications: number;
    pendingApplications: number;
    totalCompanyLeads: number;
    totalCandidateLeads: number;
    totalContactSubmissions: number;
    unreadContactSubmissions: number;
  };
  applicationsByDay: Array<{
    day: string;
    count: number;
  }>;
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentApplications: ApplicationRow[];
  workerSync: {
    connected: boolean;
    errors: string[];
  };
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
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

function formatDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return dateFormatter.format(parsed);
}

const emptyDashboardData: DashboardPayload = {
  kpis: {
    totalJobs: 0,
    publishedJobs: 0,
    draftJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
    unreadApplications: 0,
    shortlistedApplications: 0,
    pendingApplications: 0,
    totalCompanyLeads: 0,
    totalCandidateLeads: 0,
    totalContactSubmissions: 0,
    unreadContactSubmissions: 0,
  },
  applicationsByDay: [],
  statusDistribution: [],
  recentApplications: [],
  workerSync: {
    connected: true,
    errors: [],
  },
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardPayload>(emptyDashboardData);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [chartsReady, setChartsReady] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    setChartsReady(true);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const result = await requestApi<DashboardPayload>("/api/admin/dashboard", {
          auth: true,
        });

        if (active) {
          setData(result.data);
          setLoadError(null);
        }
      } catch (error) {
        if (active) {
          setData(emptyDashboardData);
          setLoadError(error instanceof Error ? error.message : "Unable to load dashboard.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();
    const timer = window.setInterval(() => {
      void loadDashboard();
    }, 15000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  async function updateStatus(applicationId: string, nextStatus: JobApplicationStatus) {
    setUpdatingId(applicationId);

    try {
      const result = await updateAdminJobApplicationStatus(applicationId, nextStatus);

      setData((current) => {
        const previous = current.recentApplications.find((item) => item.id === applicationId)?.status;
        const nextRecentApplications = current.recentApplications.map((item) =>
          item.id === applicationId ? { ...item, status: nextStatus } : item,
        );
        const nextDistribution = current.statusDistribution.map((item) => {
          if (item.name === formatStatusLabel(nextStatus)) {
            return { ...item, value: item.value + 1 };
          }

          if (previous && item.name === formatStatusLabel(previous) && item.value > 0) {
            return { ...item, value: item.value - 1 };
          }

          return item;
        });

        return {
          ...current,
          recentApplications: nextRecentApplications,
          statusDistribution: nextDistribution,
          kpis: {
            ...current.kpis,
            shortlistedApplications:
              current.kpis.shortlistedApplications +
              (nextStatus === "shortlisted" ? 1 : 0) -
              (previous === "shortlisted" ? 1 : 0),
            pendingApplications:
              current.kpis.pendingApplications +
              (nextStatus === "pending review" ? 1 : 0) -
              (previous === "pending review" ? 1 : 0),
          },
        };
      });

      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update application status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDownloadResume(applicationId: string) {
    setDownloadingId(applicationId);

    try {
      await downloadAdminJobApplicationResume(applicationId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to download resume.");
    } finally {
      setDownloadingId(null);
    }
  }

  const kpis = useMemo(
    () => [
      {
        label: "Total Jobs",
        value: String(data.kpis.totalJobs),
        detail: `${data.kpis.publishedJobs} published | ${data.kpis.draftJobs} draft | ${data.kpis.closedJobs} closed`,
        icon: BriefcaseBusiness,
      },
      {
        label: "Total Applications",
        value: String(data.kpis.totalApplications),
        detail: `${data.kpis.unreadApplications} unread | ${data.kpis.totalCompanyLeads} company leads`,
        icon: Users,
      },
      {
        label: "Shortlisted",
        value: String(data.kpis.shortlistedApplications),
        detail: `${data.kpis.totalCandidateLeads} candidate leads in pipeline`,
        icon: UserRoundCheck,
      },
      {
        label: "Pending Review",
        value: String(data.kpis.pendingApplications),
        detail: `${data.kpis.unreadContactSubmissions} unread contact notifications`,
        icon: Clock3,
      },
    ],
    [data],
  );

  const totalDistribution = data.statusDistribution.reduce((sum, item) => sum + item.value, 0);

  const columns: DataTableColumn<ApplicationRow>[] = [
    {
      id: "candidate",
      header: "Candidate",
      cell: (row) => (
        <p className={cn("text-slate-900", ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold")}>
          {row.candidate}
        </p>
      ),
    },
    {
      id: "job",
      header: "Job role",
      cell: (row) => <p className="text-sm text-slate-600">{row.job}</p>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusChip status={formatStatusLabel(row.status)} />,
    },
    {
      id: "date",
      header: "Applied on",
      cell: (row) => <span className="text-sm text-slate-600">{formatDate(row.date)}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="h-8 text-sm font-medium">
            <Link href={`/admin/applications/${row.id}`}>View</Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-sm font-medium"
            disabled={updatingId === row.id || row.status === "shortlisted"}
            onClick={() => {
              void updateStatus(row.id, "shortlisted");
            }}
          >
            <ClipboardCheck className="h-4 w-4" />
            Shortlist
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-sm font-medium text-rose-700 hover:text-rose-800"
            disabled={updatingId === row.id || row.status === "rejected"}
            onClick={() => {
              void updateStatus(row.id, "rejected");
            }}
          >
            Reject
          </Button>
          {row.hasResume ? (
            <Button
              size="icon"
              variant="ghost"
              aria-label="Download resume"
              disabled={downloadingId === row.id}
              onClick={() => {
                void handleDownloadResume(row.id);
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="icon" variant="ghost" aria-label="Resume unavailable" disabled>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 md:space-y-6">
      {loadError ? (
        <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </div>
      ) : null}

      {!data.workerSync.connected ? (
        <div className="rounded-lg border border-amber-300/30 bg-amber-300/12 px-4 py-3 text-sm text-amber-700">
          Backend sync partial: {data.workerSync.errors.join(", ")} data unavailable.
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={isLoading ? "..." : item.value}
            detail={item.detail}
            icon={item.icon}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <Card
          className={cn(
            "backdrop-blur-xl xl:col-span-3",
            ENABLE_ADMIN_UI_REFRESH
              ? "border-[#D4E8FC] bg-[linear-gradient(145deg,#F9FCFF_0%,#EDF6FF_100%)]"
              : "border-[#D4E8FC] bg-[#F8FBFF]",
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className={cn("text-xl text-slate-900", ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold")}>
              Applications per day
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] pt-4 sm:h-[300px]">
            {chartsReady ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.applicationsByDay} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #cbdff6",
                      background: "#f8fbff",
                      color: "#0f172a",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1B66B3"
                    strokeWidth={2.5}
                    dot={{ fill: "#1B66B3", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-lg border border-[#D4E8FC] bg-[#F8FBFF]" />
            )}
          </CardContent>
        </Card>

        <Card
          className={cn(
            "backdrop-blur-xl xl:col-span-2",
            ENABLE_ADMIN_UI_REFRESH
              ? "border-[#D4E8FC] bg-[linear-gradient(145deg,#F9FCFF_0%,#EDF6FF_100%)]"
              : "border-[#D4E8FC] bg-[#F8FBFF]",
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className={cn("text-xl text-slate-900", ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold")}>
              Status distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pb-5 pt-2 sm:gap-3">
            <div className="h-[220px] sm:h-[240px]">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.statusDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={92}
                      paddingAngle={2}
                    >
                      {data.statusDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        background: "#f8fafc",
                        color: "#0f172a",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "#0f172a", fontWeight: 600 }}
                      labelStyle={{ color: "#334155" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-lg border border-[#D4E8FC] bg-[#F8FBFF]" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {data.statusDistribution.map((item) => (
                <div key={item.name} className="rounded-md border border-[#D4E8FC] bg-[#F4F9FF] px-2.5 py-2">
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </p>
                  <p className={cn("mt-1 text-base text-slate-900", ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold")}>
                    {totalDistribution > 0 ? Math.round((item.value / totalDistribution) * 100) : 0}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <DataTable
        title="Recent Applications"
        description="Latest candidate activity with quick actions."
        columns={columns}
        data={data.recentApplications}
        getRowId={(row) => row.id}
        emptyMessage={isLoading ? "Loading applications..." : "No recent applications available."}
      />
    </div>
  );
}
