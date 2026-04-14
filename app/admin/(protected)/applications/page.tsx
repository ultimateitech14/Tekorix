"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { StatusChip } from "@/components/admin/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { JobApplicationStatus } from "@/lib/validators/job-applications";

type ApplicationStatusFilter = JobApplicationStatus | "all";

type AdminApplication = {
  id: string;
  fullName: string;
  jobTitle: string;
  status: JobApplicationStatus;
  createdAt: string;
  isRead: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function parseStatusFilter(value: string | null): ApplicationStatusFilter {
  if (
    value === "pending review" ||
    value === "shortlisted" ||
    value === "rejected" ||
    value === "interview"
  ) {
    return value;
  }

  return "all";
}

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
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return dateFormatter.format(date);
}

function ApplicationsPageContent() {
  const router = useRouter();
  const pathname = usePathname() ?? "/admin/applications";
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<AdminApplication[]>([]);
  const [search, setSearch] = useState("");
  const [job, setJob] = useState("all");
  const [status, setStatus] = useState<ApplicationStatusFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statusFromUrl = parseStatusFilter(searchParams?.get("status") ?? null);

  useEffect(() => {
    setStatus(statusFromUrl);
  }, [statusFromUrl]);

  useEffect(() => {
    let active = true;

    async function loadApplications() {
      try {
        const response = await fetch("/api/admin/job-applications", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Unable to load applications.");
        }

        const payload = (await response.json()) as { items?: AdminApplication[] };

        if (active) {
          setRows(payload.items ?? []);
        }
      } catch {
        if (active) {
          setRows([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadApplications();
    const timer = window.setInterval(loadApplications, 15000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const jobOptions = useMemo(() => {
    return ["all", ...Array.from(new Set(rows.map((item) => item.jobTitle)))];
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const rowDate = new Date(row.createdAt);
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        row.fullName.toLowerCase().includes(normalizedSearch) ||
        row.jobTitle.toLowerCase().includes(normalizedSearch);
      const matchesJob = job === "all" || row.jobTitle === job;
      const matchesStatus = status === "all" || row.status === status;
      const matchesFrom = !dateFrom || rowDate >= new Date(`${dateFrom}T00:00:00`);
      const matchesTo = !dateTo || rowDate <= new Date(`${dateTo}T23:59:59`);

      return matchesSearch && matchesJob && matchesStatus && matchesFrom && matchesTo;
    });
  }, [dateFrom, dateTo, job, rows, search, status]);

  async function updateStatus(applicationId: string, nextStatus: JobApplicationStatus) {
    setUpdatingId(applicationId);

    try {
      const response = await fetch("/api/admin/job-applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: applicationId,
          status: nextStatus,
        }),
      });

      const payload = (await response.json()) as { success?: boolean; message?: string; item?: AdminApplication };

      if (!response.ok || !payload.success) {
        toast.error(payload.message ?? "Unable to update application status.");
        return;
      }

      if (payload.item) {
        setRows((current) => current.map((item) => (item.id === payload.item?.id ? payload.item : item)));
      } else {
        setRows((current) =>
          current.map((item) => (item.id === applicationId ? { ...item, status: nextStatus, isRead: true } : item)),
        );
      }

      toast.success(`Application marked as ${formatStatusLabel(nextStatus)}.`);
    } catch {
      toast.error("Unable to update application status.");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleStatusFilterChange(value: string) {
    const nextStatus = parseStatusFilter(value);
    setStatus(nextStatus);

    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (nextStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  const columns: DataTableColumn<AdminApplication>[] = [
    {
      id: "candidate",
      header: "Candidate",
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.fullName}</p>
          <p className="text-xs text-slate-500">{row.id}</p>
        </div>
      ),
    },
    {
      id: "job",
      header: "Job",
      cell: (row) => <span className="text-slate-600">{row.jobTitle}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusChip status={formatStatusLabel(row.status)} />,
    },
    {
      id: "date",
      header: "Date",
      cell: (row) => <span className="text-slate-600">{formatDate(row.createdAt)}</span>,
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
          <Button
            size="sm"
            variant="outline"
            disabled={updatingId === row.id || row.status === "shortlisted"}
            onClick={() => updateStatus(row.id, "shortlisted")}
          >
            Shortlist
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-rose-700 hover:text-rose-800"
            disabled={updatingId === row.id || row.status === "rejected"}
            onClick={() => updateStatus(row.id, "rejected")}
          >
            Reject
          </Button>
          <Button asChild size="icon" variant="ghost" aria-label="Download resume">
            <a href={`/api/admin/job-applications/${row.id}/resume`}>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <FiltersBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by candidate or job title"
        filters={[
          {
            label: "Job",
            value: job,
            onChange: setJob,
            options: jobOptions.map((option) => ({
              label: option === "all" ? "All Jobs" : option,
              value: option,
            })),
          },
          {
            label: "Status",
            value: status,
            onChange: handleStatusFilterChange,
            options: [
              { label: "All Statuses", value: "all" },
              { label: "Pending Review", value: "pending review" },
              { label: "Shortlisted", value: "shortlisted" },
              { label: "Rejected", value: "rejected" },
              { label: "Interview", value: "interview" },
            ],
          },
        ]}
        extra={
          <>
            <Input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="w-[154px] border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              className="w-[154px] border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
            />
          </>
        }
      />

      <DataTable
        title="Applications"
        description="Track candidate progress and update outcomes."
        columns={columns}
        data={filteredRows}
        getRowId={(row) => row.id}
        emptyMessage={isLoading ? "Loading applications..." : "No applications match your filters."}
      />
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<div className="space-y-4">Loading applications...</div>}>
      <ApplicationsPageContent />
    </Suspense>
  );
}



