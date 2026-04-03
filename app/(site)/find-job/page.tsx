import type { Metadata } from "next";

import { FindJobBottomCta } from "@/components/find-job/FindJobBottomCta";
import { FindJobCareerUpgrade } from "@/components/find-job/FindJobCareerUpgrade";
import { FindJobHero } from "@/components/find-job/FindJobHero";
import { FindJobMarketResume } from "@/components/find-job/FindJobMarketResume";
import { FindJobPublished } from "@/components/find-job/FindJobPublished";
import { FindJobSubmitResume } from "@/components/find-job/FindJobSubmitResume";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Find a Job with Tekorix",
  description:
    "Browse published jobs, apply directly, submit your resume, and stay visible for future product engineering and delivery roles with Tekorix.",
  path: "/find-job",
  keywords: ["find a job", "published jobs", "submit resume", "candidate profile"],
});

export default function FindJobPage() {
  return (
    <>
      <FindJobHero />
      <FindJobPublished />
      <FindJobSubmitResume />
      <FindJobCareerUpgrade />
      <FindJobMarketResume />
      <FindJobBottomCta />
    </>
  );
}
