import Link from "next/link";

import { Button } from "@/components/ui/button";
import { navigationCtas } from "@/lib/constants/navigation";
import { themeTokens } from "@/lib/theme/tokens";

const heroHighlights = [
  {
    title: "Product engineering teams",
    description: "Cross-functional squads for platform, product, and release execution.",
  },
  {
    title: "Capability center setup",
    description: "Launch GCC pods with governance, ramp plans, and delivery coverage from day one.",
  },
  {
    title: "Specialist hiring pipelines",
    description: "Access vetted cloud, data, AI, and software talent aligned to active roadmap needs.",
  },
];

const heroSignals = ["Consulting to delivery", "Cloud, data, AI, and product", "Built for global programmes"];

export function HomeHero() {
  const { colors } = themeTokens;

  return (
    <section className="relative overflow-hidden border-b" style={{ backgroundColor: colors.page, borderColor: colors.border }}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 14% 18%, rgba(111,175,232,0.28) 0%, rgba(111,175,232,0.08) 28%, transparent 52%),
            radial-gradient(circle at 86% 14%, rgba(62,127,193,0.18) 0%, rgba(62,127,193,0.05) 24%, transparent 44%),
            linear-gradient(180deg, #F8FBFF 0%, #EEF5FF 56%, #E6F0FF 100%)`,
        }}
      />
      <div
        className="absolute -left-14 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(111,175,232,0.2)" }}
      />
      <div
        className="absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(62,127,193,0.14)" }}
      />

      <div className="site-container relative py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.26em]" style={{ color: colors.primary }}>
                Tekorix talent and engineering services
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Build product engineering teams, capability centers, and specialist pipelines with one
                delivery partner.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Tekorix helps enterprises stand up GCC extensions, assemble vetted specialists, and scale
                product engineering delivery across cloud, data, AI, and modern platforms.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="border-0 text-white shadow-[0_22px_44px_-22px_rgba(62,127,193,0.55)] hover:opacity-95"
                  style={{ backgroundColor: colors.primary }}
                >
                <Link href={navigationCtas.hireTalent.href}>{navigationCtas.hireTalent.label}</Link>
              </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-slate-950 hover:bg-white hover:text-slate-950"
                  style={{ borderColor: colors.border, backgroundColor: "rgba(248,251,255,0.86)" }}
                >
                <Link href={navigationCtas.findJob.href}>{navigationCtas.findJob.label}</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroSignals.map((signal) => (
                <div
                  key={signal}
                  className="rounded-2xl border px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_22px_48px_-38px_rgba(62,127,193,0.18)] backdrop-blur-sm"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: "rgba(248,251,255,0.92)",
                  }}
                >
                  {signal}
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-[2rem] border p-6 shadow-[0_32px_80px_-44px_rgba(62,127,193,0.2)] backdrop-blur-sm sm:p-8"
            style={{
              borderColor: colors.border,
              background:
                "linear-gradient(180deg, rgba(248,251,255,0.98) 0%, rgba(230,240,255,0.92) 100%)",
            }}
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Delivery focus
                </p>
                <h2 className="font-display text-2xl font-semibold text-slate-950 sm:text-3xl">
                  Structured around real hiring and team-building outcomes.
                </h2>
              </div>

              <div className="space-y-4">
                {heroHighlights.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: colors.border,
                      background: "linear-gradient(180deg, rgba(248,251,255,0.98) 0%, rgba(220,235,251,0.82) 100%)",
                    }}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                        style={{
                          backgroundColor: index === 1 ? colors.primary : colors.accent,
                          color: index === 1 ? colors.white : colors.primary,
                        }}
                      >
                        0{index + 1}
                      </span>
                      <p className="text-base font-semibold text-slate-950">{item.title}</p>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>

                <div
                  className="rounded-2xl border px-5 py-4"
                  style={{
                    borderColor: colors.border,
                    background: "linear-gradient(180deg, rgba(230,240,255,0.96) 0%, rgba(220,235,251,0.88) 100%)",
                  }}
                >
                <p className="text-sm font-semibold" style={{ color: colors.primary }}>
                  Built for enterprise pacing
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  From initial discovery to sustained programme support, Tekorix is positioned for both
                  targeted specialist hiring and larger team-based execution models.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
