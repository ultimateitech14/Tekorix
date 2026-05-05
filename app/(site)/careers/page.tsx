/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Compass,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";

import { Hero } from "@/components/site/Hero";
import { LinkCard } from "@/components/site/LinkCard";
import { Section } from "@/components/site/Section";
import { TabsPills } from "@/components/site/TabsPills";
import { CompanyEmailButtonLink, CompanyNameText } from "@/components/site/company-profile-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resolveAssetUrl } from "@/lib/asset-url";
import { getPublicSiteSettings } from "@/lib/api/site-settings";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings-store";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description: "Join Tekorix teams delivering modern engineering outcomes across industries.",
  path: "/careers",
  keywords: ["technology careers", "engineering jobs", "early careers"],
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

const whyJoinCards = [
  {
    icon: Sparkles,
    title: "Meaningful Work",
    description: "Contribute to engineering programs that improve critical products and public services.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Modern Tooling",
    description: "Work with cloud-native stacks, AI-assisted workflows, and platform-first practices.",
  },
  {
    icon: Users2,
    title: "Global Community",
    description: "Collaborate with multidisciplinary teams across regions, cultures, and domains.",
  },
  {
    icon: Compass,
    title: "Growth Pathways",
    description: "Build your career through mentorship, certification tracks, and leadership programs.",
  },
];

const earlyCareerCards = [
  {
    title: "Graduate Launchpad",
    description: "A structured first-year experience with rotations, coaching, and project exposure.",
    href: "#submit-resume",
  },
  {
    title: "Academy Tracks",
    description: "Hands-on pathways in cloud engineering, data platforms, and intelligent automation.",
    href: "/academy",
  },
  {
    title: "Live Job Search",
    description: "Browse current openings when you want to move directly from careers context into live roles.",
    href: "/careers/job-results",
  },
];

const jobCategoryTabs = [
  {
    id: "engineering",
    label: "Engineering",
    title: "Engineering roles",
    description: "Open opportunities across software, cloud, platform reliability, and quality engineering.",
    items: ["Software Engineer", "Cloud Platform Engineer", "DevOps / SRE", "QA Automation Engineer"],
  },
  {
    id: "data-ai",
    label: "Data & AI",
    title: "Data and AI roles",
    description: "Positions focused on advanced analytics, ML operations, and trustworthy AI delivery.",
    items: ["Data Engineer", "ML Engineer", "Applied AI Specialist", "Analytics Consultant"],
  },
  {
    id: "consulting",
    label: "Consulting",
    title: "Consulting roles",
    description: "Roles that blend business strategy and engineering execution across transformation work.",
    items: ["Technology Consultant", "Transformation Lead", "Enterprise Architect", "Program Manager"],
  },
];

const careerSignals = [
  {
    icon: BriefcaseBusiness,
    title: "Published roles",
    description: "Browse active openings or move into the broader talent network when the right role is still forming.",
  },
  {
    icon: ShieldCheck,
    title: "Structured support",
    description: "Tekorix combines team context, role visibility, and candidate guidance in one careers journey.",
  },
  {
    icon: GraduationCap,
    title: "Learning paths",
    description: "Career growth does not stop at one application. Academy and coaching routes stay connected.",
  },
];

const DEFAULT_PROFILE_IMAGE = "/images/profiles/profile-3.svg";

export default async function CareersPage() {
  const siteSettings = await getPublicSiteSettings().catch(() => getSiteSettings());

  if (!siteSettings.careersPublished) {
    return (
      <section className="section-space border-b border-border/60">
        <div className="site-container">
          <div className="max-w-3xl space-y-6">
            <p className="type-eyebrow">Careers</p>
            <h1 className="type-display text-balance">The careers page is currently unpublished</h1>
            <p className="type-lead text-slate-600">
              Hiring updates are temporarily unavailable. Please contact{" "}
              <CompanyNameText fallback={siteSettings.companyName} /> for the latest openings.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="border-0 bg-[#1B66B3] text-white shadow-[0_20px_40px_-22px_rgba(27,102,179,0.55)] hover:bg-[#145188]"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <CompanyEmailButtonLink fallback={siteSettings.companyEmail} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Hero
        eyebrow="Careers"
        title={siteSettings.careersHeadline}
        description={siteSettings.careersSubtitle}
        primaryCta={{ label: "Find a Job", href: "/find-job#published-jobs" }}
        secondaryCta={{ label: "Submit Resume", href: "/find-job#submit-resume", variant: "outline" }}
      >
        <Card className="rounded-[1.5rem] border border-slate-200 bg-[#F8FBFF] shadow-[0_24px_60px_-44px_rgba(15,23,42,0.2)]">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-3">
              <p className="type-eyebrow">People promise</p>
              <p className="text-sm leading-relaxed text-slate-600">
                At <CompanyNameText fallback={siteSettings.companyName} />, we invest in growth, give teams space to
                create, and celebrate practical excellence.
              </p>
            </div>

            <div className="grid gap-3">
              {careerSignals.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[#D7E8FA] bg-white/80 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1B66B3] text-white shadow-[0_18px_34px_-22px_rgba(27,102,179,0.58)]">
                      <item.icon className="h-4.5 w-4.5" />
                    </span>
                    <div className="space-y-1.5">
                      <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                      <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/careers/job-results"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B66B3] transition-colors hover:text-[#145188]"
            >
              Explore live job search
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </Hero>

      <section className="bg-[#F8FBFF] public-section">
        <div className="site-container">
          <div className="grid gap-4 lg:grid-cols-3">
            {careerSignals.map((item) => (
              <Card
                key={`${item.title}-strip`}
                className="rounded-[1.5rem] border border-slate-200 bg-[#F8FBFF] shadow-[0_22px_55px_-44px_rgba(15,23,42,0.18)]"
              >
                <CardContent className="flex h-full items-start gap-4 p-6">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDF5FF] text-[#1B66B3]">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-950">{item.title}</h2>
                    <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Section
        id="why-join-us"
        className="bg-[#EAF4FF]"
        eyebrow="Why join us"
        title="A career model built for growth, visibility, and better role alignment."
        description="From mentorship to mobility, we design environments where teams can do their best work without losing product context or career momentum."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {whyJoinCards.map((item) => (
            <Card
              key={item.title}
              className="rounded-[1.5rem] border border-slate-200 bg-[#F8FBFF] shadow-[0_22px_55px_-44px_rgba(15,23,42,0.2)]"
            >
              <CardContent className="space-y-4 p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#EDF5FF] text-[#1B66B3]">
                  <item.icon className="h-5 w-5" />
                </span>
                <div className="space-y-3">
                  <h2 className="type-h3">{item.title}</h2>
                  <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {siteSettings.careersShowTeamPhotos && siteSettings.careersTeamMembers.length ? (
        <Section
          id="team"
          eyebrow="Meet the team"
          title={
            <>
              People building <CompanyNameText fallback={siteSettings.companyName} />
            </>
          }
          description="A quick look at team members behind delivery, product craft, and hiring."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {siteSettings.careersTeamMembers.map((member) => (
              <Card
                key={member.id}
                className="rounded-[1.5rem] border border-slate-200 bg-[#F8FBFF] shadow-[0_22px_55px_-44px_rgba(15,23,42,0.2)]"
              >
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={resolveAssetUrl(member.photo || DEFAULT_PROFILE_IMAGE)}
                      alt={member.name || "Team member"}
                      className="h-14 w-14 rounded-full border border-border/70 object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{member.name || "Team Member"}</p>
                      <p className="text-xs text-slate-500">{member.role || "Role"}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {member.blurb || "Add a short bio from admin careers controls."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      <Section
        id="early-careers"
        className="bg-[#F8FBFF]"
        eyebrow="Career routes"
        title="Start strong, keep learning, and move into stronger teams with more clarity."
        description="Use the route that matches your stage, whether you are entering the market, reskilling, or looking for current published openings."
        actions={
          <Button
            asChild
            variant="outline"
            className="border-[#BED9F3] bg-[#F8FBFF] text-slate-950 hover:bg-[#E6F1FF]"
          >
            <Link href="/academy">View Academy</Link>
          </Button>
        }
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {earlyCareerCards.map((item) => (
            <LinkCard
              key={item.title}
              title={item.title}
              description={item.description}
              href={item.href}
              ctaLabel={item.href === "/careers/job-results" ? "Browse roles" : "Explore path"}
            />
          ))}
        </div>
      </Section>

      <Section
        id="job-categories"
        eyebrow="Job categories"
        title="Explore opportunity areas without leaving the public careers journey."
        description="Filter by category to preview the kinds of roles teams are hiring for before moving into the live search flow."
        actions={
          <Button
            asChild
            variant="outline"
            className="border-[#BED9F3] bg-[#F8FBFF] text-slate-950 hover:bg-[#E6F1FF]"
          >
            <Link href="/careers/job-results">Open job search</Link>
          </Button>
        }
      >
        <TabsPills tabs={jobCategoryTabs} />
      </Section>

      <Section
        id="submit-resume"
        className="bg-[#EAF4FF]"
        eyebrow="Talent network"
        title="Keep your profile visible even before the next exact role appears."
        description="The primary candidate funnel now lives on the Find Job page, while this careers page remains the context layer around roles, team information, and growth routes."
      >
        <Card className="rounded-[1.5rem] border border-slate-200 bg-[#F8FBFF] shadow-[0_22px_55px_-44px_rgba(15,23,42,0.2)]">
          <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <h2 className="type-h2">Candidate profile</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Use the newer Tekorix candidate funnel to browse published jobs, submit your resume, and
                stay visible for future openings while this careers overview helps candidates understand the
                team, role paths, and growth model first.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#D7E8FA] bg-white/80 px-4 py-4 text-sm text-slate-600">
                  Published job discovery and direct application flow.
                </div>
                <div className="rounded-2xl border border-[#D7E8FA] bg-white/80 px-4 py-4 text-sm text-slate-600">
                  Resume submission route for current and near-term openings.
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              <Button
                asChild
                className="border-0 bg-[#1B66B3] text-white shadow-[0_20px_40px_-22px_rgba(27,102,179,0.55)] hover:bg-[#145188]"
              >
                <Link href="/find-job">View Find Job</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#BED9F3] bg-[#F8FBFF] text-slate-950 hover:bg-[#E6F1FF]"
              >
                <Link href="/find-job#submit-resume">Submit Resume</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
