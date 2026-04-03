import type { Metadata } from "next";

import { FindTalentBench } from "@/components/find-talent/FindTalentBench";
import { FindTalentBottomCta } from "@/components/find-talent/FindTalentBottomCta";
import { FindTalentHero } from "@/components/find-talent/FindTalentHero";
import { FindTalentLeadForm } from "@/components/find-talent/FindTalentLeadForm";
import { FindTalentModels } from "@/components/find-talent/FindTalentModels";
import { FindTalentOptions } from "@/components/find-talent/FindTalentOptions";
import { FindTalentTrustStrip } from "@/components/find-talent/FindTalentTrustStrip";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hire Talent, Teams, and Bench Resources",
  description:
    "Tekorix helps companies hire permanent talent, deploy on-roll consultants, and build product engineering teams with flexible engagement models.",
  path: "/find-talent",
  keywords: ["hire talent", "contract staffing", "bench resources", "product engineering teams"],
});

export default function FindTalentPage() {
  return (
    <>
      <FindTalentHero />
      <FindTalentModels />
      <FindTalentBench />
      <FindTalentOptions />
      <FindTalentTrustStrip />
      <FindTalentLeadForm />
      <FindTalentBottomCta />
    </>
  );
}
