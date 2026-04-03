"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { DeleteJobDialog } from "@/components/admin/jobs/delete-job-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiError } from "@/lib/api/http";
import { clearAuthToken } from "@/lib/auth/store";
import {
  deleteAdminJob,
  getAdminJobs,
  publishAdminJob,
  type AdminJob,
  type AdminJobsListResult as JobsListResult,
} from "@/lib/api/admin/jobs";
import type { JobStatus } from "@/lib/validators/jobs";

const PAGE_SIZE = 8;

type DeleteState = {
  open: boolean;
  job: AdminJob | null;
};

const emptyResult: JobsListResult = {
  items: [],
  page: 1,
  pageSize: PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

export function JobsTable() {
  const router = useRouter();
  const [data, setData] = useState<JobsListResult>(emptyResult);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<JobStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [deleteState, setDeleteState] = useState<DeleteState>({ open: false, job: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.max(1, data.totalPages || 1);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await getAdminJobs({
        search,
        status,
        page,
        pageSize: PAGE_SIZE,
      });

      setData(result);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Failed to load jobs.");
    } finally {
      setIsLoading(false);
    }
  }, [page, router, search, status]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pages = useMemo(() => {
    const values: number[] = [];

    for (let index = 1; index <= totalPages; index += 1) {
      values.push(index);
    }

    return values;
  }, [totalPages]);

  async function handleToggle(job: AdminJob) {
    const nextStatus: JobStatus = job.status === "published" ? "draft" : "published";

    try {
      const result = await publishAdminJob(job.id, {
        status: nextStatus,
      });
      toast.success(result.message);
      refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Unable to update job status.");
    }
  }

  async function handleDelete() {
    if (!deleteState.job) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteAdminJob(deleteState.job.id);
      toast.success(result.message);
      setDeleteState({ open: false, job: null });
      refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Unable to delete job.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  return (
    <Card className="surface-card">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="font-display text-2xl uppercase tracking-[0.08em]">Job Listings</CardTitle>
          <Button asChild>
            <Link href="/admin/jobs/new">Create Job</Link>
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by title or location"
              className="bg-background/50 pl-9"
            />
          </form>

          <select
            value={status}
            onChange={(event) => {
              const nextStatus = event.target.value as JobStatus | "all";
              setStatus(nextStatus);
              setPage(1);
            }}
            className="h-10 rounded-md border border-border/70 bg-background/50 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    Loading jobs...
                  </TableCell>
                </TableRow>
              ) : data.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    No jobs found.
                  </TableCell>
                </TableRow>
              ) : (
                data.items.map((job) => (
                  <TableRow key={job.id} className="border-border/60">
                    <TableCell className="font-medium text-foreground">{job.title}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.experience}</TableCell>
                    <TableCell className="uppercase">{job.type}</TableCell>
                    <TableCell className="uppercase text-xs tracking-[0.14em]">{job.status}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleToggle(job)}>
                          {job.status === "published" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/jobs/${job.id}/edit`}>Edit</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteState({ open: true, job })}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Showing page {data.page} of {totalPages} ({data.total} total)
          </p>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Prev
            </Button>
            {pages.slice(0, 7).map((pageNumber) => (
              <Button
                key={pageNumber}
                size="sm"
                variant={pageNumber === page ? "default" : "outline"}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>

      <DeleteJobDialog
        open={deleteState.open}
        jobTitle={deleteState.job?.title ?? "this job"}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteState({ open: false, job: null })}
      />
    </Card>
  );
}
