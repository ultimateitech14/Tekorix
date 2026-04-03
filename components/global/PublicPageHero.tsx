import Link from "next/link";

import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

type HeroAction = {
  label: string;
  href: string;
};

type HeroPanelItem = {
  title: string;
  description: string;
};

type PublicPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: HeroAction;
  secondaryCta?: HeroAction;
  signals?: string[];
  panelEyebrow: string;
  panelTitle: string;
  panelItems: HeroPanelItem[];
  panelNoteTitle?: string;
  panelNoteDescription?: string;
};

export function PublicPageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  signals = [],
  panelEyebrow,
  panelTitle,
  panelItems,
  panelNoteTitle,
  panelNoteDescription,
}: PublicPageHeroProps) {
  const { colors } = themeTokens;

  return (
    <section className="relative overflow-hidden border-b" style={{ backgroundColor: "#F8FAFC", borderColor: colors.border }}>
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,248,255,0.96) 100%)",
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
                {eyebrow}
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">{description}</p>
            </div>

            {primaryCta || secondaryCta ? (
              <div className="flex flex-wrap gap-3">
                {primaryCta ? (
                  <Button
                    asChild
                    size="lg"
                    className="border-0 text-white shadow-[0_20px_40px_-22px_rgba(37,99,235,0.7)] hover:opacity-95"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Link href={primaryCta.href}>{primaryCta.label}</Link>
                  </Button>
                ) : null}

                {secondaryCta ? (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-slate-300 bg-white text-slate-950 hover:bg-slate-50 hover:text-slate-950"
                  >
                    <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                  </Button>
                ) : null}
              </div>
            ) : null}

            {signals.length ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {signals.map((signal) => (
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
            ) : null}
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
                  {panelEyebrow}
                </p>
                <h2 className="font-display text-2xl font-semibold text-slate-950 sm:text-3xl">
                  {panelTitle}
                </h2>
              </div>

              <div className="space-y-3">
                {panelItems.map((item, index) => (
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

              {panelNoteTitle && panelNoteDescription ? (
                <div
                  className="rounded-2xl border px-5 py-4"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.surfaceAlt,
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: colors.primary }}>
                    {panelNoteTitle}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{panelNoteDescription}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
