import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  MapPin,
  Sparkles,
  Wallet,
} from "lucide-react";
import { notFound } from "next/navigation";

import type { PublicJob } from "@/lib/api/jobs";
import { getPublicJobBySlug } from "@/lib/api/jobs";
import { PublicJobApplyActions } from "@/components/site/jobs/PublicJobApplyActions";
import { Button } from "@/components/ui/button";
import { tekorixBrand } from "@/lib/constants/branding";
import { publicBrandContent } from "@/lib/constants/public-content";
import {
  buildBreadcrumbJsonLd,
  buildJobPostingJsonLd,
  buildMetadata,
} from "@/lib/seo";
import {
  buildPublicJobKeywords,
  buildPublicJobMetaDescription,
  buildPublicJobPath,
  formatPublicJobPostedDate,
  formatPublicJobReference,
  formatPublicJobType,
  getPublicJobPostedAt,
  isRemotePublicJob,
  mapPublicJobEmploymentType,
  normalizePublicJobText,
} from "@/lib/public-jobs";

type PublicJobDetailPageProps = {
  params: {
    slug: string;
  };
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function resolvePublicJob(slug: string) {
  try {
    return await getPublicJobBySlug(slug);
  } catch {
    return null;
  }
}

function buildRoleSummary(job: PublicJob) {
  return normalizePublicJobText(job.description);
}

export async function generateMetadata({ params }: PublicJobDetailPageProps): Promise<Metadata> {
  const job = await resolvePublicJob(params.slug);

  if (!job) {
    return buildMetadata({
      title: "Job Not Found",
      description: "The requested job page could not be found.",
      path: "/careers/job-results",
    });
  }

  return buildMetadata({
    title: `${job.title} | ${publicBrandContent.companyName} Careers`,
    description: buildPublicJobMetaDescription(job),
    path: buildPublicJobPath(job.slug),
    keywords: buildPublicJobKeywords(job),
  });
}

export default async function PublicJobDetailPage({ params }: PublicJobDetailPageProps) {
  const job = await resolvePublicJob(params.slug);

  if (!job) {
    notFound();
  }

  const jobPath = buildPublicJobPath(job.slug);
  const postedAt = getPublicJobPostedAt(job);
  const roleSummary = buildRoleSummary(job);
  const roleParagraphs = job.description
    .split(/\n+/)
    .map((paragraph) => normalizePublicJobText(paragraph))
    .filter(Boolean);
  const heroSummary = roleParagraphs[0] ?? roleSummary;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
    { name: "Job Search", path: "/careers/job-results" },
    { name: job.title, path: jobPath },
  ]);
  const jobPostingJsonLd = buildJobPostingJsonLd({
    title: job.title,
    description: roleSummary,
    path: jobPath,
    datePosted: postedAt,
    employmentType: mapPublicJobEmploymentType(job.type),
    identifier: job.id,
    companyName: publicBrandContent.companyName,
    companyLogoPath: tekorixBrand.logo.src,
    department: job.department,
    locationName: job.location,
    city: job.city,
    country: job.country,
    remote: isRemotePublicJob(job),
  });

  return (
    <section className="bg-[#E6F1FF] public-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />
      <div className="site-container">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Button asChild variant="ghost" className="px-0 text-[#1B66B3] hover:bg-transparent hover:text-[#145188]">
            <Link href="/careers/job-results">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Job Search
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#BED9F3] bg-white/90 text-slate-900 hover:bg-[#F8FBFF]"
          >
            <Link href="/find-job#published-jobs">Browse on Find Job</Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-[linear-gradient(160deg,#F9FCFF_0%,#ECF5FF_100%)] p-6 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.32)] sm:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#EDF5FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B66B3]">
                  Ref {formatPublicJobReference(job.id)}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                  {formatPublicJobType(job.type)}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                  {job.department}
                </span>
                {isRemotePublicJob(job) ? (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                    Remote-friendly
                  </span>
                ) : null}
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1B66B3]">
                  {publicBrandContent.companyName} careers
                </p>
                <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {job.title}
                </h1>
                <p className="max-w-4xl text-base leading-8 text-slate-600 sm:text-lg">
                  {heroSummary}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-[#F8FBFF] px-4 py-4 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.24)]">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <MapPin className="h-4 w-4" />
                  Location
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">{job.location}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#F8FBFF] px-4 py-4 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.24)]">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <BriefcaseBusiness className="h-4 w-4" />
                  Experience
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">{job.experience}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#F8FBFF] px-4 py-4 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.24)]">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  Posted
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">{formatPublicJobPostedDate(postedAt)}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#F8FBFF] px-4 py-4 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.24)]">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <Wallet className="h-4 w-4" />
                  Salary
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">{job.salaryRange || "As per fitment"}</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-[#F8FBFF] p-6 shadow-[0_24px_56px_-44px_rgba(15,23,42,0.28)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Role overview</h2>
              <div className="mt-5 space-y-4">
                {roleParagraphs.length ? (
                  roleParagraphs.map((paragraph, index) => (
                    <p key={`${job.id}-paragraph-${index}`} className="text-base leading-8 text-slate-700">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-base leading-8 text-slate-700">{roleSummary}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[1.75rem] bg-[#F8FBFF] p-6 shadow-[0_24px_56px_-44px_rgba(15,23,42,0.28)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Key skills</h2>
                {job.skills?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 text-base leading-8 text-slate-700">
                    Apply with your most relevant skills, tools, and project experience for this role.
                  </p>
                )}
              </div>

              <div className="rounded-[1.75rem] bg-[#F8FBFF] p-6 shadow-[0_24px_56px_-44px_rgba(15,23,42,0.28)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Why this page matters</h2>
                <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
                  <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4">
                    <Building2 className="mt-1 h-5 w-5 shrink-0 text-[#1B66B3]" />
                    <p>Google can understand this role directly because the page has dedicated job metadata and schema.</p>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4">
                    <Sparkles className="mt-1 h-5 w-5 shrink-0 text-[#1B66B3]" />
                    <p>Candidates still see the same jobs list first, then open this page only when they want full role details.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28">
            <PublicJobApplyActions job={job} />
          </aside>
        </div>
      </div>
    </section>
  );
}
