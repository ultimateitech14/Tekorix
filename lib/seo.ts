import type { Metadata } from "next";

import { env } from "@/lib/env";
import { publicBrandContent } from "@/lib/constants/public-content";

const siteName = publicBrandContent.siteTitle;
const defaultImagePath = "/images/hero-fallback.svg";

export const noIndexRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
    nocache: true,
  },
};

export const noIndexFollowRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
    noimageindex: true,
  },
};

export function absoluteUrl(path = "/") {
  return new URL(path, `${env.NEXT_PUBLIC_SITE_URL}/`).toString();
}

export function absoluteAssetUrl(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return absoluteUrl(defaultImagePath);
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return absoluteUrl(normalized.startsWith("/") ? normalized : `/${normalized}`);
}

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  imagePath?: string;
  openGraphType?: "website" | "article";
  robots?: Metadata["robots"];
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

type ArticleJsonLdInput = {
  title: string;
  description: string;
  path: string;
  imagePath: string;
  keywords?: string[];
  section?: string;
  authorName: string;
  publisherName: string;
  publisherLogoPath: string;
};

type JobPostingJsonLdInput = {
  title: string;
  description: string;
  path: string;
  datePosted?: string | null;
  employmentType?: string;
  identifier: string;
  companyName: string;
  companyLogoPath: string;
  department?: string;
  locationName?: string;
  city?: string;
  country?: string;
  remote?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  imagePath = defaultImagePath,
  openGraphType = "website",
  robots,
}: BuildMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const socialImage = absoluteAssetUrl(imagePath);

  return {
    title,
    description,
    keywords,
    robots,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: openGraphType,
      url: canonical,
      siteName,
      images: [
        {
          url: socialImage,
          width: 1600,
          height: 900,
          alt: `${siteName} visual`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    image: [absoluteAssetUrl(input.imagePath)],
    articleSection: input.section,
    keywords: input.keywords,
    author: {
      "@type": "Organization",
      name: input.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: input.publisherName,
      logo: {
        "@type": "ImageObject",
        url: absoluteAssetUrl(input.publisherLogoPath),
      },
    },
  };
}

export function buildJobPostingJsonLd(input: JobPostingJsonLdInput) {
  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: input.companyName,
      sameAs: absoluteUrl("/"),
      logo: absoluteAssetUrl(input.companyLogoPath),
    },
    identifier: {
      "@type": "PropertyValue",
      name: input.companyName,
      value: input.identifier,
    },
    employmentType: input.employmentType,
    datePosted: input.datePosted ?? undefined,
    industry: input.department,
  };

  if (input.remote) {
    payload.jobLocationType = "TELECOMMUTE";
  } else if (input.locationName || input.city || input.country) {
    payload.jobLocation = [
      {
        "@type": "Place",
        name: input.locationName,
        address: {
          "@type": "PostalAddress",
          addressLocality: input.city || input.locationName,
          addressCountry: input.country,
        },
      },
    ];
  }

  return payload;
}

export const seoSiteName = siteName;
