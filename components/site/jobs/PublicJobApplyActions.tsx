"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Send } from "lucide-react";

import type { PublicJob } from "@/lib/api/jobs";
import { JobApplyDialog } from "@/components/site/jobs/JobApplyDialog";
import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";
import { formatPublicJobReference } from "@/lib/public-jobs";

type PublicJobApplyActionsProps = {
  job: PublicJob;
};

export function PublicJobApplyActions({ job }: PublicJobApplyActionsProps) {
  const { colors } = themeTokens;
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="space-y-6 rounded-[1.75rem] border border-slate-200 bg-[#F8FBFF] p-6 shadow-[0_24px_56px_-42px_rgba(15,23,42,0.3)]">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1B66B3]">Apply now</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Move directly into the current hiring flow.</h2>
          <p className="text-sm leading-7 text-slate-600">
            Apply for this role now, or submit your resume to stay visible for related openings from Tekorix.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            className="w-full rounded-xl border-0 px-6 text-white shadow-[0_18px_36px_-20px_rgba(37,99,235,0.6)] hover:opacity-95"
            style={{ backgroundColor: colors.primary }}
            onClick={() => setOpen(true)}
          >
            <Send className="mr-2 h-4 w-4" />
            Apply for this role
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full rounded-xl border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
          >
            <Link href="/find-job#submit-resume">
              <FileText className="mr-2 h-4 w-4" />
              Submit resume instead
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-600">
          <p className="font-semibold text-slate-900">Reference Number {formatPublicJobReference(job.id)}</p>
          <p className="mt-2">
            Use this role reference during recruiter follow-up, resume submission, or interview coordination.
          </p>
        </div>

        <Link
          href="/careers/job-results"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B66B3] transition-colors hover:text-[#145188]"
        >
          Browse more published jobs
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <JobApplyDialog job={job} open={open} onOpenChange={setOpen} />
    </>
  );
}
