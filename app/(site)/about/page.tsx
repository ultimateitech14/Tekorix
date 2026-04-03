import type { Metadata } from "next";
import { ArrowRight, BriefcaseBusiness, Compass, ShieldCheck, Users2 } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { PublicPageHero } from "@/components/global/PublicPageHero";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
import { publicLeadershipPlaceholders } from "@/lib/constants/public-content";
import { buildMetadata } from "@/lib/seo";
import { themeTokens } from "@/lib/theme/tokens";

export const metadata: Metadata = buildMetadata({
  title: "About Tekorix",
  description:
    "Learn how Tekorix brings together consulting, engineering, and talent capability to support long-term delivery outcomes.",
  path: "/about",
  keywords: ["about tekorix", "engineering services partner", "delivery model", "company values"],
});

const storyCards = [
  {
    title: "Who we are",
    description:
      "Tekorix brings together staffing, consulting, and engineering support so clients can move from planning to execution without switching partners.",
  },
  {
    title: "Mission",
    description:
      "Help organizations build stronger product and delivery capability through practical consulting, talent access, and execution discipline.",
  },
  {
    title: "Vision",
    description:
      "Be the partner clients rely on when they need specialist talent, structured delivery teams, and modern engineering capability that lasts.",
  },
];

const valueCards = [
  {
    title: "Clarity",
    description:
      "We keep scope, priorities, and execution visibility clear so teams can make better decisions faster.",
  },
  {
    title: "Accountability",
    description:
      "We focus on delivery ownership, measurable progress, and practical outcomes over presentation-heavy noise.",
  },
  {
    title: "Capability",
    description:
      "We combine people, process, and engineering strength so clients can scale without creating new gaps.",
  },
  {
    title: "Continuity",
    description:
      "We design support models that hold up after the initial push, not just during early momentum.",
  },
];

const reasons = [
  {
    icon: Users2,
    title: "One partner across talent and delivery",
    description:
      "Clients can use Tekorix for specialist hiring, team-building, and consulting support without fragmenting ownership.",
  },
  {
    icon: ShieldCheck,
    title: "Structured operating discipline",
    description:
      "Governance, delivery visibility, and people-side continuity stay visible throughout the engagement lifecycle.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Commercial flexibility",
    description:
      "Permanent, contract, bench, and advisory models can be aligned around the actual pace and shape of the programme.",
  },
  {
    icon: Compass,
    title: "Growth-oriented capability building",
    description:
      "The model is designed to improve internal capability, not only fill short-term delivery gaps.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discover",
    description:
      "Clarify hiring gaps, delivery pressure points, and the team or operating model needed next.",
  },
  {
    step: "02",
    title: "Shape",
    description:
      "Define the right mix of consulting, staffing, or execution support based on timeline and outcomes.",
  },
  {
    step: "03",
    title: "Deploy",
    description:
      "Position specialists, delivery pods, or advisory support with clear ownership and start-up rhythm.",
  },
  {
    step: "04",
    title: "Sustain",
    description:
      "Keep continuity through review loops, capability transfer, and longer-term support planning.",
  },
];

export default function AboutPage() {
  const { colors } = themeTokens;

  return (
    <>
      <PublicPageHero
        eyebrow="About Tekorix"
        title="A services-led partner for engineering teams, delivery continuity, and long-term capability."
        description="Tekorix is positioned for organizations that need more than isolated staffing or point consulting. The model brings together talent access, engineering support, and structured execution so critical programmes can move with less friction."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "View Services", href: "/services" }}
        signals={[
          "Consulting, staffing, and engineering support",
          "Built for GCC, product, and delivery teams",
          "Structured for long-term client trust",
        ]}
        panelEyebrow="What this page clarifies"
        panelTitle="Why clients use Tekorix when speed, team quality, and continuity all matter."
        panelItems={[
          {
            title: "Services plus delivery thinking",
            description:
              "Tekorix is positioned as a practical partner for both advisory and execution-side needs.",
          },
          {
            title: "Talent plus structure",
            description:
              "The value is not only hiring people, but helping shape how teams should be built or improved.",
          },
          {
            title: "Designed for extension",
            description:
              "The public site lays the groundwork for deeper proof, client stories, and operating detail later.",
          },
        ]}
        panelNoteTitle="Trust-first positioning"
        panelNoteDescription="Use this page when a client or candidate needs to understand who Tekorix is before exploring services, jobs, or direct inquiry paths."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="site-container space-y-10">
          <HomeSectionHeading
            eyebrow="Company story"
            title="Built to connect business direction, engineering delivery, and workforce capability."
            description="Tekorix is presented as a modern services company that supports clients across hiring, advisory, and product engineering needs while keeping execution grounded in practical delivery realities."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {storyCards.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border bg-white p-6 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-950">
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
            eyebrow="Mission, vision, values"
            title="The working principles behind the Tekorix delivery model."
            description="The message stays simple: be clear, stay accountable, and build capability that can hold up beyond one immediate request."
            align="center"
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {valueCards.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border bg-white p-6 shadow-[0_22px_55px_-44px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-[0.18em]"
                  style={{ color: colors.accent }}
                >
                  Value
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

      <section className="bg-white py-16 sm:py-20">
        <div className="site-container space-y-10">
          <HomeSectionHeading
            eyebrow="Why choose Tekorix"
            title="Use Tekorix when you need staffing, consulting, and delivery thinking to work together."
            description="The commercial direction of the site stays centered on staffing and team building, but the surrounding story explains why that capability is stronger when paired with operational clarity and engineering context."
          />

          <div className="grid gap-5 md:grid-cols-2">
            {reasons.map((item) => (
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

          <div
            className="rounded-[2rem] border bg-white p-6 shadow-[0_28px_70px_-50px_rgba(15,23,42,0.2)] sm:p-8"
            style={{ borderColor: colors.border }}
          >
            <HomeSectionHeading
              eyebrow="How we work"
              title="A simple operating rhythm from discovery to sustained support."
              description="The process is intentionally clear so clients know what Tekorix can help define, deliver, and continue after the first phase."
            />

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {processSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[1.5rem] border bg-slate-50 px-5 py-6"
                  style={{
                    borderColor: colors.border,
                  }}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: colors.primary }}>
                    {item.step}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" style={{ backgroundColor: colors.surfaceAlt }}>
        <div className="site-container space-y-10">
          <HomeSectionHeading
            eyebrow="Leadership and team"
            title="Leadership coverage across delivery, consulting, and talent."
            description="This keeps the page client-ready now while leaving space for real leadership profiles, photos, and role-specific bios to be added later."
            align="center"
          />

          <div className="grid gap-5 md:grid-cols-3">
            {publicLeadershipPlaceholders.map((item, index) => (
              <div
                key={item.name}
                className="rounded-[1.5rem] border bg-white p-6 text-center shadow-[0_24px_60px_-46px_rgba(15,23,42,0.24)]"
                style={{ borderColor: colors.border }}
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-700">
                  T{index + 1}
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-slate-950">
                  {item.role}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.detail}</p>
                <Button
                  asChild
                  variant="ghost"
                  className="mt-4 h-auto p-0 text-sm font-semibold text-[#1D4ED8] hover:bg-transparent hover:text-[#1E40AF]"
                >
                  <a href={item.linkedInUrl} target="_blank" rel="noreferrer">
                    Leadership profile
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicBottomCta
        title="Ready to talk about capability, team structure, or delivery support?"
        description="Use the public Tekorix site to move into the right path next: services overview, hiring support, direct contact, or candidate-side opportunities."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "Explore Services", href: "/services" }}
      />
    </>
  );
}
