import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Factory, Landmark, Stethoscope, Target, TrendingUp, Waypoints } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { buildMetadata } from "@/lib/seo";
import { themeTokens } from "@/lib/theme/tokens";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Know Tekorix through a simple About page covering who we are, mission and vision, industries we serve, and contact details.",
  path: "/about",
  keywords: ["about us", "mission", "vision", "industries we serve", "contact"],
});

const missionVision = [
  {
    title: "Mission",
    description:
      "To help organizations build stronger teams through practical staffing support, clear execution, and dependable delivery partnership.",
    icon: Target,
  },
  {
    title: "Vision",
    description:
      "To become a trusted long-term partner for talent, engineering support, and capability growth across modern businesses.",
    icon: Eye,
  },
];

const impactHighlights = [
  {
    value: "Multi-industry",
    label: "Support model across SaaS, BFSI, healthcare, manufacturing, and enterprise programs.",
  },
  {
    value: "Delivery-first",
    label: "Hiring, staffing, and team support mapped to execution clarity instead of generic outsourcing.",
  },
  {
    value: "Long-term fit",
    label: "Structured capability support for short-term needs as well as scale-up programs.",
  },
];

const industries = [
  {
    title: "SaaS and Tech Startups",
    description: "Fast-moving teams that need hiring speed and delivery continuity.",
    icon: TrendingUp,
  },
  {
    title: "ISVs, GCCs & GSIs",
    description: "Software vendors, GCC teams, and partner ecosystems scaling platform, release, and specialist capacity.",
    icon: Waypoints,
  },
  {
    title: "BFSI",
    description: "Regulated environments where reliability and governance are critical.",
    icon: Landmark,
  },
  {
    title: "Healthcare",
    description: "Teams balancing data sensitivity, compliance, and modern technology needs.",
    icon: Stethoscope,
  },
  {
    title: "Manufacturing",
    description: "Organizations modernizing operations and product engineering workflows.",
    icon: Factory,
  },
  {
    title: "Public Sector",
    description: "Programmes that need operating discipline, continuity, and stakeholder-visible delivery progress.",
    icon: Landmark,
  },
];

export default function AboutPage() {
  const { colors } = themeTokens;

  return (
    <>
      <section className="bg-[#E6F1FF] public-section">
        <div className="site-container public-stack">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.96fr)_minmax(19rem,0.82fr)] lg:items-start lg:gap-8">
            <div className="space-y-5 sm:space-y-6">
              <HomeSectionHeading
                eyebrow="About Us"
                title="A practical partner for staffing, team building, and execution support."
                description="Tekorix helps companies with the right talent and structured delivery support so projects can move faster with less risk."
                className="max-w-4xl"
              />

              <div className="space-y-4">
                <p className="type-body text-slate-600">
                  We work with organizations that need dependable hiring and delivery support without unnecessary complexity.
                  Our approach is straightforward: understand the requirement, deploy the right capability, and keep execution
                  stable.
                </p>
                <p className="type-body text-slate-600">
                  From specialist staffing to team-level support, Tekorix focuses on outcomes that are measurable, sustainable,
                  and aligned with business timelines.
                </p>
              </div>
            </div>

            <div className="relative w-full max-w-[33rem] overflow-hidden rounded-[1.6rem] bg-[linear-gradient(160deg,#F9FCFF_0%,#ECF5FF_100%)] shadow-[0_24px_54px_-42px_rgba(15,23,42,0.28)] lg:ml-auto">
              <Image
                src="/images/commitment-professional.jpg"
                alt="Tekorix team collaboration"
                width={960}
                height={720}
                className="h-[220px] w-full object-cover object-center sm:h-[280px] lg:h-[300px]"
                priority
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {impactHighlights.map((item) => (
              <div
                key={item.value}
                className="rounded-[1.5rem] bg-[linear-gradient(160deg,#F9FCFF_0%,#EDF6FF_100%)] px-5 py-5 shadow-[0_24px_58px_-44px_rgba(15,23,42,0.3)]"
              >
                <p className="type-h3 text-slate-950">{item.value}</p>
                <p className="type-body mt-2 text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#E6F1FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Mission and Vision"
            title="What drives our work."
            description="Our mission and vision keep the team aligned on quality delivery, long-term trust, and practical outcomes."
            align="center"
          />

          <div className="grid gap-5 md:grid-cols-2">
            {missionVision.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] bg-[linear-gradient(160deg,#F9FCFF_0%,#ECF5FF_100%)] p-6 shadow-[0_24px_58px_-44px_rgba(15,23,42,0.3)] sm:p-7"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1B66B3] text-white">
                  <item.icon className="h-5 w-5" />
                </span>
                <h2 className="type-h2 mt-5 text-slate-900">{item.title}</h2>
                <p className="type-body mt-3 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#E6F1FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Industries We Serve"
            title="Where we support teams and delivery programs."
            description="We serve multiple industries with hiring and engineering support shaped to each operating environment."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {industries.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border bg-[#F8FBFF] p-6 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1B66B3] text-white">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicBottomCta
        eyebrow="Contact Us"
        title="Let's discuss your hiring or team support needs."
        description="Share your requirement and the Tekorix team will connect with the right support plan."
        primaryCta={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}

