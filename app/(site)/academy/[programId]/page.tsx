import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import {
  academyPrograms,
  getAcademyProgramById,
  getRelatedAcademyPrograms,
} from "@/lib/constants/academy-programs";
import { themeTokens } from "@/lib/theme/tokens";

type AcademyProgramDetailPageProps = {
  params: {
    programId: string;
  };
};

export function generateStaticParams() {
  return academyPrograms.map((item) => ({ programId: item.id }));
}

export function generateMetadata({ params }: AcademyProgramDetailPageProps): Metadata {
  const program = getAcademyProgramById(params.programId);

  if (!program) {
    return buildMetadata({
      title: "Program Not Found",
      description: "The requested academy program page could not be found.",
      path: "/academy",
    });
  }

  return buildMetadata({
    title: program.title,
    description: program.shortDescription,
    path: `/academy/${program.id}`,
    keywords: [program.title.toLowerCase(), "academy program", "tekorix academy"],
  });
}

export default function AcademyProgramDetailPage({ params }: AcademyProgramDetailPageProps) {
  const program = getAcademyProgramById(params.programId);
  const { colors } = themeTokens;

  if (!program) {
    notFound();
  }

  const relatedPrograms = getRelatedAcademyPrograms(program.id);

  return (
    <>
      <section className="bg-[#E6F1FF] public-section">
        <div className="site-container">
          <div className="mb-8">
            <Button asChild variant="ghost" className="px-0 text-[#1B66B3] hover:bg-transparent hover:text-[#145188]">
              <Link href="/academy">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Academy Programs
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-6 lg:col-span-8">
              <div className="flex flex-col gap-5 rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
                <span
                  className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  <program.icon className="h-9 w-9" />
                </span>

                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1B66B3]">Academy Program</p>
                  <h1 className="type-display text-slate-950">{program.title}</h1>
                  <p className="type-lead text-slate-600">{program.shortDescription}</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-6 shadow-sm sm:p-8">
                <h2 className="type-h2 text-slate-950">Overview</h2>
                <p className="type-body mt-4 text-slate-600">{program.description}</p>
              </div>

              <div className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-6 shadow-sm sm:p-8">
                <h2 className="type-h2 text-slate-950">Program focus</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {program.focusPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3 rounded-xl bg-[#EDF5FF] px-4 py-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1B66B3]" />
                      <span className="type-body-sm text-slate-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-6 shadow-sm sm:p-8">
                <h2 className="type-h2 text-slate-950">Outcomes</h2>
                <div className="mt-6 space-y-4">
                  {program.outcomes.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-3 rounded-xl bg-[#EDF5FF] px-4 py-4">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1B66B3]" />
                      <span className="type-body-sm text-slate-700">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-28">
                <div className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-6 shadow-sm">
                  <h3 className="type-h2 text-slate-950">Need this program?</h3>
                  <p className="type-body-sm mt-4 text-slate-700">
                    Move forward with a focused conversation for this academy pathway and your target outcome.
                  </p>

                  <div className="mt-6 space-y-3">
                    <Button asChild className="w-full shadow-sm">
                      <Link href="/contact">Talk to Us</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-transparent bg-white/90 hover:bg-[#E6F1FF]">
                      <Link href="/academy">View All Programs</Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-6 shadow-sm">
                  <h4 className="type-h3 text-slate-950">Related programs</h4>
                  <div className="mt-4 space-y-3">
                    {relatedPrograms.map((item) => (
                      <Link
                        key={item.id}
                        href={`/academy/${item.id}`}
                        className="block rounded-xl bg-[#EDF5FF] px-4 py-4 transition-colors hover:bg-[#E6F1FF]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF5FF] text-[#1B66B3]">
                            <item.icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="type-body-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="type-body-sm mt-1 text-slate-600">{item.shortDescription}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicBottomCta
        title="Need help finalizing the right academy program?"
        description="Start with all academy programs, then continue with the exact program page that matches your requirement."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "View All Programs", href: "/academy" }}
      />
    </>
  );
}
