import { Suspense } from "react";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { JobResultsView } from "@/components/site/jobs/JobResultsView";
import { JobSearchPanel } from "@/components/site/jobs/JobSearchPanel";
import { themeTokens } from "@/lib/theme/tokens";

const sectionSignals = [
  {
    label: "Live source",
    value: "Published jobs only",
  },
  {
    label: "Application path",
    value: "Direct apply flow",
  },
  {
    label: "Fallback route",
    value: "Resume submission below",
  },
];

export function FindJobPublished() {
  const { colors } = themeTokens;

  return (
    <section
      id="published-jobs"
      className="py-16 sm:py-20"
      style={{ backgroundColor: colors.surfaceAlt }}
    >
      <div className="site-container space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <HomeSectionHeading
            eyebrow="Published jobs"
            title="Browse active published openings from the Tekorix jobs experience."
            description="Search, filter, and apply from the same public job-search journey so candidates can move from discovery to application without friction."
          />

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[520px]">
            {sectionSignals.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border bg-white px-4 py-4 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.35)]"
                style={{ borderColor: colors.border }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-[2rem] border bg-white p-4 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.18)] sm:p-6"
          style={{ borderColor: colors.border }}
        >
          <Suspense fallback={<div className="h-[68px] rounded-2xl border border-slate-200 bg-slate-50" />}>
            <JobSearchPanel basePath="/find-job" />
          </Suspense>
        </div>

        <div
          className="rounded-[2rem] border bg-white p-5 shadow-[0_28px_80px_-54px_rgba(15,23,42,0.4)] sm:p-7"
          style={{ borderColor: colors.border }}
        >
          <Suspense fallback={<p className="text-sm text-slate-600">Loading published jobs...</p>}>
            <JobResultsView basePath="/find-job" talentNetworkHref="/find-job#submit-resume" />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
