/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";

import { Hero } from "@/components/site/Hero";
import { LinkCard } from "@/components/site/LinkCard";
import { Section } from "@/components/site/Section";
import { TabsPills } from "@/components/site/TabsPills";
import { CompanyEmailButtonLink, CompanyNameText } from "@/components/site/company-profile-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    title: "Meaningful Work",
    description: "Contribute to engineering programs that improve critical products and public services.",
  },
  {
    title: "Modern Tooling",
    description: "Work with cloud-native stacks, AI-assisted workflows, and platform-first practices.",
  },
  {
    title: "Global Community",
    description: "Collaborate with multidisciplinary teams across regions, cultures, and domains.",
  },
  {
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

const DEFAULT_PROFILE_IMAGE = "/images/profiles/profile-3.svg";

export default async function CareersPage() {
  const siteSettings = await getSiteSettings();

  if (!siteSettings.careersPublished) {
    return (
      <section className="section-space border-b border-border/60">
        <div className="site-container">
          <div className="max-w-3xl space-y-6">
            <p className="type-eyebrow">Careers</p>
            <h1 className="type-display text-balance">The Careers Page Is Currently Unpublished</h1>
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
        <Card className="rounded-[1.5rem] border border-slate-200 bg-[#DCEEFF] shadow-[0_24px_60px_-44px_rgba(15,23,42,0.2)]">
          <CardContent className="space-y-3 p-6">
            <p className="type-eyebrow">People promise</p>
            <p className="text-sm leading-relaxed text-slate-600">
              At <CompanyNameText fallback={siteSettings.companyName} />, we invest in growth, give teams space to
              create, and celebrate practical excellence.
            </p>
          </CardContent>
        </Card>
      </Hero>

      <Section
        id="why-join-us"
        eyebrow="Why join us"
        title="A Career Model Built for Growth and Impact"
        description="From mentorship to mobility, we design environments where teams can do their best work."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {whyJoinCards.map((item) => (
            <Card
              key={item.title}
              className="rounded-[1.5rem] border border-slate-200 bg-[#DCEEFF] shadow-[0_22px_55px_-44px_rgba(15,23,42,0.2)]"
            >
              <CardContent className="space-y-3 p-6">
                <h2 className="type-h3">{item.title}</h2>
                <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {siteSettings.careersShowTeamPhotos && siteSettings.careersTeamMembers.length ? (
        <Section
          id="team"
          className="pt-6"
          eyebrow="Meet the team"
          title={
            <>
              People Building <CompanyNameText fallback={siteSettings.companyName} />
            </>
          }
          description="A quick look at team members behind delivery, product craft, and hiring."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {siteSettings.careersTeamMembers.map((member) => (
              <Card
                key={member.id}
                className="rounded-[1.5rem] border border-slate-200 bg-[#DCEEFF] shadow-[0_22px_55px_-44px_rgba(15,23,42,0.2)]"
              >
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.photo || DEFAULT_PROFILE_IMAGE}
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
        className="pt-6"
        eyebrow="Early careers / Academy"
        title="Start Strong and Keep Learning"
        description="Programs designed for graduates and career switchers building modern engineering capability."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {earlyCareerCards.map((item) => (
            <LinkCard
              key={item.title}
              title={item.title}
              description={item.description}
              href={item.href}
              ctaLabel="Explore path"
            />
          ))}
        </div>
      </Section>

      <Section
        id="job-categories"
        className="pt-6"
        eyebrow="Job categories"
        title="Explore Opportunity Areas"
        description="Filter by category to preview the types of roles our teams are hiring for."
      >
        <TabsPills tabs={jobCategoryTabs} />
      </Section>

      <Section
        id="submit-resume"
        className="pt-6"
        eyebrow="Talent network"
        title="Submit Your Resume"
        description="The primary candidate funnel now lives on the Find Job page, while careers content remains available here."
      >
        <Card className="rounded-[1.5rem] border border-slate-200 bg-[#DCEEFF] shadow-[0_22px_55px_-44px_rgba(15,23,42,0.2)]">
          <CardContent className="grid gap-5 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <h2 className="type-h2">Candidate profile</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Use the newer Tekorix candidate funnel to browse published jobs, submit your resume, and
                stay visible for future openings while this legacy careers overview remains available.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="border-0 bg-[#1B66B3] text-white shadow-[0_20px_40px_-22px_rgba(27,102,179,0.55)] hover:bg-[#145188]"
              >
                <Link href="/find-job">View Find Job</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#7FB5EA] bg-[#DCEEFF] text-slate-950 hover:bg-[#CFE3FF]">
                <Link href="/find-job#submit-resume">Submit Resume</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}

