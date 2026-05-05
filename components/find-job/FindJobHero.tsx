import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

const heroSignals = [
  {
    icon: BriefcaseBusiness,
    text: "Real published product, SaaS, and engineering openings",
  },
  {
    icon: Building2,
    text: "On-roll and long-term delivery opportunities",
  },
  {
    icon: FileText,
    text: "A resume path even when no exact role is visible today",
  },
];

export function FindJobHero() {
  const { colors } = themeTokens;

  return (
    <section className="relative overflow-hidden border-b" style={{ backgroundColor: colors.page, borderColor: colors.border }}>
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(238,246,255,0.96) 0%, rgba(211,232,255,0.98) 100%)",
        }}
      />
      <div
        className="absolute -left-10 top-10 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(37,99,235,0.12)" }}
      />
      <div
        className="absolute right-0 top-0 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(96,165,250,0.18)" }}
      />

      <div className="site-container relative public-hero-space">
        <div className="max-w-4xl public-stack">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.26em]" style={{ color: colors.primary }}>
              Find a job
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Find a job with Tekorix and move toward stronger product engineering opportunities.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Explore real openings across product, SaaS, startup, and enterprise delivery teams, then
              apply directly or share your resume so Tekorix can support your next role with more
              structure and visibility.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="border-0 text-white shadow-[0_20px_40px_-22px_rgba(37,99,235,0.7)] hover:opacity-95"
              style={{ backgroundColor: colors.primary }}
            >
              <Link href="#published-jobs">View Published Jobs</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#BED9F3] bg-[#F8FBFF] text-slate-950 hover:bg-[#E6F1FF] hover:text-slate-950"
            >
              <Link href="#submit-resume">Submit Your Resume</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
            <span>Need more company, team, and growth context before applying?</span>
            <Link
              href="/careers"
              className="inline-flex items-center gap-1 font-semibold transition-colors hover:text-slate-950"
              style={{ color: colors.primary }}
            >
              Explore Careers Page
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div
            className="overflow-hidden rounded-[1.75rem] border bg-[#F8FBFF]/92 shadow-[0_24px_54px_-42px_rgba(15,23,42,0.24)] backdrop-blur-sm"
            style={{ borderColor: colors.border }}
          >
            <div className="grid divide-y divide-[#D7E8FA] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {heroSignals.map((signal) => (
                <div key={signal.text} className="flex h-full items-start gap-3 px-5 py-4 sm:px-6 sm:py-5">
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-[0_18px_34px_-22px_rgba(37,99,235,0.55)]"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <signal.icon className="h-4.5 w-4.5" />
                  </span>
                  <p className="text-sm font-medium leading-6 text-slate-700">{signal.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

