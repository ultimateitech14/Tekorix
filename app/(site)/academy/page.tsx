import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { buildMetadata } from "@/lib/seo";
import { academyPrograms } from "@/lib/constants/academy-programs";
import { themeTokens } from "@/lib/theme/tokens";

export const metadata: Metadata = buildMetadata({
  title: "All Academy Programs",
  description:
    "Explore all Tekorix academy programs including corporate training, upskilling tracks, and certification support.",
  path: "/academy",
  keywords: ["all academy programs", "corporate training", "upskilling", "certification"],
});

export default function AcademyPage() {
  const { colors } = themeTokens;

  return (
    <>
      <section className="bg-[#E6F1FF] public-section">
        <div className="site-container">
          <div className="mx-auto max-w-4xl space-y-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#1B66B3]">Academy</p>
            <h1 className="type-display text-slate-900">All Academy Programs in one dedicated page.</h1>
            <p className="type-body mx-auto max-w-3xl text-slate-600">
              Explore every academy pathway first, then open the specific program page that matches your requirement.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#E6F1FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="All academy programs"
            title="Corporate Training, Upskilling, and Certification."
            description="Each program below opens its own dedicated page with focused content."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {academyPrograms.map((item) => (
              <Link
                key={item.id}
                href={`/academy/${item.id}`}
                className="group flex h-full flex-col rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#A9CEF5] hover:bg-[#EDF5FF] hover:shadow-[0_28px_62px_-42px_rgba(27,102,179,0.24)] sm:p-7"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDF5FF] text-[#1B66B3]">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="type-h3 block text-slate-950">{item.title}</span>
                    <span className="type-body mt-2 block text-slate-600">{item.shortDescription}</span>
                  </span>
                </div>
                <span className="type-body-sm mt-auto pt-5 inline-flex items-center font-semibold text-[#1B66B3]">
                  View Program
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section" style={{ backgroundColor: colors.surfaceAlt }}>
        <div className="site-container">
          <div className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-6 shadow-sm sm:p-8">
            <HomeSectionHeading
              eyebrow="How to use this page"
              title="Start from all programs, then open the specific one."
              description="This keeps academy navigation predictable: first all options in one place, then dedicated detail pages for each program."
              align="center"
            />
          </div>
        </div>
      </section>

      <PublicBottomCta
        title="Need help choosing the right academy program?"
        description="Start with all academy programs, then move into the specific program page for deeper details."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "Find a Job", href: "/find-job" }}
      />
    </>
  );
}
