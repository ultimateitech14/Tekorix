import Link from "next/link";

import { Button } from "@/components/ui/button";
import { navigationCtas } from "@/lib/constants/navigation";
import { themeTokens } from "@/lib/theme/tokens";

export function HomeBottomCta() {
  const { colors } = themeTokens;

  return (
    <section className="bg-white pb-10 pt-4 sm:pb-12 sm:pt-8">
      <div className="site-container">
        <div
          className="relative overflow-hidden rounded-[2rem] border px-6 py-10 text-center shadow-[0_28px_70px_-42px_rgba(62,127,193,0.18)] sm:px-10 sm:py-12"
          style={{
            background: "linear-gradient(180deg, rgba(248,251,255,0.98) 0%, rgba(230,240,255,0.92) 100%)",
            borderColor: colors.border,
          }}
        >
          <div className="pointer-events-none absolute -left-8 top-0 h-44 w-44 rounded-full blur-3xl" style={{ backgroundColor: "rgba(111,175,232,0.22)" }} />
          <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full blur-3xl" style={{ backgroundColor: "rgba(62,127,193,0.16)" }} />
          <p className="relative text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: colors.primary }}>
            Next step
          </p>
          <h2 className="relative mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Ready to strengthen your engineering bench or move into your next programme?
          </h2>
          <p className="relative mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            Whether you need a specialist hiring partner, a GCC team-building model, or a new role with an
            ambitious client, Tekorix gives you a direct path forward.
          </p>

          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="border-0 text-white shadow-[0_22px_44px_-22px_rgba(62,127,193,0.52)] hover:opacity-95"
              style={{ backgroundColor: colors.primary }}
            >
              <Link href={navigationCtas.hireTalent.href}>{navigationCtas.hireTalent.label}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white text-slate-950 hover:bg-slate-50 hover:text-slate-950"
              style={{ borderColor: colors.border }}
            >
              <Link href={navigationCtas.findJob.href}>{navigationCtas.findJob.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
