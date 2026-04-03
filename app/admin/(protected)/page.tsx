"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, ClipboardCheck, Clock3, Download, UserRoundCheck, Users } from "lucide-react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { StatCard } from "@/components/admin/StatCard";
import { StatusChip } from "@/components/admin/status-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ENABLE_ADMIN_LIGHTER_TYPE, ENABLE_ADMIN_UI_REFRESH } from "@/lib/ui-flags";
import { cn } from "@/lib/utils";

type ApplicationRow = {
  id: string;
  candidate: string;
  job: string;
  status: string;
  date: string;
};

const kpis = [
  { label: "Total Jobs", value: "42", detail: "12 active this week", icon: BriefcaseBusiness },
  { label: "Total Applications", value: "1,284", detail: "Up 16% from last month", icon: Users },
  { label: "Shortlisted", value: "248", detail: "Ready for interviews", icon: UserRoundCheck },
  { label: "Pending Review", value: "93", detail: "Awaiting recruiter action", icon: Clock3 },
];

const applicationsByDay = [
  { day: "Mon", count: 18 },
  { day: "Tue", count: 29 },
  { day: "Wed", count: 23 },
  { day: "Thu", count: 34 },
  { day: "Fri", count: 31 },
  { day: "Sat", count: 12 },
  { day: "Sun", count: 9 },
];

const distribution = [
  { name: "Pending Review", value: 93, color: "#7dd3fc" },
  { name: "Shortlisted", value: 248, color: "#fcd34d" },
  { name: "Rejected", value: 502, color: "#fda4af" },
  { name: "Interview", value: 112, color: "#c4b5fd" },
];

const recentApplications: ApplicationRow[] = [
  { id: "APP-9001", candidate: "Avery Collins", job: "Senior Frontend Engineer", status: "Shortlisted", date: "Feb 13, 2026" },
  { id: "APP-9002", candidate: "Liam Patel", job: "Product Designer", status: "Pending Review", date: "Feb 13, 2026" },
  { id: "APP-9003", candidate: "Noah Kim", job: "Backend Engineer", status: "Rejected", date: "Feb 12, 2026" },
  { id: "APP-9004", candidate: "Sophia Chen", job: "Talent Acquisition Lead", status: "Interview", date: "Feb 12, 2026" },
  { id: "APP-9005", candidate: "Mason Wright", job: "QA Engineer", status: "Pending Review", date: "Feb 11, 2026" },
];

const columns: DataTableColumn<ApplicationRow>[] = [
  {
    id: "candidate",
    header: "Candidate",
    cell: (row) => (
      <p className={cn("text-slate-100", ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold")}>
        {row.candidate}
      </p>
    ),
  },
  {
    id: "job",
    header: "Job role",
    cell: (row) => <p className="text-[0.9rem] text-slate-300">{row.job}</p>,
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <StatusChip status={row.status} />,
  },
  {
    id: "date",
    header: "Applied on",
    cell: (row) => <span className="text-[0.86rem] text-slate-300">{row.date}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <div className="flex justify-end gap-2">
        <Button asChild size="sm" variant="outline" className="h-8 text-[0.8rem] font-medium">
          <Link href={`/admin/applications/${row.id}`}>View</Link>
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-[0.8rem] font-medium">
          <ClipboardCheck className="h-4 w-4" />
          Shortlist
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-[0.8rem] font-medium text-rose-100 hover:text-rose-50">
          Reject
        </Button>
        <Button size="icon" variant="ghost" aria-label="Download resume">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function AdminDashboardPage() {
  const totalDistribution = distribution.reduce((sum, item) => sum + item.value, 0);
  const [chartsReady, setChartsReady] = useState(false);

  useEffect(() => {
    setChartsReady(true);
  }, []);

  return (
    <div className="space-y-5 md:space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} detail={item.detail} icon={item.icon} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <Card
          className={cn(
            "backdrop-blur-xl xl:col-span-3",
            ENABLE_ADMIN_UI_REFRESH
              ? "border-white/[0.12] bg-[linear-gradient(150deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))]"
              : "border-white/10 bg-white/5",
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className={cn("text-[1.2rem] text-white", ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold")}>
              Applications per day
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] pt-2 sm:h-[300px]">
            {chartsReady ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={applicationsByDay}>
                  <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "#0f1e32",
                      color: "#e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#f4c84c"
                    strokeWidth={2.5}
                    dot={{ fill: "#f4c84c", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-lg border border-white/10 bg-white/[0.03]" />
            )}
          </CardContent>
        </Card>

        <Card
          className={cn(
            "backdrop-blur-xl xl:col-span-2",
            ENABLE_ADMIN_UI_REFRESH
              ? "border-white/[0.12] bg-[linear-gradient(150deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))]"
              : "border-white/10 bg-white/5",
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className={cn("text-[1.2rem] text-white", ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold")}>
              Status distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pb-5 pt-2 sm:gap-3">
            <div className="h-[220px] sm:h-[240px]">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={92}
                      paddingAngle={2}
                    >
                      {distribution.map((entry) => (
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
                <div className="h-full w-full rounded-lg border border-white/10 bg-white/[0.03]" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {distribution.map((item) => (
                <div key={item.name} className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-2">
                  <p className="flex items-center gap-2 text-[0.8rem] text-slate-300">
                    <span className="inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </p>
                  <p className={cn("mt-1 text-[0.95rem] text-white", ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold")}>
                    {Math.round((item.value / totalDistribution) * 100)}%
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
        data={recentApplications}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
