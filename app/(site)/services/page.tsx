import type { Metadata } from "next";
import { Building2, BriefcaseBusiness, Users2 } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { PublicPageHero } from "@/components/global/PublicPageHero";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { buildMetadata } from "@/lib/seo";
import { themeTokens } from "@/lib/theme/tokens";

export const metadata: Metadata = buildMetadata({
  title: "Tekorix Services",
  description:
    "Explore Tekorix services across product engineering, staffing, team building, GCC setup, and consulting support.",
  path: "/services",
  keywords: [
    "product engineering",
    "on-roll staffing",
    "contract staffing",
    "team building",
    "gcc setup",
    "consulting services",
  ],
});

const services = [
  {
    id: "product-engineering",
    title: "Product Engineering",
    description: "Delivery support for product, platform, and engineering programmes that need stronger execution capacity.",
  },
  {
    id: "on-roll-staffing",
    title: "On-Roll Staffing",
    description: "Deploy consultants managed through Tekorix when clients need specialist capability with continuity and operational cover.",
    core: true,
  },
  {
    id: "contract-staffing",
    title: "Contract Staffing",
    description: "Flexible contract hiring for programmes that need speed, niche expertise, or variable delivery pacing.",
    core: true,
  },
  {
    id: "team-building",
    title: "Team Building",
    description: "Assemble delivery-ready engineering teams instead of solving every capability gap one role at a time.",
    core: true,
  },
  {
    id: "gcc-setup",
    title: "GCC Setup",
    description: "Support capability center extensions with the team structure, staffing path, and early delivery rhythm needed to start well.",
  },
  {
    id: "staff-augmentation",
    title: "Staff Augmentation",
    description: "Add targeted engineering strength to internal teams when the roadmap is moving faster than current bandwidth.",
    core: true,
  },
  {
    id: "consulting-services",
    title: "Consulting Services",
    description: "Use advisory support for discovery, operating model decisions, and transformation planning around team and delivery design.",
  },
];

const serviceFlow = [
  {
    title: "Assess the gap",
    description: "Clarify whether the need is for talent, team structure, capability build-out, or consulting-led discovery.",
  },
  {
    title: "Choose the model",
    description: "Use permanent, on-roll, contract, or pod-based support depending on delivery pressure and continuity needs.",
  },
  {
    title: "Sustain outcomes",
    description: "Keep the support model practical through clear ownership, operating rhythm, and longer-term team planning.",
  },
];

const valuePoints = [
  {
    icon: Users2,
    title: "Staffing and team building stay central",
    description: "The commercial direction stays clearly visible even as supporting services are added around it.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Flexible commercial paths",
    description: "Tekorix can support permanent hiring, contract needs, and broader delivery structures under one brand story.",
  },
  {
    icon: Building2,
    title: "Built for GCC and scale-up needs",
    description: "The services page reinforces that support can extend beyond role filling into larger capability setup work.",
  },
];

export default function ServicesPage() {
  const { colors } = themeTokens;

  return (
    <>
      <PublicPageHero
        eyebrow="Services"
        title="Services structured around talent, teams, and practical delivery support."
        description="Tekorix combines product engineering, staffing, GCC support, and advisory services in one public services story. The page is designed to make the commercial direction clear: staffing and team building are core, supported by consulting and execution capability."
        primaryCta={{ label: "Find Talent", href: "/find-talent" }}
        secondaryCta={{ label: "Talk to Us", href: "/contact" }}
        signals={["Staffing and team building at the center", "Consulting and execution support around it", "Built for scale-up and continuity needs"]}
        panelEyebrow="Services page purpose"
        panelTitle="Show the range of support while keeping the business direction easy to understand."
        panelItems={[
          {
            title: "Core commercial focus",
            description: "On-roll staffing, contract staffing, staff augmentation, and team building stay highly visible.",
          },
          {
            title: "Broader service context",
            description: "Product engineering, GCC setup, and consulting show how Tekorix can support beyond isolated hiring asks.",
          },
          {
            title: "Client-ready structure",
            description: "The page is built to convert curiosity into a direct hiring or advisory conversation.",
          },
        ]}
        panelNoteTitle="Conversion-first services story"
        panelNoteDescription="This page should make it obvious what Tekorix offers, how it is packaged, and where the strongest commercial path sits."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="site-container space-y-10">
          <HomeSectionHeading
            eyebrow="Services overview"
            title="A structured services portfolio built around team quality and delivery momentum."
            description="The service lines below are deliberately broad enough to be extensible later, while already making the staffing, augmentation, and team-building proposition clear."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((item, index) => (
              <div
                key={item.title}
                id={item.id}
                className="scroll-mt-28 rounded-[1.75rem] border bg-white p-6 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: colors.primary }}>
                    0{index + 1}
                  </p>
                  {item.core ? (
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
                      style={{ backgroundColor: colors.accent }}
                    >
                      Core focus
                    </span>
                  ) : null}
                </div>
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
            eyebrow="How services connect"
            title="The service story becomes stronger when it shows how needs move from hiring gaps to delivery structure."
            description="Instead of treating each service line as isolated, the page shows how Tekorix can help assess the problem, choose the right model, and keep outcomes stable."
            align="center"
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {serviceFlow.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border bg-white p-6 shadow-[0_22px_55px_-44px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-[0.18em]"
                  style={{ color: index === 1 ? colors.accent : colors.primary }}
                >
                  Step 0{index + 1}
                </p>
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
              eyebrow="Why Tekorix"
              title="The value summary should reinforce staffing strength without narrowing the broader offer."
              description="This keeps the services page commercially focused while still supporting consulting, product engineering, and GCC conversations."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {valuePoints.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border bg-slate-50 px-5 py-6"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: index === 0 ? colors.surfaceAlt : "#F8FAFC",
                  }}
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white"
                    style={{
                      backgroundColor: index === 0 ? colors.primary : colors.surfaceMuted,
                      color: index === 0 ? colors.white : colors.primary,
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PublicBottomCta
        title="Need product engineering support, team building, or a staffing model that can scale with you?"
        description="Use Tekorix when you need a clear services conversation that can move quickly into hiring support, advisory design, or delivery-ready execution."
        primaryCta={{ label: "Find Talent", href: "/find-talent" }}
        secondaryCta={{ label: "Talk to Us", href: "/contact" }}
      />
    </>
  );
}
