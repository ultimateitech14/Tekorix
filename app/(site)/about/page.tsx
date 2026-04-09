import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Factory, Landmark, Shield, Stethoscope, Target, TrendingUp, Waypoints } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { buildMetadata } from "@/lib/seo";

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

const industries = [
  {
    title: "SaaS and Tech Startups",
    description: "Fast-moving teams that need hiring speed and delivery continuity.",
    icon: TrendingUp,
  },
  {
    title: "ISVs",
    description: "Product-focused organizations scaling platform and release capacity.",
    icon: Waypoints,
  },
  {
    title: "GSIs",
    description: "Large ecosystems that need specialist talent and flexible support models.",
    icon: Shield,
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
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-[#CFE3FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="About Us"
            title="A practical partner for staffing, team building, and execution support."
            description="Tekorix helps companies with the right talent and structured delivery support so projects can move faster with less risk."
          />

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-base text-slate-600 leading-relaxed">
                We work with organizations that need dependable hiring and delivery support without unnecessary complexity.
                Our approach is straightforward: understand the requirement, deploy the right capability, and keep execution
                stable.
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                From specialist staffing to team-level support, Tekorix focuses on outcomes that are measurable, sustainable,
                and aligned with business timelines.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[1.8rem] border border-[#7FB5EA] bg-[#DCEEFF] shadow-sm">
              <Image
                src="/images/commitment-professional.jpg"
                alt="Tekorix team collaboration"
                width={960}
                height={720}
                className="h-[280px] w-full object-cover sm:h-[340px]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#CFE3FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Mission and Vision"
            title="What drives our work."
            description="Our mission and vision keep the team aligned on quality delivery, long-term trust, and practical outcomes."
            align="center"
          />

          <div className="grid gap-5 md:grid-cols-2">
            {missionVision.map((item) => (
              <div key={item.title} className="rounded-xl border border-[#7FB5EA] bg-[#DCEEFF] p-6 shadow-sm">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1B66B3] text-white">
                  <item.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-3xl font-semibold text-slate-900 md:text-4xl">{item.title}</h2>
                <p className="mt-3 text-base text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#CFE3FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Industries We Serve"
            title="Where we support teams and delivery programs."
            description="We serve multiple industries with hiring and engineering support shaped to each operating environment."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {industries.map((item) => (
              <div key={item.title} className="rounded-xl border border-[#7FB5EA] bg-[#DCEEFF] p-6 shadow-sm">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1B66B3] text-white">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-base text-slate-600 leading-relaxed">{item.description}</p>
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

