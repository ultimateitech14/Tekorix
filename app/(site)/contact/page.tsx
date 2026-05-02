import type { Metadata } from "next";

import { ContactDirectInfo } from "@/components/contact/ContactDirectInfo";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactInquiryGrid } from "@/components/contact/ContactInquiryGrid";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Tekorix",
  description:
    "Reach Tekorix for company hiring inquiries, candidate outreach, direct support, and delivery-focused conversations.",
  path: "/contact",
  keywords: ["contact tekorix", "company inquiry", "candidate inquiry", "engineering support"],
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactInquiryGrid />
      <ContactDirectInfo />
    </>
  );
}
