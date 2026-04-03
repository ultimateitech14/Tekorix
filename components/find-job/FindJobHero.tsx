import Link from "next/link";

import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

const heroSignals = [
  "Real published product, SaaS, and engineering openings",
  "On-roll and long-term delivery opportunities",
  "A resume path even when no exact role is visible today",
];

const candidateSupport = [
  {
    title: "Published roles",
    description: "Browse current openings across product, SaaS, and enterprise delivery teams.",
  },
  {
    title: "Resume-first path",
    description: "Share your profile so Tekorix can review it for upcoming roles and delivery teams.",
  },
  {
    title: "Career guidance",
    description: "Use the page to understand fit, direction, and how to position your profile for stronger roles.",
  },
];

export function FindJobHero() {
  const { colors } = themeTokens;

  return (
    <section className="relative overflow-hidden border-b" style={{ backgroundColor: "#F8FAFC", borderColor: colors.border }}>
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,248,255,0.98) 100%)",
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

      <div className="site-container relative py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.26em]" style={{ color: colors.primary }}>
                Find a job
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Find a job with Tekorix and move toward stronger product engineering opportunities.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
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
                className="border-slate-300 bg-white text-slate-950 hover:bg-slate-50 hover:text-slate-950"
              >
                <Link href="#submit-resume">Submit Your Resume</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroSignals.map((signal) => (
                <div
                  key={signal}
                  className="rounded-2xl border bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_22px_48px_-40px_rgba(15,23,42,0.28)] backdrop-blur-sm"
                  style={{
                    borderColor: colors.border,
                  }}
                >
                  {signal}
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-[2rem] border bg-white/92 p-6 shadow-[0_32px_80px_-46px_rgba(15,23,42,0.26)] backdrop-blur-sm sm:p-8"
            style={{
              borderColor: colors.border,
            }}
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Candidate value path
                </p>
                <h2 className="font-display text-2xl font-semibold text-slate-950 sm:text-3xl">
                  Built for candidates who want a clearer, faster route into better delivery teams.
                </h2>
              </div>

              <div className="space-y-3">
                {candidateSupport.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border bg-slate-50/90 px-4 py-4"
                    style={{
                      borderColor: colors.border,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                        style={{
                          backgroundColor: index === 0 ? colors.primary : colors.surfaceMuted,
                          color: index === 0 ? colors.white : colors.primary,
                        }}
                      >
                        0{index + 1}
                      </span>
                      <div className="space-y-2">
                        <p className="text-base font-semibold text-slate-950">{item.title}</p>
                        <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

                <div
                  className="rounded-2xl border px-5 py-4"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.surfaceAlt,
                  }}
                >
                <p className="text-sm font-semibold" style={{ color: colors.primary }}>
                  Simple application path
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Review live published jobs, apply to a role, or drop your resume for future matching
                  without leaving the public Tekorix experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
