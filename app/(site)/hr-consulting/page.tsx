import type { Metadata } from "next";
import { ArrowUpRight, BarChart3, BriefcaseBusiness, ClipboardCheck, Network, ShieldCheck, Users2 } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { PublicPageHero } from "@/components/global/PublicPageHero";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { buildMetadata } from "@/lib/seo";
import { themeTokens } from "@/lib/theme/tokens";

export const metadata: Metadata = buildMetadata({
  title: "HR Consulting",
  description:
    "Explore Tekorix HR consulting support across workforce planning, hiring process design, role structuring, and talent operations.",
  path: "/hr-consulting",
  keywords: [
    "hr consulting",
    "workforce planning",
    "hiring process design",
    "recruitment advisory",
    "talent operations",
  ],
});

const hrAdvisoryAreas = [
  {
    icon: Users2,
    title: "Workforce Planning",
    description: "Define the right headcount shape, role mix, and hiring priorities before growth becomes reactive.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Recruitment Process Design",
    description: "Improve sourcing, screening, interview stages, and offer flow so teams can hire with less friction.",
  },
  {
    icon: ClipboardCheck,
    title: "Role and Competency Mapping",
    description: "Clarify responsibilities, success expectations, and evaluation criteria across key delivery roles.",
  },
  {
    icon: ShieldCheck,
    title: "HR Operations Advisory",
    description: "Support payroll, compliance, onboarding, and operating discipline that needs to hold as teams scale.",
  },
  {
    icon: BarChart3,
    title: "Compensation Benchmarking",
    description: "Use market-aligned inputs to shape hiring decisions, offer positioning, and internal role consistency.",
  },
  {
    icon: Network,
    title: "Team Structure Readiness",
    description: "Decide when the next step is permanent hiring, consultants, team pods, or a wider capability reshaping move.",
  },
];

const hrCapabilityHighlights = [
  {
    title: "Hiring clarity before hiring volume",
    description:
      "Use HR consulting when the real issue is not just finding candidates, but defining what the team should look like and how hiring should run.",
  },
  {
    title: "Operations and delivery stay connected",
    description:
      "The HR story is stronger when workforce planning, payroll rhythm, compliance, and team setup are aligned to delivery needs.",
  },
  {
    title: "Practical support that can move into execution",
    description:
      "The page positions Tekorix as a partner that can guide HR decisions and then support staffing or team-building when execution starts.",
  },
];

const hrAdvisoryFlow = [
  {
    label: "Assess",
    description: "Understand hiring blockers, growth pressure, team gaps, and the workforce design decisions behind them.",
  },
  {
    label: "Structure",
    description: "Shape the roles, process, team model, and HR operating path that best supports the business stage.",
  },
  {
    label: "Activate",
    description: "Move into execution support through hiring, staffing, or managed team-building once the model is clear.",
  },
];

const advisoryCardClassName =
  "group relative flex h-full flex-col overflow-hidden rounded-[1.65rem] border bg-[linear-gradient(180deg,rgba(248,251,255,0.98)_0%,rgba(241,247,255,0.98)_100%)] p-5 shadow-[0_22px_58px_-44px_rgba(15,23,42,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A9CEF5] hover:shadow-[0_28px_68px_-40px_rgba(27,102,179,0.24)] active:-translate-y-0.5 sm:p-6";

const highlightCardClassName =
  "group relative flex h-full flex-col overflow-hidden rounded-[1.55rem] border bg-[linear-gradient(180deg,rgba(248,251,255,0.98)_0%,rgba(243,248,255,0.98)_100%)] p-5 shadow-[0_20px_54px_-42px_rgba(15,23,42,0.2)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A9CEF5] hover:shadow-[0_28px_66px_-40px_rgba(27,102,179,0.24)] active:-translate-y-0.5 sm:p-6";

const flowCardClassName =
  "group relative overflow-hidden rounded-[1.45rem] border px-5 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#A9CEF5] hover:shadow-[0_24px_54px_-36px_rgba(27,102,179,0.22)] active:-translate-y-0.5";

export default function HrConsultingPage() {
  const { colors } = themeTokens;

  return (
    <>
      <PublicPageHero
        eyebrow="HR consulting"
        title="People advisory support for workforce planning, hiring structure, and growth-ready HR decisions."
        description="The HR consulting page presents Tekorix as a practical partner for companies that need clearer hiring structure, stronger workforce planning, and more usable people operations before scaling teams."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "View Services", href: "/services" }}
        signals={["Workforce planning and hiring design", "Practical HR plus staffing positioning", "Built for growing teams and delivery pressure"]}
      />

      <section className="bg-[#E6F1FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="HR consulting overview"
            title="A structured HR advisory layer for hiring design, team readiness, and practical people operations."
            description="The page is organized around the decisions growing companies usually need help with before hiring volume increases or delivery pressure exposes process gaps."
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
            {hrAdvisoryAreas.map((item) => (
              <div
                key={item.title}
                className={advisoryCardClassName}
                style={{ borderColor: colors.border }}
              >
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[rgba(83,174,250,0.12)] blur-3xl"
                />
                <span
                  className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12"
                  style={{ backgroundColor: colors.primary }}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <h2 className="relative z-10 mt-5 font-display text-[1.18rem] font-semibold leading-snug tracking-[-0.02em] text-slate-950 sm:text-2xl">
                  {item.title}
                </h2>
                <p className="relative z-10 mt-3 text-sm leading-7 text-slate-600 sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section" style={{ backgroundColor: colors.surfaceAlt }}>
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Capability highlights"
            title="Use HR consulting to reduce hiring friction before it affects delivery, ramp-up, or retention."
            description="These highlights frame the kinds of operating improvements clients can recognize quickly without turning the page into vague HR marketing."
            align="center"
          />

          <div className="grid gap-4 lg:grid-cols-3 xl:gap-6">
            {hrCapabilityHighlights.map((item) => (
              <div
                key={item.title}
                className={highlightCardClassName}
                style={{ borderColor: colors.border }}
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[rgba(27,102,179,0.1)] blur-3xl" aria-hidden="true" />
                <div className="relative z-10 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: colors.accent }}>
                  Highlight
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <h2 className="relative z-10 mt-4 font-display text-[1.18rem] font-semibold leading-snug tracking-[-0.02em] text-slate-950 sm:text-2xl">
                  {item.title}
                </h2>
                <p className="relative z-10 mt-3 text-sm leading-7 text-slate-600 sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-[1.85rem] border bg-[linear-gradient(180deg,rgba(248,251,255,0.98)_0%,rgba(239,246,255,0.98)_100%)] p-5 shadow-[0_28px_70px_-50px_rgba(15,23,42,0.2)] sm:p-8"
            style={{ borderColor: colors.border }}
          >
            <HomeSectionHeading
              eyebrow="How engagements start"
              title="A simple HR advisory flow from assessment to execution support."
              description="This keeps the page consistent with the broader Tekorix approach of turning advisory conversations into clear next-step decisions."
            />

            <div className="mt-8 grid gap-4 lg:grid-cols-3 xl:gap-5">
              {hrAdvisoryFlow.map((item, index) => (
                <div
                  key={item.label}
                  className={flowCardClassName}
                  style={{
                    borderColor: colors.border,
                    backgroundColor: index === 0 ? colors.surfaceAlt : colors.surfaceCard,
                  }}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: colors.primary }}>
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 font-display text-[1.18rem] font-semibold leading-snug text-slate-950 sm:text-2xl">
                    {item.label}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PublicBottomCta
        title="Need clearer HR structure before you scale hiring or teams?"
        description="Use Tekorix when the next requirement is not only more candidates, but better workforce planning, hiring structure, and delivery-aligned HR decisions."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "Find Talent", href: "/find-talent" }}
      />
    </>
  );
}
