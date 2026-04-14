"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { StatusChip } from "@/components/admin/status-chip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApiError } from "@/lib/api/http";
import { clearAuthToken } from "@/lib/auth/store";
import {
  deleteAdminJob,
  getAdminJobs,
  publishAdminJob,
  type AdminJob,
} from "@/lib/api/admin/jobs";
import type { JobStatus } from "@/lib/validators/jobs";

type JobRow = {
  id: string;
  title: string;
  department: string;
  country: string;
  location: string;
  type: string;
  status: string;
  updated: string;
};

const pageSize = 6;

function formatType(value: AdminJob["type"]) {
  if (value === "full-time") {
    return "Full-time";
  }

  if (value === "part-time") {
    return "Part-time";
  }

  return "Contract";
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toRow(job: AdminJob): JobRow {
  return {
    id: job.id,
    title: job.title,
    department: job.department || "General",
    country: job.country || "N/A",
    location: job.city === "Remote" ? "Remote" : job.city,
    type: formatType(job.type),
    status: job.status === "published" ? "Published" : job.status === "closed" ? "Closed" : "Draft",
    updated: formatDate(job.updatedAt),
  };
}

export default function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [country, setCountry] = useState("all");
  const [location, setLocation] = useState("all");
  const [department, setDepartment] = useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<AdminJob | null>(null);
  const [actionJobId, setActionJobId] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setIsLoading(true);

    try {
      const payload = await getAdminJobs({
        page: 1,
        pageSize: 500,
      });

      setJobs(payload.items);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Unable to load jobs.");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    setLocation("all");
    setPage(1);
  }, [country]);

  const countryOptions = useMemo(() => {
    return ["all", ...Array.from(new Set(jobs.map((job) => job.country).filter(Boolean)))];
  }, [jobs]);

  const locationOptions = useMemo(() => {
    const scoped = country === "all" ? jobs : jobs.filter((job) => job.country === country);

    return [
      "all",
      ...Array.from(
        new Set(
          scoped
            .map((job) => job.city || job.location)
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      ),
    ];
  }, [country, jobs]);

  const departmentOptions = useMemo(() => {
    return ["all", ...Array.from(new Set(jobs.map((job) => job.department || "General")))];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = search.toLowerCase();
      const haystack = [job.title, job.location, job.department, job.country, job.city].join(" ").toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesStatus = status === "all" || job.status === status;
      const matchesCountry = country === "all" || job.country === country;
      const matchesLocation =
        location === "all" ||
        job.location.toLowerCase() === location.toLowerCase() ||
        job.city.toLowerCase() === location.toLowerCase();
      const matchesDepartment =
        department === "all" || (job.department || "General").toLowerCase() === department.toLowerCase();

      return matchesSearch && matchesStatus && matchesCountry && matchesLocation && matchesDepartment;
    });
  }, [country, department, jobs, location, search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const startResult = filteredJobs.length ? (page - 1) * pageSize + 1 : 0;
  const endResult = Math.min(page * pageSize, filteredJobs.length);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, page]);

  async function handleTogglePublish(job: AdminJob) {
    const nextStatus: JobStatus = job.status === "published" ? "draft" : "published";
    setActionJobId(job.id);

    try {
      const result = await publishAdminJob(job.id, {
        status: nextStatus,
      });
      toast.success(result.message);
      await loadJobs();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Unable to update status.");
    } finally {
      setActionJobId(null);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    setActionJobId(deleteTarget.id);

    try {
      const result = await deleteAdminJob(deleteTarget.id);
      toast.success(result.message);
      setDeleteTarget(null);
      await loadJobs();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Unable to delete job.");
    } finally {
      setActionJobId(null);
    }
  }

  const columns: DataTableColumn<JobRow>[] = [
    {
      id: "title",
      header: "Title",
      cell: (row) => <p className="font-medium text-slate-900">{row.title}</p>,
    },
    {
      id: "department",
      header: "Department",
      cell: (row) => <span className="text-slate-600">{row.department}</span>,
    },
    {
      id: "location",
      header: "Location",
      cell: (row) => <span className="text-slate-600">{row.location}</span>,
    },
    {
      id: "type",
      header: "Type",
      cell: (row) => <span className="text-slate-600">{row.type}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusChip status={row.status} />,
    },
    {
      id: "updated",
      header: "Updated",
      cell: (row) => <span className="text-slate-600">{row.updated}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => {
        const source = jobs.find((job) => job.id === row.id);

        if (!source) {
          return null;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="text-slate-900 hover:bg-[#EDF5FF]">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#EDF5FF]">
                <Link href={`/admin/jobs/${row.id}/edit`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#EDF5FF]">
                <Link href={`/admin/jobs/${row.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer focus:bg-[#EDF5FF]"
                onClick={() => handleTogglePublish(source)}
                disabled={actionJobId === row.id}
              >
                {source.status === "published" ? "Unpublish" : "Publish"}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="cursor-pointer text-rose-200 focus:bg-rose-400/15 focus:text-rose-700"
                onClick={() => setDeleteTarget(source)}
                disabled={actionJobId === row.id}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const rows = paginatedJobs.map(toRow);

  return (
    <div className="space-y-4">
      <FiltersBar
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search jobs by title, location, or department"
        filters={[
          {
            label: "Status",
            value: status,
            onChange: (value) => {
              setStatus(value);
              setPage(1);
            },
            options: [
              { label: "All Statuses", value: "all" },
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
            ],
          },
          {
            label: "Country",
            value: country,
            onChange: setCountry,
            options: countryOptions.map((option) => ({
              label: option === "all" ? "All Countries" : option,
              value: option,
            })),
          },
          {
            label: "Location",
            value: location,
            onChange: (value) => {
              setLocation(value);
              setPage(1);
            },
            options: locationOptions.map((option) => ({
              label: option === "all" ? "All Locations" : option,
              value: option,
            })),
          },
          {
            label: "Department",
            value: department,
            onChange: (value) => {
              setDepartment(value);
              setPage(1);
            },
            options: departmentOptions.map((option) => ({
              label: option === "all" ? "All Departments" : option,
              value: option,
            })),
          },
        ]}
        extra={
          <Button asChild>
            <Link href="/admin/jobs/new">
              <Plus className="h-4 w-4" />
              Create Job
            </Link>
          </Button>
        }
      />

      <DataTable
        title="All Jobs"
        description="Manage openings, publishing status, and recruiter visibility."
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        emptyMessage={isLoading ? "Loading jobs..." : "No jobs match your filters."}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Showing {startResult}-{endResult} of {filteredJobs.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Prev
              </Button>
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <Button
                    key={pageNumber}
                    size="sm"
                    variant={pageNumber === page ? "default" : "outline"}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        }
      />

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription className="text-slate-500">
              This action removes{" "}
              <span className="font-medium text-slate-700">{deleteTarget?.title}</span> from the list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={Boolean(deleteTarget && actionJobId === deleteTarget.id)}
            >
              {deleteTarget && actionJobId === deleteTarget.id ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


