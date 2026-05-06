"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BriefcaseBusiness, CalendarDays, MapPin, Search, Wallet, X } from "lucide-react";

import { JobApplyDialog } from "@/components/site/jobs/JobApplyDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  JOBS_UPDATED_EVENT,
  JOBS_UPDATED_STORAGE_KEY,
  listPublicJobs,
  type PublicJob,
} from "@/lib/api/jobs";
import { ApiError } from "@/lib/api/http";
import { themeTokens } from "@/lib/theme/tokens";
import { cn } from "@/lib/utils";
import type { JobType } from "@/lib/validators/jobs";

const pageSize = 8;

type JobResultsViewProps = {
  basePath?: string;
  talentNetworkHref?: string;
};

type JobResultsState = {
  items: PublicJob[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const defaultState: JobResultsState = {
  items: [],
  page: 1,
  pageSize,
  total: 0,
  totalPages: 1,
};

const contractTypes: Array<{ value: JobType | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
];

function formatType(value: JobType) {
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

function formatPostedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function refNumber(id: string) {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}

export function JobResultsView({
  basePath = "/careers/job-results",
  talentNetworkHref = "/careers#submit-resume",
}: JobResultsViewProps) {
  const { colors } = themeTokens;
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchValueFromUrl = searchParams?.get("search")?.trim() ?? "";
  const locationValueFromUrl = searchParams?.get("location")?.trim() ?? "";
  const [queryInput, setQueryInput] = useState(searchValueFromUrl);
  const [query, setQuery] = useState(searchValueFromUrl);
  const [locationFilter, setLocationFilter] = useState(locationValueFromUrl);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [contractType, setContractType] = useState<JobType | "all">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobResultsState>(defaultState);
  const [activeJob, setActiveJob] = useState<PublicJob | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const triggerRefresh = () => setRefreshKey((current) => current + 1);
    const handleStorage = (event: StorageEvent) => {
      if (event.key === JOBS_UPDATED_STORAGE_KEY) {
        triggerRefresh();
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        triggerRefresh();
      }
    };

    window.addEventListener("focus", triggerRefresh);
    window.addEventListener("storage", handleStorage);
    window.addEventListener(JOBS_UPDATED_EVENT, triggerRefresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const interval = window.setInterval(triggerRefresh, 10_000);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", triggerRefresh);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(JOBS_UPDATED_EVENT, triggerRefresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setPage(1);
    setQueryInput(searchValueFromUrl);
    setQuery(searchValueFromUrl);
  }, [searchValueFromUrl]);

  useEffect(() => {
    setPage(1);
    setLocationFilter(locationValueFromUrl);
  }, [locationValueFromUrl]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setQuery(queryInput.trim());
    }, 280);

    return () => window.clearTimeout(timeout);
  }, [queryInput]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadJobs() {
      setLoading(true);
      setError(null);
      const mergedSearch = [query, locationFilter].filter((value) => Boolean(value.trim())).join(" ").trim();

      try {
        const data = await listPublicJobs(
          {
            search: mergedSearch || undefined,
            type: contractType,
            remoteOnly,
            page,
            pageSize,
          },
          { signal: controller.signal },
        );

        if (controller.signal.aborted) {
          return;
        }

        setResult({
          items: data.items,
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: Math.max(1, data.totalPages),
        });
        setError(null);
      } catch (errorValue) {
        if (
          controller.signal.aborted ||
          (errorValue instanceof Error && errorValue.name === "AbortError")
        ) {
          return;
        }

        if (errorValue instanceof ApiError && errorValue.message) {
          setError(errorValue.message);
        } else if (errorValue instanceof Error) {
          setError(errorValue.message);
        } else {
          setError("Unable to load job results.");
        }

        setResult(defaultState);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadJobs();

    return () => controller.abort();
  }, [query, locationFilter, contractType, remoteOnly, page, refreshKey]);

  const pages = useMemo(() => {
    return Array.from({ length: result.totalPages }, (_, index) => index + 1);
  }, [result.totalPages]);

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {result.total} Current Openings
          </h2>
          {locationFilter ? (
            <p className="mt-1 text-sm text-slate-600">Location filter applied: {locationFilter}</p>
          ) : (
            <p className="mt-1 text-sm text-slate-600">
              Explore live published roles and apply directly through the current Tekorix workflow.
            </p>
          )}
        </div>
        <Button
          asChild
          className="rounded-xl border-0 px-6 text-white shadow-[0_18px_36px_-20px_rgba(37,99,235,0.6)] hover:opacity-95"
          variant="secondary"
          style={{ backgroundColor: colors.primary }}
        >
          <Link href={talentNetworkHref}>Join our Talent Network</Link>
        </Button>
      </div>

      <div className="grid gap-7 xl:grid-cols-[320px_1fr]">
        <aside className="self-start xl:sticky xl:top-24">
          <Card className="overflow-hidden rounded-[1.5rem] border-slate-200 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)]">
            <div className="h-1.5" style={{ backgroundColor: colors.primary }} />
            <CardContent className="p-0">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-slate-950">Filters</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                    Refine published roles
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    router.push(basePath);
                    setQueryInput("");
                    setQuery("");
                    setLocationFilter("");
                    setRemoteOnly(false);
                    setContractType("all");
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                >
                  Reset
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-0">
                <div className="border-b border-slate-200 px-6 py-6">
                  <p className="text-sm font-semibold tracking-[0.01em] text-slate-700">Keyword</p>
                  <div className="relative mt-3">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      value={queryInput}
                      onChange={(event) => setQueryInput(event.target.value)}
                      placeholder="Job title, keyword, or skill"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-9 text-slate-900 placeholder:text-slate-500 transition hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-[#2563EB]/15"
                    />
                  </div>
                </div>

                <div className="border-b border-slate-200 px-6 py-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold tracking-[0.01em] text-slate-700">Remote jobs</p>
                      <p className="mt-1 text-xs text-slate-500">Focus on remote-ready openings only.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPage(1);
                        setRemoteOnly((current) => !current);
                      }}
                      className={cn(
                        "relative h-9 w-16 rounded-full border transition",
                        remoteOnly ? "text-white" : "border-slate-300 bg-slate-200",
                      )}
                      style={remoteOnly ? { borderColor: colors.primary, backgroundColor: colors.primary } : undefined}
                      aria-pressed={remoteOnly}
                      aria-label="Toggle remote jobs"
                    >
                      <span
                        className={cn(
                          "absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white transition-all",
                          remoteOnly ? "left-8" : "left-1",
                        )}
                      />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  {locationFilter ? (
                    <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                      Location filter: {locationFilter}
                    </div>
                  ) : null}
                  <p className="text-sm font-semibold tracking-[0.01em] text-slate-700">Contract Type</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {contractTypes.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setPage(1);
                          setContractType(option.value);
                        }}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.01em] transition",
                          contractType === option.value
                            ? "text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-400",
                        )}
                        style={
                          contractType === option.value
                            ? { borderColor: colors.primary, backgroundColor: colors.primary }
                            : undefined
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-4">
          {loading ? (
            <Card className="rounded-[1.5rem] border-slate-200 bg-white">
              <CardContent className="p-7 text-sm text-slate-600">Loading job listings...</CardContent>
            </Card>
          ) : error ? (
            <Card className="rounded-[1.5rem] border-red-300 bg-white">
              <CardContent className="space-y-3 p-7">
                <p className="text-sm font-semibold tracking-[0.01em] text-red-700">Unable to load jobs</p>
                <p className="text-sm text-slate-700">{error}</p>
              </CardContent>
            </Card>
          ) : result.items.length === 0 ? (
            <Card className="rounded-[1.5rem] border-slate-200 bg-white">
              <CardContent className="space-y-4 p-7">
                <p className="text-sm font-semibold tracking-[0.01em] text-slate-700">No results</p>
                <p className="text-sm leading-6 text-slate-600">
                  Try adjusting your filters, or submit your resume so Tekorix can review your profile for
                  upcoming roles.
                </p>
                <Button
                  asChild
                  className="rounded-xl border-0 text-white shadow-[0_18px_36px_-20px_rgba(37,99,235,0.6)] hover:opacity-95"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Link href={talentNetworkHref}>Submit your resume</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            result.items.map((job) => (
              <article
                key={job.id}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.35)]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]" style={{ backgroundColor: colors.surfaceAlt, color: colors.primary }}>
                        Ref {refNumber(job.id)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                        {formatType(job.type)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                        {job.department}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        {job.title}
                      </h3>
                      <p className="max-w-3xl text-sm leading-7 text-slate-600">{job.description}</p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="rounded-xl border-0 px-6 text-white shadow-[0_18px_36px_-20px_rgba(37,99,235,0.6)] hover:opacity-95"
                    style={{ backgroundColor: colors.primary }}
                    onClick={() => setActiveJob(job)}
                  >
                    Apply Now
                  </Button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      <MapPin className="h-4 w-4" />
                      Location
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{job.location}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      <BriefcaseBusiness className="h-4 w-4" />
                      Experience
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{job.experience}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      Posted
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {formatPostedDate(job.publishedAt ?? job.updatedAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      <Wallet className="h-4 w-4" />
                      Salary
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{job.salaryRange || "As per fitment"}</p>
                  </div>
                </div>

                {job.skills?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.skills.slice(0, 6).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))
          )}

          {!loading && !error && result.totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-sm font-medium tracking-[0.01em] text-slate-600">
                Page {result.page} of {result.totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-slate-300 text-slate-800 hover:bg-slate-100"
                  disabled={result.page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Prev
                </Button>
                {pages.map((pageValue) => (
                  <Button
                    key={pageValue}
                    variant={pageValue === result.page ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "rounded-xl",
                      pageValue === result.page
                        ? "text-white hover:opacity-95"
                        : "border-slate-300 text-slate-800 hover:bg-slate-100",
                    )}
                    style={pageValue === result.page ? { backgroundColor: colors.primary } : undefined}
                    onClick={() => setPage(pageValue)}
                  >
                    {pageValue}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-slate-300 text-slate-800 hover:bg-slate-100"
                  disabled={result.page >= result.totalPages}
                  onClick={() => setPage((current) => Math.min(result.totalPages, current + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <JobApplyDialog
        job={activeJob}
        open={Boolean(activeJob)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setActiveJob(null);
          }
        }}
      />
    </div>
  );
}
