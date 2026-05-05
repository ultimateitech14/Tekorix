"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from "lucide-react";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { resolveAssetUrl } from "@/lib/asset-url";
import type { TalentProfile } from "@/lib/talent-profiles";
import { defaultTalentProfilesSectionContent } from "@/lib/talent-profiles-section";
import { cn } from "@/lib/utils";

const DEFAULT_PROFILE_IMAGE = "/images/profiles/profile-3.svg";

type HomeProfilesProps = {
  profiles: TalentProfile[];
  eyebrow?: string;
  title?: string;
  description?: string;
};

function buildSummary(profile: TalentProfile) {
  const parts: string[] = [];

  if (profile.yearsOfExperience > 0) {
    parts.push(`${profile.yearsOfExperience}+ years`);
  }

  if (profile.summary) {
    parts.push(profile.summary);
  } else if (profile.expertise.length) {
    parts.push(profile.expertise.join(", "));
  }

  return parts.join(" | ");
}

export function HomeProfiles({ profiles, eyebrow, title, description }: HomeProfilesProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const visibleProfiles = profiles.filter((profile) => profile.name.trim() && profile.role.trim());
  const resolvedEyebrow = eyebrow?.trim() || defaultTalentProfilesSectionContent.eyebrow;
  const resolvedTitle = title?.trim() || defaultTalentProfilesSectionContent.title;
  const resolvedDescription = description?.trim() || defaultTalentProfilesSectionContent.description;

  useEffect(() => {
    const node = trackRef.current;

    if (!node) {
      return;
    }

    const updateScrollState = () => {
      setCanScrollLeft(node.scrollLeft > 8);
      setCanScrollRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 8);
    };

    updateScrollState();
    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [visibleProfiles.length]);

  function scrollCards(direction: -1 | 1) {
    const node = trackRef.current;

    if (!node) {
      return;
    }

    const amount = Math.round(node.clientWidth * 0.82) * direction;
    node.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (!visibleProfiles.length) {
    return null;
  }

  return (
    <section className="bg-[#E6F1FF] public-section">
      <div className="site-container public-stack">
        <HomeSectionHeading
          eyebrow={resolvedEyebrow}
          title={resolvedTitle}
          description={resolvedDescription}
        />

        <div className="relative">
          <button
            type="button"
            aria-label="Scroll profiles left"
            onClick={() => scrollCards(-1)}
            disabled={!canScrollLeft}
            className={cn(
              "absolute left-1 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#BED9F3] bg-[#F8FBFF]/95 text-[#1B66B3] shadow-sm backdrop-blur transition",
              canScrollLeft ? "opacity-100 hover:bg-[#EDF5FF]" : "pointer-events-none opacity-35",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={trackRef}
            className="flex touch-auto snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 pl-0.5 pr-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visibleProfiles.map((profile) => (
              <article
                key={profile.id}
                className="group flex min-h-[25rem] w-[min(88vw,22rem)] shrink-0 snap-start flex-col rounded-[1.4rem] border border-[#D7E8FA] bg-[#F8FBFF] p-6 shadow-[0_22px_50px_-42px_rgba(15,23,42,0.24)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A9CEF5] hover:shadow-[0_28px_62px_-40px_rgba(27,102,179,0.28)] md:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={resolveAssetUrl(profile.avatar || DEFAULT_PROFILE_IMAGE)}
                      alt={profile.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full border border-[#BED9F3] object-cover"
                      unoptimized
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{profile.name}</h3>
                      <p className="text-base font-medium text-[#1B66B3]">{profile.role}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EDF5FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B66B3]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {profile.rating}/5
                  </span>
                </div>

                <div className="mt-6 flex flex-1 flex-col">
                  <div className="space-y-2">
                    <p className="text-base leading-relaxed text-slate-600">{buildSummary(profile)}</p>
                    <p className="text-sm leading-relaxed text-slate-600">{profile.detailedSummary}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {profile.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[#BED9F3] bg-[#EDF5FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition-colors group-hover:bg-[#EAF4FF]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B66B3] transition-colors hover:text-[#145188]"
                    >
                      {profile.resumeCtaLabel || "View Resume"}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            aria-label="Scroll profiles right"
            onClick={() => scrollCards(1)}
            disabled={!canScrollRight}
            className={cn(
              "absolute right-1 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#BED9F3] bg-[#F8FBFF]/95 text-[#1B66B3] shadow-sm backdrop-blur transition",
              canScrollRight ? "opacity-100 hover:bg-[#EDF5FF]" : "pointer-events-none opacity-35",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
