import type { Metadata } from "next";
import { ArrowUpRight, BarChart3, BriefcaseBusiness, Building2, Cog, Route, Waypoints } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { PublicPageHero } from "@/components/global/PublicPageHero";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { buildMetadata } from "@/lib/seo";
import { themeTokens } from "@/lib/theme/tokens";

export const metadata: Metadata = buildMetadata({
  title: "Business Consulting",
  description:
    "Explore Tekorix business consulting support across technology advisory, transformation planning, process improvement, and team structuring.",
  path: "/business-consulting",
  keywords: [
    "business consulting",
    "technology consulting",
    "digital transformation",
    "process optimization",
    "team structuring advisory",
  ],
});

const advisoryAreas = [
  {
    icon: BriefcaseBusiness,
    title: "Technology Consulting",
    description: "Clarify technology priorities, operating constraints, and what needs to change first for delivery to improve.",
  },
  {
    icon: Waypoints,
    title: "Digital Transformation",
    description: "Support modernization programmes with clearer structure, sequencing, and execution alignment.",
  },
  {
    icon: Cog,
    title: "Process Optimization",
    description: "Improve the way teams work across planning, handoffs, execution rhythm, and ongoing operational visibility.",
  },
  {
    icon: Building2,
    title: "Team Structuring Advisory",
    description: "Help define whether the next need is specialist hiring, a new pod, or a broader capability reshaping decision.",
  },
  {
    icon: BarChart3,
    title: "Strategy Consulting",
    description: "Support business and delivery leaders who need better alignment between target outcomes and operating design.",
  },
  {
    icon: Route,
    title: "Transformation Roadmapping",
    description: "Move from broad ambition into a more practical sequence of priorities, roles, and support models.",
  },
];

const capabilityHighlights = [
  {
    title: "From ambiguity to operating clarity",
    description:
      "Use consulting support when the real issue is not only capacity, but uncertainty around how the team or programme should be structured.",
  },
  {
    title: "From design to resourcing",
    description:
      "The consulting narrative is stronger because it can connect directly into Tekorix staffing and team-building support when needed.",
  },
  {
    title: "From short-term fixes to sustainable support",
    description:
      "The page should show that business consulting can help create continuity, not just a one-time presentation deck.",
  },
];

const advisoryFlow = [
  {
    label: "Discover",
    description: "Clarify the business challenge, delivery blockers, and capability gaps behind the request.",
  },
  {
    label: "Design",
    description: "Shape the right operating model, team structure, or transformation path with practical next steps.",
  },
  {
    label: "Execute",
    description: "Connect advisory output to hiring, staffing, or delivery support where execution help is also required.",
  },
];

export default function BusinessConsultingPage() {
  const { colors } = themeTokens;

  return (
    <>
      <PublicPageHero
        eyebrow="Business consulting"
        title="Advisory support for technology decisions, team design, and transformation planning."
        description="The business consulting page presents Tekorix as a practical advisory partner for organizations that need clearer operating direction before they scale teams, change delivery models, or invest deeper in transformation work."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "View Services", href: "/services" }}
        signals={["Advisory plus execution positioning", "Team structuring and transformation support", "Aligned with wider Tekorix services story"]}
        panelEyebrow="Consulting page role"
        panelTitle="This page explains how Tekorix can help shape decisions, not only fill delivery capacity."
        panelItems={[
          {
            title: "Business and delivery alignment",
            description: "Support leaders who need a clearer route from strategic intent to workable execution structure.",
          },
          {
            title: "Team design decisions",
            description: "Help define whether to hire, restructure, augment, or stand up a more formal delivery pod or GCC extension.",
          },
          {
            title: "Execution-ready advisory",
            description: "Consulting can flow directly into staffing or engineering support when the work needs to move beyond planning.",
          },
        ]}
        panelNoteTitle="Advisory with a practical edge"
        panelNoteDescription="The page stays useful because it links consulting language back to real operating and delivery choices clients have to make."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="site-container space-y-10">
          <HomeSectionHeading
            eyebrow="Consulting overview"
            title="A consulting layer focused on practical change, clearer team design, and better execution decisions."
            description="The page is structured around advisory areas clients can immediately recognize, with enough clarity to support deeper service conversations later."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {advisoryAreas.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.75rem] border bg-white p-6 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" style={{ backgroundColor: colors.surfaceAlt }}>
        <div className="site-container space-y-10">
          <HomeSectionHeading
            eyebrow="Capability highlights"
            title="Use consulting to reduce ambiguity before delivery slows or team design becomes reactive."
            description="These highlight blocks act like lightweight case-study themes without inventing named client stories or specific unsupported outcomes."
            align="center"
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {capabilityHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border bg-white p-6 shadow-[0_22px_55px_-44px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: colors.accent }}>
                  Highlight
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-[2rem] border bg-white p-6 shadow-[0_28px_70px_-50px_rgba(15,23,42,0.2)] sm:p-8"
            style={{ borderColor: colors.border }}
          >
            <HomeSectionHeading
              eyebrow="How engagements start"
              title="A simple advisory flow from discovery to execution support."
              description="This keeps the consulting page consistent with the broader Tekorix public language around practical structure and next-step clarity."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {advisoryFlow.map((item, index) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border bg-slate-50 px-5 py-6"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: index === 0 ? colors.surfaceAlt : "#F8FAFC",
                  }}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: colors.primary }}>
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950">{item.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PublicBottomCta
        title="Need advisory support before you scale teams or change delivery structure?"
        description="Use Tekorix when the right next step is not just hiring more people, but clarifying how the work, teams, and transformation path should be designed."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "Find Talent", href: "/find-talent" }}
      />
    </>
  );
}
