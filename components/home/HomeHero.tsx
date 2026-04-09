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
    <section className="relative overflow-hidden border-b border-[#7FB5EA] bg-[#CFE3FF]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#DCEEFF_0%,#D6EBFF_56%,#CFE3FF_100%)]" />
      <div className="absolute -left-14 top-10 h-72 w-72 rounded-full bg-[rgba(31,160,255,0.16)] blur-3xl" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[rgba(10,47,142,0.1)] blur-3xl" />

      <div className="site-container relative public-hero-space">
        <div className="max-w-4xl public-stack">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
              One clear path for hiring teams and job seekers.
            </h1>
            <p className="max-w-3xl text-base text-slate-600 leading-relaxed">
              Tekorix helps companies find the right talent and helps professionals find the right
              opportunities through a direct, polished, and outcome-focused experience.
            </p>
          </div>

          <div className="grid gap-4 sm:max-w-2xl sm:grid-cols-2">
            {heroActions.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={index === 0
                  ? "group flex items-center justify-between gap-4 rounded-[1.35rem] border border-[#1B66B3] bg-[#C6E0FF] px-5 py-4 text-base font-semibold text-slate-900 transition-colors hover:bg-[#CFE3FF] sm:px-6 sm:py-5 sm:text-lg"
                  : "group flex items-center justify-between gap-4 rounded-[1.35rem] border border-[#7FB5EA] bg-[#DCEEFF] px-5 py-4 text-base font-semibold text-slate-900 transition-colors hover:bg-[#CFE3FF] sm:px-6 sm:py-5 sm:text-lg"}
              >
                <span>{item.label}</span>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C6E0FF] text-[#1B66B3] transition-colors group-hover:bg-[#CFE3FF]">
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
