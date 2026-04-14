import type { Metadata } from "next";
import { Award, BookOpen, BriefcaseBusiness, GraduationCap, Laptop2, Users2 } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { PublicPageHero } from "@/components/global/PublicPageHero";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { buildMetadata } from "@/lib/seo";
import { themeTokens } from "@/lib/theme/tokens";

export const metadata: Metadata = buildMetadata({
  title: "Tekorix Academy",
  description:
    "Explore the Tekorix academy story across upskilling, workshops, role-based learning tracks, and career development support.",
  path: "/academy",
  keywords: ["academy", "upskill", "reskill", "workshops", "learning tracks", "career development"],
});

const programs = [
  {
    id: "engineering-foundations",
    icon: GraduationCap,
    title: "Engineering Foundations",
    description: "Practical learning paths for modern software, platform, and quality engineering basics.",
  },
  {
    id: "cloud-and-devops-tracks",
    icon: Laptop2,
    title: "Cloud and DevOps Tracks",
    description: "Role-aligned enablement for cloud operations, platform engineering, reliability, and delivery tooling.",
  },
  {
    id: "data-and-ai-learning",
    icon: BookOpen,
    title: "Data and AI Learning",
    description: "Structured upskilling for data platforms, analytics workflows, and applied AI readiness.",
  },
  {
    id: "career-acceleration",
    icon: BriefcaseBusiness,
    title: "Career Acceleration",
    description: "Capability tracks designed to help candidates and teams move toward higher-value product roles.",
  },
];

const learningFormats = [
  {
    id: "workshops",
    title: "Workshops",
    description: "Short, focused sessions for teams that need immediate practical uplift around tools, workflows, or delivery practices.",
  },
  {
    id: "certification-support",
    title: "Certification support",
    description: "Learning journeys that help participants prepare for recognized cloud, platform, or technical milestone goals.",
  },
  {
    id: "applied-mentoring",
    title: "Applied mentoring",
    description: "Support that keeps learning tied to project reality instead of remaining purely classroom-based.",
  },
];

const supportBlocks = [
  {
    icon: Award,
    title: "Role-readiness guidance",
    description: "Use the Academy story to show how Tekorix can support movement into stronger engineering and delivery roles.",
  },
  {
    icon: Users2,
    title: "Internal team enablement",
    description: "The same structure can support clients who want to improve internal capability alongside external hiring or staffing.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Career development support",
    description: "Learning, profile guidance, and capability-building can sit alongside the broader candidate and hiring journey.",
  },
];

export default function AcademyPage() {
  const { colors } = themeTokens;

  return (
    <>
      <PublicPageHero
        eyebrow="Academy"
        title="A clean learning and capability page for upskilling, reskilling, and practical role development."
        description="The Tekorix Academy page positions learning as a support layer for stronger teams and stronger candidates. It stays polished and extendable without pretending there is already a fully detailed course catalog behind it."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "Find a Job", href: "/find-job" }}
        signals={["Training and enablement narrative", "Role-based learning tracks", "Linked to team and candidate growth"]}
        panelEyebrow="Academy page purpose"
        panelTitle="Show learning capability as part of the wider Tekorix talent and services story."
        panelItems={[
          {
            title: "Client-side capability building",
            description: "Support organizations that want to strengthen internal teams while scaling delivery.",
          },
          {
            title: "Candidate-side growth support",
            description: "Show how Tekorix can help candidates move toward better-fit product and engineering roles.",
          },
          {
            title: "Future-ready structure",
            description: "The page leaves room for later detail on courses, certifications, cohorts, and workshops.",
          },
        ]}
        panelNoteTitle="Capability development layer"
        panelNoteDescription="This page should feel useful now while remaining easy to deepen later with actual program detail."
      />

      <section className="bg-[#E6F1FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Programs and tracks"
            title="Learning paths that align with modern engineering roles and delivery expectations."
            description="The Academy story becomes more credible when it is organized around role-based tracks rather than vague learning language."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {programs.map((item) => (
              <div
                key={item.title}
                id={item.id}
                className="scroll-mt-28 rounded-[1.5rem] border bg-[#F8FBFF] p-6 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <h2 className="type-h3 mt-5 text-slate-950">
                  {item.title}
                </h2>
                <p className="type-body mt-3 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section" style={{ backgroundColor: colors.surfaceAlt }}>
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Formats"
            title="Flexible learning formats for workshops, certifications, and applied enablement."
            description="The page should show variety in how Academy support can be delivered without creating a bloated program catalog."
            align="center"
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {learningFormats.map((item, index) => (
              <div
                key={item.title}
                id={item.id}
                className="scroll-mt-28 rounded-[1.5rem] border bg-[#F8FBFF] p-6 shadow-[0_22px_55px_-44px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <p
                  className="type-body-sm font-semibold uppercase tracking-[0.18em]"
                  style={{ color: index === 1 ? colors.accent : colors.primary }}
                >
                  Format 0{index + 1}
                </p>
                <h2 className="type-h3 mt-4 text-slate-950">
                  {item.title}
                </h2>
                <p className="type-body mt-3 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-[2rem] border bg-[#F8FBFF] p-6 shadow-[0_28px_70px_-50px_rgba(15,23,42,0.2)] sm:p-8"
            style={{ borderColor: colors.border }}
          >
            <HomeSectionHeading
              eyebrow="Learning support"
              title="Keep learning tied to capability growth, role readiness, and delivery impact."
              description="This section helps the Academy page support both client enablement and candidate development narratives."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {supportBlocks.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border bg-[#F8FBFF] px-5 py-6"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: index === 0 ? colors.surfaceAlt : colors.surfaceCard,
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
                  <h3 className="type-h3 mt-4 text-slate-950">{item.title}</h3>
                  <p className="type-body mt-3 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PublicBottomCta
        title="Need learning support for teams or a stronger growth path for candidates?"
        description="Use the Tekorix Academy page as a starting point for upskilling conversations, capability enablement, and career-oriented support."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "Find a Job", href: "/find-job" }}
      />
    </>
  );
}


