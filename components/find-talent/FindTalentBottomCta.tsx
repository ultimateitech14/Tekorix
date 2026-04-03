import Link from "next/link";

import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

export function FindTalentBottomCta() {
  const { colors } = themeTokens;

  return (
    <section className="bg-white pb-10 pt-4 sm:pb-12 sm:pt-8">
      <div className="site-container">
        <div
          className="relative overflow-hidden rounded-[2rem] border px-6 py-10 text-center shadow-[0_28px_70px_-44px_rgba(15,23,42,0.22)] sm:px-10 sm:py-12"
          style={{
            backgroundColor: colors.white,
            borderColor: colors.border,
          }}
        >
          <div className="pointer-events-none absolute -left-8 top-0 h-44 w-44 rounded-full bg-sky-100/80 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-blue-100/70 blur-3xl" />
          <p className="relative text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: colors.primary }}>
            Ready when you are
          </p>
          <h2 className="relative mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Need talent, a delivery pod, or a clearer hiring model?
          </h2>
          <p className="relative mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            Tekorix can support specialist hiring, bench deployment, and team structure decisions without
            forcing you into a single engagement path.
          </p>

          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="border-0 text-white shadow-[0_20px_40px_-22px_rgba(37,99,235,0.65)] hover:opacity-95"
              style={{ backgroundColor: colors.primary }}
            >
              <Link href="#company-lead-form">I Need a Team</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-300 bg-white text-slate-950 hover:bg-slate-50 hover:text-slate-950"
            >
              <Link href="/contact">Talk to Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
