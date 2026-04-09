import Link from "next/link";

import { Button } from "@/components/ui/button";
import { navigationCtas } from "@/lib/constants/navigation";

export function HomeBottomCta() {
  return (
    <section className="bg-[#CFE3FF] pb-10 pt-4 sm:pb-12 sm:pt-8">
      <div className="site-container">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#7FB5EA] bg-[#DCEEFF] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -left-8 top-0 h-44 w-44 rounded-full bg-[rgba(83,174,250,0.18)] blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[rgba(45,143,229,0.16)] blur-3xl" />
          <p className="relative text-sm font-semibold uppercase tracking-[0.24em] text-[#1B66B3]">
            Next step
          </p>
          <h2 className="relative mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
            Ready to strengthen your engineering bench or move into your next programme?
          </h2>
          <p className="relative mx-auto mt-4 max-w-3xl text-base text-slate-600 leading-relaxed">
            Whether you need a specialist hiring partner, a GCC team-building model, or a new role with an
            ambitious client, Tekorix gives you a direct path forward.
          </p>

          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="shadow-sm">
              <Link href={navigationCtas.hireTalent.href}>{navigationCtas.hireTalent.label}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={navigationCtas.findJob.href}>{navigationCtas.findJob.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

