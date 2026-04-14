import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const heroActions = [
  {
    label: "Find a Talent",
    href: "/find-talent",
  },
  {
    label: "Find a Job",
    href: "/find-job",
  },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-[#BED9F3] bg-[#061321]">
      <div className="absolute inset-0">
        <Image
          src="/images/commitment-professional.jpg"
          alt="Professional holding a coffee mug and smartphone"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_28%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(92deg,rgba(6,19,33,0.94)_0%,rgba(7,22,38,0.9)_30%,rgba(9,26,45,0.72)_48%,rgba(10,30,52,0.36)_64%,rgba(10,30,52,0.1)_78%,rgba(10,30,52,0)_100%)]" />
      </div>

      <div className="site-container relative flex min-h-[34rem] items-end py-12 sm:min-h-[38rem] sm:py-16 lg:min-h-[calc(100vh-5rem)] lg:py-20">
        <div className="max-w-[42rem] space-y-7">
          <h1 className="font-display text-[clamp(2.5rem,5.2vw,5.1rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-white">
            Everything moves faster <span className="font-medium text-slate-200">when you have the</span>{" "}
            <span className="font-semibold text-white">right talent.</span>
          </h1>
          <p className="max-w-[33rem] text-base leading-relaxed text-slate-200 sm:text-[1.15rem] sm:leading-8">
            Tekorix helps companies hire stronger teams and helps professionals find roles that
            match their skills through a direct, high-trust experience.
          </p>

          <div className="flex flex-wrap gap-3">
            {heroActions.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  index === 0
                    ? "group flex w-full items-center justify-between gap-3 rounded-full border border-[#2F86D9] bg-[#1B66B3] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#145188] sm:w-[12.8rem] sm:px-5 sm:py-3.5"
                    : "group flex w-full items-center justify-between gap-3 rounded-full border border-[#BAD7F6] bg-[#E9F3FF] px-5 py-3 text-base font-semibold text-[#145188] transition-colors hover:bg-[#DDEEFF] sm:w-[12.8rem] sm:px-5 sm:py-3.5"
                }
              >
                <span>{item.label}</span>
                <span
                  className={
                    index === 0
                      ? "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2F86D9] text-white transition-colors group-hover:bg-[#3D95EA]"
                      : "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#CFE5FC] text-[#1B66B3] transition-colors group-hover:bg-[#C2DFFF]"
                  }
                >
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
