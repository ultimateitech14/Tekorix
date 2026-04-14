import Link from "next/link";

import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

const heroSignals = [
  "Company and candidate inquiry paths in one place",
  "Direct routes for hiring, careers, and support conversations",
  "Enterprise tone with clear next steps",
];

export function ContactHero() {
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
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl public-stack">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.26em]" style={{ color: colors.primary }}>
                Contact
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Let&apos;s build something together.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Reach Tekorix for team-building, specialist hiring, career conversations, and direct delivery
                support. Use the path that matches what you need next.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="border-0 text-white shadow-[0_20px_40px_-22px_rgba(37,99,235,0.7)] hover:opacity-95"
                style={{ backgroundColor: colors.primary }}
              >
                <Link href="#company-inquiry">Company Inquiry</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#BED9F3] bg-[#F8FBFF] text-slate-950 hover:bg-[#E6F1FF] hover:text-slate-950"
              >
                <Link href="#candidate-inquiry">Candidate Inquiry</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#F8FBFF]/96 p-6 shadow-[0_34px_84px_-44px_rgba(15,23,42,0.32)] backdrop-blur-sm sm:p-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Trust-first contact flow
              </p>
              <h2 className="font-display text-2xl font-semibold text-slate-950 sm:text-3xl">
                One page for client requests, candidate outreach, and direct Tekorix contact.
              </h2>
            </div>

            <div className="mt-6 grid gap-3">
              {heroSignals.map((signal) => (
                <div
                  key={signal}
                  className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.34)]"
                >
                  {signal}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#EEF6FF] px-5 py-4 shadow-[inset_0_0_0_1px_rgba(190,217,243,0.85)]">
              <p className="text-sm font-semibold" style={{ color: colors.primary }}>
                Typical response pattern
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Start with the path that fits your need and the right Tekorix team can follow up with the
                next conversation, shortlist review, or support response.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

