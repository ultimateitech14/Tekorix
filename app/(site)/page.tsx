import type { Metadata } from "next";

import { listPublicBlogPosts } from "@/lib/api/blog-posts";
import { HomeBlog } from "@/components/home/HomeBlog";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProfiles } from "@/components/home/HomeProfiles";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeStats } from "@/components/home/HomeStats";
import { getPublicSiteSettings } from "@/lib/api/site-settings";
import { blogPosts as fallbackBlogPosts } from "@/lib/constants/blog-posts";
import { tekorixBrand } from "@/lib/constants/branding";
import { publicBrandContent, publicSocialLinks } from "@/lib/constants/public-content";
import { getSiteSettings } from "@/lib/site-settings-store";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [siteSettings, publicBlogPosts] = await Promise.all([
    getPublicSiteSettings().catch(() => getSiteSettings()),
    listPublicBlogPosts().catch(() => fallbackBlogPosts),
  ]);

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
      <HomeProfiles
        profiles={siteSettings.talentProfiles}
        eyebrow={siteSettings.talentProfilesEyebrow}
        title={siteSettings.talentProfilesHeadline}
        description={siteSettings.talentProfilesDescription}
      />
      <HomeBlog posts={publicBlogPosts.slice(0, 5)} />
    </>
  );
}
