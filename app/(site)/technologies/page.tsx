import type { Metadata } from "next";
import { Cloud, Database, Globe, ShieldCheck, Smartphone, TestTube2, Workflow } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { PublicPageHero } from "@/components/global/PublicPageHero";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { buildMetadata } from "@/lib/seo";
import { themeTokens } from "@/lib/theme/tokens";

export const metadata: Metadata = buildMetadata({
  title: "Technology Capability Footprint",
  description:
    "Explore the technology categories Tekorix supports across product engineering, staffing, and delivery teams.",
  path: "/technologies",
  keywords: ["frontend", "backend", "cloud", "databases", "devops", "qa", "mobile"],
});

const technologyGroups = [
  {
    icon: Globe,
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Angular", "Design systems"],
  },
  {
    icon: Workflow,
    title: "Backend",
    items: ["Node.js", "Java", "Python", "Go", "API design", "Microservices"],
  },
  {
    icon: Cloud,
    title: "Cloud Platforms",
    items: ["AWS", "Azure", "Google Cloud", "Cloud migration", "Observability", "Cost optimization"],
  },
  {
    icon: Database,
    title: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Data pipelines", "Warehouse support"],
  },
  {
    icon: ShieldCheck,
    title: "DevOps",
    items: ["CI/CD", "Terraform", "Kubernetes", "Platform engineering", "SRE", "Security automation"],
  },
  {
    icon: TestTube2,
    title: "QA / Testing",
    items: ["Automation", "API testing", "Playwright", "Regression coverage", "Release readiness", "Quality strategy"],
  },
  {
    icon: Smartphone,
    title: "Mobile",
    items: ["iOS", "Android", "React Native", "Flutter", "Mobile QA", "App delivery support"],
  },
];

const capabilityLanes = [
  {
    title: "Modern product delivery",
    description: "Frontend, backend, QA, and DevOps capabilities can be assembled into delivery-ready teams.",
  },
  {
    title: "Cloud and platform modernization",
    description: "Use Tekorix when modernization work needs both engineering specialists and operating support.",
  },
  {
    title: "Data and intelligent systems",
    description: "The capability story extends into analytics, platform data, and AI-aligned delivery support.",
  },
  {
    title: "Flexible staffing coverage",
    description: "These technology areas map directly to permanent, contract, or pod-based engagement models.",
  },
];

export default function TechnologiesPage() {
  const { colors } = themeTokens;

  return (
    <>
      <PublicPageHero
        eyebrow="Technologies"
        title="A capability footprint built around modern engineering, delivery support, and scalable team design."
        description="The technology page shows the kinds of engineering coverage Tekorix can support across staffing, consulting, and delivery pods. It is designed to be easy to scan, extend, and align with the commercial staffing story."
        primaryCta={{ label: "Find Talent", href: "/find-talent" }}
        secondaryCta={{ label: "Talk to Us", href: "/contact" }}
        signals={["Capability-led page structure", "Scannable category grouping", "Aligned with staffing and delivery support"]}
        panelEyebrow="How to read this page"
        panelTitle="The goal is to make technology coverage visible without turning the page into an exhaustive skill dump."
        panelItems={[
          {
            title: "Grouped by practical domains",
            description: "Categories align with how clients usually think about hiring and delivery support.",
          },
          {
            title: "Connected to engagement models",
            description: "Technology capability should reinforce where Tekorix can provide people, teams, or structured support.",
          },
          {
            title: "Ready for future detail",
            description: "The structure can expand later with practices, partnerships, and deeper proof without redesigning the page.",
          },
        ]}
        panelNoteTitle="Capability-first narrative"
        panelNoteDescription="This page supports both services and find-talent conversations by showing where Tekorix can position technical depth."
      />

      <section className="bg-[#E6F1FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Technology categories"
            title="Grouped technology coverage across product engineering and delivery support."
            description="The categories below focus on recognizable capability lanes so the page remains useful to buyers, hiring teams, and prospects evaluating Tekorix support depth."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {technologyGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-[1.75rem] border bg-[#F8FBFF] p-6 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  <group.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-slate-950">
                  {group.title}
                </h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 bg-[#F8FBFF] px-3 py-1.5 text-xs font-medium text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section" style={{ backgroundColor: colors.surfaceAlt }}>
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Capability lanes"
            title="Use the technology story to connect skills coverage back to real client needs."
            description="The page becomes more useful when it shows how technologies map to delivery models, modernization work, and team-building conversations."
            align="center"
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {capabilityLanes.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border bg-[#F8FBFF] p-6 shadow-[0_22px_55px_-44px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-[0.18em]"
                  style={{ color: index === 0 ? colors.accent : colors.primary }}
                >
                  0{index + 1}
                </p>
                <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicBottomCta
        title="Need specific technology capability, a delivery pod, or specialist hiring support?"
        description="Use the Tekorix public site to move from technology visibility into the right next conversation around staffing, team building, or consulting support."
        primaryCta={{ label: "Find Talent", href: "/find-talent" }}
        secondaryCta={{ label: "Talk to Us", href: "/contact" }}
      />
    </>
  );
}

