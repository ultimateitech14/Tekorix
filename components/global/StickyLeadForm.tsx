"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function StickyLeadForm() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  const primaryHref =
    pathname === "/find-talent"
      ? "/find-talent#company-lead-form"
      : pathname === "/contact"
        ? "/contact#company-inquiry"
        : "/find-talent";

  const secondaryHref =
    pathname === "/find-job"
      ? "/find-job#submit-resume"
      : pathname === "/contact"
        ? "/contact#candidate-inquiry"
        : "/find-job";

  useEffect(() => {
    const getScrollThreshold = () => {
      const firstSection = document.querySelector("main > section");

      if (!(firstSection instanceof HTMLElement)) {
        return Math.max(260, Math.min(window.innerHeight * 0.5, 560));
      }

      return Math.max(260, firstSection.offsetHeight - Math.min(220, window.innerHeight * 0.18));
    };

    const updateVisibility = () => {
      setIsVisible(window.scrollY > getScrollThreshold());
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const footer = document.querySelector("[data-site-footer]");

    if (!(footer instanceof HTMLElement)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearFooter(entry.isIntersecting);
      },
      {
        threshold: 0.18,
      },
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-30 hidden px-4 transition-all duration-300 xl:block ${
        isVisible
          ? isNearFooter
            ? "xl:translate-y-0 xl:opacity-70"
            : "xl:translate-y-0 xl:opacity-100"
          : "xl:pointer-events-none xl:translate-y-4 xl:opacity-0"
      }`}
    >
      <div className="mx-auto max-w-4xl rounded-[1.5rem] border border-[#BED9F3] bg-[#F8FBFF]/95 p-2 shadow-sm backdrop-blur-xl sm:rounded-[1.75rem] sm:p-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="pointer-events-auto px-1.5 py-0.5">
            <p className="text-sm font-semibold text-slate-900">Need a team or exploring your next role?</p>
            <p className="hidden max-w-[36rem] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-600 sm:block">
              Focus on innovation. We&apos;ll build the team that powers it.
            </p>
          </div>
          <div className="pointer-events-auto grid gap-2 sm:grid-cols-2">
            <Button asChild className="h-10 shadow-sm">
              <Link href={primaryHref}>I Need a Team</Link>
            </Button>
            <Button asChild variant="outline" className="h-10">
              <Link href={secondaryHref}>I&apos;m Looking for a Job</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
