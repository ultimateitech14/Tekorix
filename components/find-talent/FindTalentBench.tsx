import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Cloud,
  Code2,
  DatabaseZap,
  Layers3,
  ShieldCheck,
  Users2,
} from "lucide-react";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

const benchRoles = [
  {
    icon: Code2,
    title: "Full-Stack Developers",
    summary: "Feature delivery across frontend, backend, and integration layers.",
  },
  {
    icon: DatabaseZap,
    title: "Backend Engineers",
    summary: "API, data, and platform-focused execution for product teams.",
  },
  {
    icon: Code2,
    title: "Frontend Developers",
    summary: "UI delivery, design systems, and modern web application support.",
  },
  {
    icon: Cloud,
    title: "Cloud Engineers",
    summary: "Infrastructure, deployment readiness, and scalable cloud operations.",
  },
  {
    icon: ShieldCheck,
    title: "QA / Test Engineers",
    summary: "Automation, regression coverage, and release confidence support.",
  },
  {
    icon: Layers3,
    title: "DevOps Engineers",
    summary: "CI/CD, observability, environments, and engineering workflow stability.",
  },
  {
    icon: Users2,
    title: "Product Managers",
    summary: "Product planning, backlog shaping, and delivery coordination leadership.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Solutions Architects",
    summary: "Architecture direction, systems planning, and cross-team solution design.",
  },
];

const benchBenefits = [
  "Bench-ready talent reduces the delay between approval and actual delivery start.",
  "Tekorix can align short-term specialists, consultants, or broader delivery pods based on the request.",
  "If a role is not bench-available today, we can still shape the right hiring route and ramp plan.",
];

export function FindTalentBench() {
  const { colors } = themeTokens;

  return (
    <section style={{ backgroundColor: colors.surfaceAlt }} className="public-section">
      <div className="site-container public-stack">
        <HomeSectionHeading
          eyebrow="Bench resources"
          title="Ready-to-deploy talent categories for faster starts."
          description="Use Tekorix bench capacity when you need specialist coverage sooner than a traditional hiring cycle allows."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_0.44fr] lg:items-start xl:gap-8">
          <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {benchRoles.map((role) => (
              <div
                key={role.title}
                className="self-start rounded-[1.5rem] border bg-[#F8FBFF] px-5 py-5 shadow-[0_18px_44px_-40px_rgba(15,23,42,0.28)]"
                style={{ borderColor: colors.border }}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#EDF5FF] text-[#1B66B3] shadow-[0_16px_30px_-22px_rgba(27,102,179,0.42)]">
                  <role.icon className="h-4.5 w-4.5" />
                </span>
                <p className="mt-4 text-xs font-semibold tracking-[0.14em]" style={{ color: colors.primaryDark }}>
                  Bench lane
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-slate-950">{role.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{role.summary}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-[1.75rem] border bg-[#F8FBFF] p-6 shadow-[0_22px_50px_-42px_rgba(15,23,42,0.24)] sm:p-7"
            style={{ borderColor: colors.border }}
          >
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Why this helps</p>
              <h3 className="font-display text-2xl font-semibold text-slate-950">
                Faster specialist coverage without losing delivery context.
              </h3>
            </div>

            <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-[#D7E8FA] bg-[#F3F8FF]">
              {benchBenefits.map((item, index) => (
                <div
                  key={item}
                  className={index === benchBenefits.length - 1 ? "flex items-start gap-3 px-4 py-4" : "flex items-start gap-3 border-b border-[#D7E8FA] px-4 py-4"}
                >
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#1B66B3]" />
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              <Button
                asChild
                className="border-0 text-white hover:opacity-95"
                style={{ backgroundColor: colors.accent }}
              >
                <Link href="#company-lead-form">View Available Talent</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#BED9F3] bg-[#F8FBFF] text-slate-950 hover:bg-[#E6F1FF]"
              >
                <Link href="/contact">Talk to Us</Link>
              </Button>
              <Link
                href="#company-lead-form"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B66B3] transition-colors hover:text-[#145188]"
              >
                Request a custom role mix
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
