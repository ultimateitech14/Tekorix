import Link from "next/link";

import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

const heroSignals = [
  "On-roll consultants managed by Tekorix",
  "Dedicated product teams and delivery pods",
  "Permanent, contractual, and hourly hiring models",
];

export function FindTalentHero() {
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
              Find talent
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Build product teams, add specialist talent, and scale delivery with Tekorix.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Tekorix helps companies hire permanent talent, deploy on-roll consultants, and assemble
              dedicated engineering teams with HR, payroll, and compliance coordination already covered.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="border-0 text-white shadow-[0_20px_40px_-22px_rgba(37,99,235,0.7)] hover:opacity-95"
              style={{ backgroundColor: colors.primary }}
            >
              <Link href="#company-lead-form">I Need a Team</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#BED9F3] bg-[#F8FBFF] text-slate-950 hover:bg-[#E6F1FF] hover:text-slate-950"
            >
              <Link href="/contact">Talk to Us</Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {heroSignals.map((signal) => (
              <div
                key={signal}
                className="rounded-2xl border bg-[#F8FBFF]/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_22px_48px_-40px_rgba(15,23,42,0.28)] backdrop-blur-sm"
                style={{
                  borderColor: colors.border,
                }}
              >
                {signal}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

