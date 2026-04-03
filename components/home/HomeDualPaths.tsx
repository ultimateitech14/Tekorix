import Link from "next/link";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
import { navigationCtas } from "@/lib/constants/navigation";
import { themeTokens } from "@/lib/theme/tokens";

const companyPoints = [
  "Dedicated hiring lanes for specialist roles",
  "Rapid GCC and product pod setup",
  "Flexible staffing, team building, and managed support",
];

const specialistPoints = [
  "Roles across product, data, cloud, and AI",
  "Longer-term enterprise programmes",
  "Career mobility with vetted client teams",
];

export function HomeDualPaths() {
  const { colors } = themeTokens;

  return (
    <section className="py-16 sm:py-20" style={{ backgroundColor: colors.page }}>
      <div className="site-container space-y-10">
        <HomeSectionHeading
          eyebrow="Two clear journeys"
          title="Choose the path that matches your next move."
          description="Tekorix is designed for both hiring leaders building teams and specialists looking for high-impact opportunities."
          align="center"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <article
            className="rounded-[2rem] border p-8 shadow-[0_24px_60px_-42px_rgba(62,127,193,0.18)]"
            style={{
              borderColor: colors.border,
              background: "linear-gradient(180deg, rgba(248,251,255,0.98) 0%, rgba(230,240,255,0.94) 100%)",
            }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: colors.primary }}>
              For companies
            </p>
            <h3 className="mt-4 font-display text-3xl font-semibold text-slate-950">Hire Talent</h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Build specialist benches, dedicated engineering teams, and capability center extensions with a
              delivery model designed around speed, quality, and continuity.
            </p>
            <div className="mt-6 grid gap-3">
              {companyPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border px-4 py-3 text-sm text-slate-700"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: "rgba(248,251,255,0.88)",
                  }}
                >
                  {point}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="border-0 text-white shadow-[0_22px_44px_-22px_rgba(62,127,193,0.52)] hover:opacity-95"
                style={{ backgroundColor: colors.primary }}
              >
                <Link href={navigationCtas.hireTalent.href}>{navigationCtas.hireTalent.label}</Link>
              </Button>
            </div>
          </article>

          <article
            className="rounded-[2rem] border p-8 shadow-[0_24px_60px_-42px_rgba(62,127,193,0.14)]"
            style={{
              backgroundColor: colors.surfaceCard,
              borderColor: colors.border,
            }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-600">For specialists</p>
            <h3 className="mt-4 font-display text-3xl font-semibold text-slate-950">Find a Job</h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Explore roles with clients building modern products, cloud platforms, intelligent systems, and
              enterprise transformation programmes.
            </p>
            <div className="mt-6 grid gap-3">
              {specialistPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border px-4 py-3 text-sm text-slate-700"
                  style={{ borderColor: colors.border, backgroundColor: colors.white }}
                >
                  {point}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white text-slate-950 hover:bg-slate-50"
                style={{ borderColor: colors.border }}
              >
                <Link href={navigationCtas.findJob.href}>{navigationCtas.findJob.label}</Link>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
