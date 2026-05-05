import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/site/Container";
import { HeroBackgroundVideo } from "@/components/site/HeroBackgroundVideo";
import { CompanyEmailButtonLink, CompanyNameText } from "@/components/site/company-profile-client";
import { JobSearchPanel } from "@/components/site/jobs/JobSearchPanel";
import { JobResultsView } from "@/components/site/jobs/JobResultsView";
import { Button } from "@/components/ui/button";
import { getPublicSiteSettings } from "@/lib/api/site-settings";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings-store";
import {
  ENABLE_3D_HERO_VIDEO,
  HERO_VIDEO_FALLBACK,
  HERO_VIDEO_OPACITY,
  HERO_VIDEO_PLAYBACK_RATE,
  HERO_VIDEO_PRIMARY,
} from "@/lib/ui-flags";

export const metadata: Metadata = buildMetadata({
  title: "Job Search Results",
  description: "Search and filter current opportunities across Tekorix teams.",
  path: "/careers/job-results",
  keywords: ["job results", "careers", "open positions"],
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JobResultsPage() {
  const siteSettings = await getPublicSiteSettings().catch(() => getSiteSettings());

  if (!siteSettings.careersPublished) {
    return (
      <section className="section-space border-b border-border/60">
        <Container>
          <div className="max-w-3xl space-y-6">
            <p className="type-eyebrow">Careers</p>
            <h1 className="type-display text-balance">Job Search Is Currently Unavailable</h1>
            <p className="type-lead text-slate-600">
              The careers page is unpublished right now. Please contact{" "}
              <CompanyNameText fallback={siteSettings.companyName} /> for hiring information.
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
        </Container>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#BED9F3] public-section">
        {ENABLE_3D_HERO_VIDEO ? (
          <HeroBackgroundVideo
            className="hero-fx-motion absolute inset-0 h-full w-full scale-[1.08] object-cover brightness-[0.9] saturate-95 contrast-90"
            poster="/images/hero-fallback.svg"
            primarySrc={HERO_VIDEO_PRIMARY}
            fallbackSrc={HERO_VIDEO_FALLBACK}
            opacity={HERO_VIDEO_OPACITY}
            playbackRate={HERO_VIDEO_PLAYBACK_RATE}
          />
        ) : (
          <div className="absolute inset-0 bg-[url('/images/hero-fallback.svg')] bg-cover bg-center opacity-16" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(238,246,255,0.92)_0%,rgba(211,232,255,0.96)_100%)]" />
        {ENABLE_3D_HERO_VIDEO ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(82%_44%_at_76%_14%,rgba(96,165,250,0.16),transparent_64%)]" />
            <div className="absolute inset-0 backdrop-blur-[0.3px]" />
          </>
        ) : null}
        <div className="pointer-events-none absolute -right-24 top-8 h-64 w-64 rounded-full bg-blue-200/60 blur-3xl" />
        <Container>
          <div className="relative max-w-5xl space-y-5">
            <p className="type-eyebrow">Careers</p>
            <h1 className="type-display max-w-4xl text-slate-950">Job Search</h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Explore current opportunities and quickly find roles that match your skills, location, and
              preferred work style.
            </p>
            <div className="pt-2">
              <Suspense fallback={<div className="h-[68px] rounded-2xl border border-[#BED9F3] bg-[#F8FBFF]" />}>
                <JobSearchPanel />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#E6F1FF] public-section">
        <Container>
          <Suspense fallback={<p className="text-sm text-slate-600">Loading job search...</p>}>
            <JobResultsView talentNetworkHref="/find-job#submit-resume" />
          </Suspense>
        </Container>
      </section>
    </>
  );
}

