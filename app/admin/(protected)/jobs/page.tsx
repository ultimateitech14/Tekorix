"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { StatusChip } from "@/components/admin/status-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  getAdminJobsMetadata,
  publishAdminJob,
  type AdminJob,
  type AdminJobsMetadata,
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

  if (value === "contract") {
    return "Contract";
  }

  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
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

function AdminJobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCategoriesView = (searchParams?.get("view") ?? "") === "categories";
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [metadata, setMetadata] = useState<AdminJobsMetadata | null>(null);
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
      const [payload, meta] = await Promise.all([
        getAdminJobs({
          page: 1,
          pageSize: 100,
        }),
        getAdminJobsMetadata(),
      ]);

      setJobs(payload.items);
      setMetadata(meta);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Unable to load jobs.");
      setJobs([]);
      setMetadata(null);
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
              <Button
                size="icon"
                variant="ghost"
                className="text-slate-900 hover:bg-[#EDF5FF] hover:text-slate-900 data-[state=open]:bg-[#EDF5FF] data-[state=open]:text-slate-900"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
              <DropdownMenuItem asChild className="cursor-pointer text-slate-900 focus:bg-[#EDF5FF] focus:text-slate-900 data-[highlighted]:bg-[#EDF5FF] data-[highlighted]:text-slate-900">
                <Link href={`/admin/jobs/${row.id}/edit`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer text-slate-900 focus:bg-[#EDF5FF] focus:text-slate-900 data-[highlighted]:bg-[#EDF5FF] data-[highlighted]:text-slate-900">
                <Link href={`/admin/jobs/${row.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-slate-900 focus:bg-[#EDF5FF] focus:text-slate-900 data-[highlighted]:bg-[#EDF5FF] data-[highlighted]:text-slate-900"
                onClick={() => handleTogglePublish(source)}
                disabled={actionJobId === row.id}
              >
                {source.status === "published" ? "Unpublish" : "Publish"}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#D4E8FC]" />
              <DropdownMenuItem
                className="cursor-pointer text-rose-600 focus:bg-rose-100 focus:text-rose-700 data-[highlighted]:bg-rose-100 data-[highlighted]:text-rose-700 disabled:text-rose-300"
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
  const summary = metadata ?? {
    totalJobs: 0,
    publishedJobs: 0,
    draftJobs: 0,
    closedJobs: 0,
    departments: [],
    countries: [],
    locations: [],
    skills: [],
    jobTypes: [],
  };

  return (
    <div className="space-y-4">
      {isCategoriesView ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3 rounded-3xl border border-[#D4E8FC] bg-[#F8FBFF] p-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Categories & Tags</h2>
              <p className="mt-1 text-sm text-slate-500">
                Live breakdown of departments, skills, locations, and job types from the jobs backend.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link href="/admin/jobs">Back to Jobs</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/jobs/new">
                  <Plus className="h-4 w-4" />
                  Create Job
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="border-[#D4E8FC] bg-[#F8FBFF]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-500">Total Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-slate-900">{summary.totalJobs}</p>
              </CardContent>
            </Card>
            <Card className="border-[#D4E8FC] bg-[#F8FBFF]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-500">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-slate-900">{summary.publishedJobs}</p>
              </CardContent>
            </Card>
            <Card className="border-[#D4E8FC] bg-[#F8FBFF]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-500">Draft</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-slate-900">{summary.draftJobs}</p>
              </CardContent>
            </Card>
            <Card className="border-[#D4E8FC] bg-[#F8FBFF]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-500">Closed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-slate-900">{summary.closedJobs}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="border-[#D4E8FC] bg-[#F8FBFF]">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Departments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(summary.departments.length ? summary.departments : []).slice(0, 8).map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-3 rounded-xl border border-[#D4E8FC] px-3 py-2">
                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">
                        {item.published} published, {item.draft} draft, {item.closed} closed
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{item.total}</p>
                  </div>
                ))}
                {!summary.departments.length ? <p className="text-sm text-slate-500">{isLoading ? "Loading departments..." : "No departments found."}</p> : null}
              </CardContent>
            </Card>

            <Card className="border-[#D4E8FC] bg-[#F8FBFF]">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Top Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(summary.skills.length ? summary.skills : []).slice(0, 10).map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-3 rounded-xl border border-[#D4E8FC] px-3 py-2">
                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">
                        {item.published} published, {item.draft} draft, {item.closed} closed
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{item.total}</p>
                  </div>
                ))}
                {!summary.skills.length ? <p className="text-sm text-slate-500">{isLoading ? "Loading tags..." : "No skills/tags found."}</p> : null}
              </CardContent>
            </Card>

            <Card className="border-[#D4E8FC] bg-[#F8FBFF]">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Countries & Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {(summary.countries.length ? summary.countries : []).slice(0, 6).map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-3 rounded-xl border border-[#D4E8FC] px-3 py-2">
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-lg font-semibold text-slate-900">{item.total}</p>
                    </div>
                  ))}
                  {!summary.countries.length ? <p className="text-sm text-slate-500">{isLoading ? "Loading countries..." : "No country data found."}</p> : null}
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {summary.locations.slice(0, 8).map((item) => (
                    <div key={item.key} className="rounded-xl border border-[#D4E8FC] px-3 py-2 text-sm text-slate-700">
                      <span className="font-medium text-slate-900">{item.label}</span> ({item.total})
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#D4E8FC] bg-[#F8FBFF]">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Job Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {summary.jobTypes.map((item) => (
                  <div key={item.type} className="flex items-center justify-between gap-3 rounded-xl border border-[#D4E8FC] px-3 py-2">
                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">
                        {item.published} published, {item.draft} draft, {item.closed} closed
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{item.total}</p>
                  </div>
                ))}
                {!summary.jobTypes.length ? <p className="text-sm text-slate-500">{isLoading ? "Loading job types..." : "No job type data found."}</p> : null}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}

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

export default function AdminJobsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading jobs...</p>}>
      <AdminJobsPageContent />
    </Suspense>
  );
}


