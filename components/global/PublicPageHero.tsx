import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  panelEyebrow?: string;
  panelTitle?: string;
  panelItems?: HeroPanelItem[];
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
  panelItems = [],
  panelNoteTitle,
  panelNoteDescription,
}: PublicPageHeroProps) {
  const hasPanel = Boolean(panelTitle?.trim()) && panelItems.length > 0;

  return (
    <section className="relative overflow-hidden border-b border-[#BED9F3] bg-[#E6F1FF]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(220,238,255,0.96)_0%,rgba(207,227,255,0.98)_100%)]" />
      <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-[rgba(45,143,229,0.14)] blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[rgba(83,174,250,0.2)] blur-3xl" />

      <div className="site-container relative public-hero-space">
        <div className={cn("grid gap-8", hasPanel && "lg:grid-cols-[1.06fr_0.94fr] lg:items-center")}>
          <div className={cn("public-stack", hasPanel ? "max-w-[42rem]" : "max-w-[52rem]")}>
            <div className="space-y-5">
              <p className="inline-flex w-fit items-center rounded-full bg-[#EDF5FF] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1B66B3] sm:px-4 sm:py-1.5 sm:text-sm sm:tracking-[0.18em]">
                {eyebrow}
              </p>
              <h1 className="text-balance font-display text-[clamp(2rem,1.5rem+1.9vw,3.55rem)] font-semibold leading-[1.04] tracking-[-0.032em] text-slate-900">
                {title}
              </h1>
              <p className="max-w-2xl text-[0.98rem] leading-relaxed text-slate-600 sm:text-[1.04rem]">
                {description}
              </p>
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
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {signals.map((signal, index) => (
                  <div
                    key={signal}
                    className="group relative h-full overflow-hidden rounded-[1.35rem] border border-[#C7DDFC] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,249,255,0.98)_100%)] px-4 py-4 shadow-[0_18px_44px_-34px_rgba(27,102,179,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9FC8F0] hover:shadow-[0_24px_58px_-34px_rgba(27,102,179,0.26)] active:-translate-y-0.5 sm:px-5"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(27,102,179,0.16),rgba(27,102,179,0.5),rgba(27,102,179,0.16))]" />
                    <div className="relative flex h-full flex-col gap-3">
                      <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#1B66B3]">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF3FF] text-[0.72rem] tracking-normal text-[#1B66B3]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        Focus area
                      </div>
                      <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-[0.98rem]">
                        {signal}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {hasPanel ? (
            <div className="rounded-[1.7rem] border border-[#BED9F3] bg-[linear-gradient(180deg,rgba(248,251,255,0.98)_0%,rgba(239,246,255,0.98)_100%)] p-5 shadow-[0_26px_64px_-46px_rgba(15,23,42,0.24)] backdrop-blur-sm sm:rounded-[2rem] sm:p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  {panelEyebrow ? (
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-600">{panelEyebrow}</p>
                  ) : null}
                  <h2 className="text-balance text-[clamp(1.7rem,1.25rem+1.05vw,2.45rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-slate-900">
                    {panelTitle}
                  </h2>
                </div>

                <div className="space-y-3">
                  {panelItems.map((item, index) => (
                    <div
                      key={item.title}
                      className="rounded-[1.25rem] border border-[#D6E8FA] bg-white/88 px-4 py-4 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-[#A9CEF5] hover:shadow-[0_22px_54px_-34px_rgba(27,102,179,0.24)] active:-translate-y-0.5 sm:px-5"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={index === 0
                            ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1B66B3] text-sm font-semibold text-white"
                            : "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDF5FF] text-sm font-semibold text-[#1B66B3]"}
                        >
                          0{index + 1}
                        </span>
                        <div className="min-w-0 space-y-2">
                          <p className="text-[1.08rem] font-semibold leading-snug text-slate-900 sm:text-xl">
                            {item.title}
                          </p>
                          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {panelNoteTitle && panelNoteDescription ? (
                  <div className="rounded-[1.25rem] border border-[#CFE2F7] bg-[#EDF5FF] px-5 py-4 shadow-[0_16px_40px_-34px_rgba(27,102,179,0.2)]">
                    <p className="text-sm font-semibold text-[#1B66B3]">{panelNoteTitle}</p>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{panelNoteDescription}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

