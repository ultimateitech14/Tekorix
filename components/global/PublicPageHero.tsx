import Link from "next/link";

import { Button } from "@/components/ui/button";

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
  return (
    <section className="relative overflow-hidden border-b border-[#BED9F3] bg-[#E6F1FF]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(220,238,255,0.96)_0%,rgba(207,227,255,0.98)_100%)]" />
      <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-[rgba(45,143,229,0.14)] blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[rgba(83,174,250,0.2)] blur-3xl" />

      <div className="site-container relative public-hero-space">
        <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <div className="max-w-3xl public-stack">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#1B66B3]">{eyebrow}</p>
              <h1 className="text-5xl font-bold leading-tight text-slate-900 md:text-6xl">{title}</h1>
              <p className="max-w-2xl text-base text-slate-600 leading-relaxed">{description}</p>
            </div>

            {primaryCta || secondaryCta ? (
              <div className="flex flex-wrap gap-3">
                {primaryCta ? (
                  <Button asChild size="lg" className="shadow-sm">
                    <Link href={primaryCta.href}>{primaryCta.label}</Link>
                  </Button>
                ) : null}

                {secondaryCta ? (
                  <Button asChild size="lg" variant="outline">
                    <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                  </Button>
                ) : null}
              </div>
            ) : null}

            {signals.length ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {signals.map((signal) => (
                  <div key={signal} className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] px-4 py-3 text-sm text-slate-600 leading-relaxed shadow-sm">
                    {signal}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-[#BED9F3] bg-[#F8FBFF] p-6 shadow-sm backdrop-blur-sm sm:p-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-600">{panelEyebrow}</p>
                <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">{panelTitle}</h2>
              </div>

              <div className="space-y-3">
                {panelItems.map((item, index) => (
                  <div key={item.title} className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] px-4 py-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span
                        className={index === 0
                          ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1B66B3] text-sm font-semibold text-white"
                          : "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDF5FF] text-sm font-semibold text-[#1B66B3]"}
                      >
                        0{index + 1}
                      </span>
                      <div className="space-y-2">
                        <p className="text-xl font-semibold text-slate-900">{item.title}</p>
                        <p className="text-base text-slate-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {panelNoteTitle && panelNoteDescription ? (
                <div className="rounded-xl border border-[#BED9F3] bg-[#EDF5FF] px-5 py-4 shadow-sm">
                  <p className="text-sm font-semibold text-[#1B66B3]">{panelNoteTitle}</p>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{panelNoteDescription}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

