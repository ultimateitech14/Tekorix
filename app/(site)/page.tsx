import type { Metadata } from "next";

import { HomeBlog } from "@/components/home/HomeBlog";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProfiles } from "@/components/home/HomeProfiles";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeStats } from "@/components/home/HomeStats";
import { tekorixBrand } from "@/lib/constants/branding";
import { publicBrandContent, publicSocialLinks } from "@/lib/constants/public-content";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Build Teams, Specialists, and Capability Centers",
  description:
    "Tekorix helps enterprises build product engineering teams, specialist hiring pipelines, and capability centers across consulting, delivery, and talent services.",
  path: "/",
  keywords: ["product engineering teams", "gcc team building", "technology staffing", "engineering services"],
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: publicBrandContent.companyName,
  url: absoluteUrl("/"),
  logo: absoluteUrl(tekorixBrand.logo.src),
  sameAs: [publicSocialLinks.linkedinCompany],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: publicBrandContent.companyName,
  url: absoluteUrl("/"),
  potentialAction: {
    "@type": "SearchAction",
    target: `${absoluteUrl("/")}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <HomeHero />
      <HomeStats />
      <HomeServices />
      <HomeProfiles />
      <HomeBlog />
    </>
  );
}
