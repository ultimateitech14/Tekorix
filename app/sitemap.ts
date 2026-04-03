import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings-store";

const baseRoutes = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/find-job",
  "/find-talent",
  "/business-consulting",
  "/academy",
  "/industries",
  "/clients",
  "/technologies",
];
const careersRoutes = ["/careers", "/careers/job-results"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteSettings = await getSiteSettings();
  const publicRoutes = siteSettings.careersPublished ? [...baseRoutes, ...careersRoutes] : baseRoutes;
  const lastModified = new Date();

  return publicRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
