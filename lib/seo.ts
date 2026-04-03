import type { Metadata } from "next";

import { env } from "@/lib/env";
import { publicBrandContent } from "@/lib/constants/public-content";

const siteName = publicBrandContent.siteTitle;
const defaultImagePath = "/images/hero-fallback.svg";

export function absoluteUrl(path = "/") {
  return new URL(path, `${env.NEXT_PUBLIC_SITE_URL}/`).toString();
}

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function buildMetadata({ title, description, path, keywords = [] }: BuildMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const socialImage = absoluteUrl(defaultImagePath);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
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

export const seoSiteName = siteName;
