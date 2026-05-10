import type { MetadataRoute } from "next";

import { listPublicBlogPosts } from "@/lib/api/blog-posts";
import { listPublicJobs } from "@/lib/api/jobs";
import { getPublicSiteSettings } from "@/lib/api/site-settings";
import { absoluteUrl } from "@/lib/seo";
import { blogPosts as fallbackBlogPosts } from "@/lib/constants/blog-posts";
import { serviceCatalog } from "@/lib/constants/service-catalog";
import { getSiteSettings } from "@/lib/site-settings-store";
import { academyPrograms } from "@/lib/constants/academy-programs";
import { buildPublicJobPath, getPublicJobPostedAt } from "@/lib/public-jobs";

const baseRoutes = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/find-job",
  "/find-talent",
  "/blog",
  "/business-consulting",
  "/academy",
  "/hr-consulting",
  "/industries",
  "/clients",
  "/technologies",
];
const careersRoutes = ["/careers", "/careers/job-results"];
const academyProgramRoutes = academyPrograms.map((item) => `/academy/${item.id}`);
const serviceRoutes = serviceCatalog.map((item) => `/services/${item.id}`);

function getRoutePriority(path: string) {
  if (path === "/") {
    return 1;
  }

  if (path === "/find-talent" || path === "/find-job" || path === "/services" || path === "/careers") {
    return 0.9;
  }

  if (
    path.startsWith("/services/") ||
    path.startsWith("/academy/") ||
    path.startsWith("/blog/") ||
    path.startsWith("/jobs/")
  ) {
    return 0.8;
  }

  if (path === "/blog" || path === "/contact") {
    return 0.8;
  }

  return 0.7;
}

function getChangeFrequency(path: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (path === "/" || path === "/find-job" || path === "/careers" || path === "/blog") {
    return "weekly";
  }

  if (path.startsWith("/blog/") || path.startsWith("/jobs/")) {
    return "monthly";
  }

  return "monthly";
}

async function listAllPublicJobs() {
  try {
    const firstPage = await listPublicJobs({ page: 1, pageSize: 100 });

    if (firstPage.totalPages <= 1) {
      return firstPage.items;
    }

    const remainingPages = await Promise.all(
      Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
        listPublicJobs({ page: index + 2, pageSize: 100 }).catch(() => null),
      ),
    );

    return [
      ...firstPage.items,
      ...remainingPages.flatMap((page) => page?.items ?? []),
    ];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [siteSettings, publicBlogPosts, publicJobs] = await Promise.all([
    getPublicSiteSettings().catch(() => getSiteSettings()),
    listPublicBlogPosts().catch(() => fallbackBlogPosts),
    listAllPublicJobs(),
  ]);
  const publicRoutes = siteSettings.careersPublished
    ? [...baseRoutes, ...serviceRoutes, ...academyProgramRoutes, ...careersRoutes]
    : [...baseRoutes, ...serviceRoutes, ...academyProgramRoutes];
  const blogRoutes = publicBlogPosts.map((post) => `/blog/${post.slug}`);
  const jobEntries = siteSettings.careersPublished
    ? publicJobs.map((job) => ({
        path: buildPublicJobPath(job.slug),
        lastModified: new Date(getPublicJobPostedAt(job)),
      }))
    : [];
  const routeEntries = Array.from(new Set([...publicRoutes, ...blogRoutes])).map((path) => ({
    path,
    lastModified: new Date(),
  }));
  const uniqueEntries = Array.from(
    new Map(
      [...routeEntries, ...jobEntries].map((entry) => [entry.path, entry]),
    ).values(),
  );

  return uniqueEntries.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: entry.lastModified,
    changeFrequency: getChangeFrequency(entry.path),
    priority: getRoutePriority(entry.path),
  }));
}
