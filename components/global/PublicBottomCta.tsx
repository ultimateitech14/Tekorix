import Link from "next/link";

import { Button } from "@/components/ui/button";

type CtaAction = {
  label: string;
  href: string;
};

type PublicBottomCtaProps = {
  title: string;
  description: string;
  primaryCta: CtaAction;
  secondaryCta?: CtaAction;
  eyebrow?: string;
};

export function PublicBottomCta({
  title,
  description,
  primaryCta,
  secondaryCta,
  eyebrow = "Next step",
}: PublicBottomCtaProps) {
  return (
    <section className="bg-[#E6F1FF] pb-10 pt-4 sm:pb-12 sm:pt-8">
      <div className="site-container">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#BED9F3] bg-[#F8FBFF] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -left-8 top-0 h-44 w-44 rounded-full bg-sky-100/80 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-blue-100/70 blur-3xl" />
          <p className="relative mx-auto inline-flex w-fit items-center rounded-full bg-[#EDF5FF] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1B66B3] sm:px-4 sm:py-1.5 sm:text-sm sm:tracking-[0.18em]">
            {eyebrow}
          </p>
          <h2 className="relative mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
            {title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-3xl text-base text-slate-600 leading-relaxed">
            {description}
          </p>

          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="shadow-sm">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>

            {secondaryCta ? (
              <Button asChild size="lg" variant="outline">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

