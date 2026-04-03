import type { Metadata } from "next";
import { Factory, Landmark, Shield, Stethoscope, TrendingUp, Waypoints } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { PublicPageHero } from "@/components/global/PublicPageHero";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { buildMetadata } from "@/lib/seo";
import { themeTokens } from "@/lib/theme/tokens";

export const metadata: Metadata = buildMetadata({
  title: "Industries Tekorix Serves",
  description:
    "Explore the industries Tekorix supports across staffing, consulting, and product engineering delivery.",
  path: "/industries",
  keywords: ["industries", "saas", "bfsi", "healthcare", "manufacturing", "public sector"],
});

const industries = [
  {
    icon: TrendingUp,
    title: "SaaS and Tech Startups",
    description: "Fast-moving teams that need product engineering support, hiring velocity, and scalable delivery structure.",
  },
  {
    icon: Waypoints,
    title: "ISVs",
    description: "Software vendors looking for stronger release capacity, platform modernization, and specialist team support.",
  },
  {
    icon: Shield,
    title: "GSIs",
    description: "Larger delivery ecosystems that need flexible engineering capacity, niche specialists, and partner-side continuity.",
  },
  {
    icon: Landmark,
    title: "BFSI",
    description: "Regulated environments where governance, continuity, and stronger delivery discipline matter as much as speed.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare",
    description: "Teams balancing data sensitivity, reliability, and modern platform needs across digital health and support systems.",
  },
  {
    icon: Factory,
    title: "Manufacturing",
    description: "Organizations modernizing operations, product systems, and connected workflows without disrupting ongoing execution.",
  },
  {
    icon: Landmark,
    title: "Public Sector",
    description: "Programmes that require clear operating discipline, long-term support planning, and stakeholder-visible delivery progress.",
  },
];

const deliveryThemes = [
  {
    title: "Industry context changes team design",
    description: "The right team for a startup sprint is different from the right structure for a regulated enterprise rollout.",
  },
  {
    title: "Compliance and continuity remain visible",
    description: "Tekorix positioning emphasizes not just speed, but how teams are managed and supported once deployed.",
  },
  {
    title: "Capability building stays in scope",
    description: "Support can cover immediate delivery needs while still helping clients strengthen internal operating capacity.",
  },
];

const engagementPatterns = [
  {
    title: "Specialist staffing",
    description: "Use targeted talent injection when an industry programme has a clear skill or capacity gap.",
  },
  {
    title: "Dedicated delivery pods",
    description: "Use team-based support when product, platform, or transformation work needs more continuity.",
  },
  {
    title: "Advisory plus execution support",
    description: "Use consulting-led engagement when the client also needs help shaping the right operating model first.",
  },
];

export default function IndustriesPage() {
  const { colors } = themeTokens;

  return (
    <>
      <PublicPageHero
        eyebrow="Industries"
        title="Industry support shaped around real delivery conditions, not generic staffing language."
        description="Tekorix positions its services for sectors where engineering capability, workforce flexibility, and execution clarity all matter. The industry story helps clients quickly see where the model fits best."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "View Services", href: "/services" }}
        signals={["Startup to enterprise support", "Staffing, consulting, and team-building", "Designed for cross-industry delivery contexts"]}
        panelEyebrow="What changes by sector"
        panelTitle="The delivery environment influences the engagement model, the talent mix, and the operating pace."
        panelItems={[
          {
            title: "Regulated environments",
            description: "Sectors like BFSI, healthcare, and public programmes require greater visibility and continuity.",
          },
          {
            title: "High-change platforms",
            description: "SaaS, ISVs, and tech-led teams need faster hiring and stronger engineering throughput.",
          },
          {
            title: "Complex partner ecosystems",
            description: "GSIs and manufacturing programmes often need blended support across specialist and team-based models.",
          },
        ]}
        panelNoteTitle="Industry-aware positioning"
        panelNoteDescription="This page keeps the vertical story clear without overclaiming deep sector proof before final case-study content is added."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="site-container space-y-10">
          <HomeSectionHeading
            eyebrow="Industries overview"
            title="Sectors where Tekorix can position talent, consulting, and delivery support."
            description="The emphasis stays on practical industry relevance: how the work environment changes team structure, delivery needs, and the kind of support that should be deployed."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {industries.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border bg-white p-6 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.22)]"
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
            eyebrow="Why industry context matters"
            title="The same hiring or consulting model does not fit every sector."
            description="The Tekorix public story is stronger when it shows how industry requirements shape engagement design, not just which keywords appear on the page."
            align="center"
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {deliveryThemes.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border bg-white p-6 shadow-[0_22px_55px_-44px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-[2rem] border bg-white p-6 shadow-[0_28px_70px_-50px_rgba(15,23,42,0.2)] sm:p-8"
            style={{ borderColor: colors.border }}
          >
            <HomeSectionHeading
              eyebrow="Engagement patterns"
              title="Use different support paths depending on sector pressure, delivery risk, and internal capability."
              description="The page stays conversion-aware by connecting industry language back to concrete Tekorix offerings."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {engagementPatterns.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border bg-slate-50 px-5 py-6"
                  style={{
                    borderColor: colors.border,
                  }}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: colors.primary }}>
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PublicBottomCta
        title="Need industry-specific team building, consulting, or staffing support?"
        description="Use Tekorix when you need a sector-aware conversation about team structure, specialist capability, or delivery pressure in a specific operating environment."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "Find Talent", href: "/find-talent" }}
      />
    </>
  );
}
