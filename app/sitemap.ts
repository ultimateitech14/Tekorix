import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings-store";
import { academyPrograms } from "@/lib/constants/academy-programs";

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
const academyProgramRoutes = academyPrograms.map((item) => `/academy/${item.id}`);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteSettings = await getSiteSettings();
  const publicRoutes = siteSettings.careersPublished
    ? [...baseRoutes, ...academyProgramRoutes, ...careersRoutes]
    : [...baseRoutes, ...academyProgramRoutes];
  const lastModified = new Date();

  return publicRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
