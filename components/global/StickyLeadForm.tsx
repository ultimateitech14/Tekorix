"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export function StickyLeadForm() {
  const pathname = usePathname();

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

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-30 hidden px-4 xl:block">
      <div className="mx-auto max-w-4xl rounded-[1.5rem] border border-[#7FB5EA] bg-[#DCEEFF]/95 p-2.5 shadow-sm backdrop-blur-xl sm:rounded-[1.75rem] sm:p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="pointer-events-auto px-2 py-1">
            <p className="text-sm font-semibold text-slate-900">Need a team or exploring your next role?</p>
            <p className="hidden text-xs text-slate-600 sm:block">
              Pick the right Tekorix path and we&apos;ll keep the conversation focused from the first click.
            </p>
          </div>
          <div className="pointer-events-auto grid gap-2 sm:grid-cols-2">
            <Button asChild className="shadow-sm">
              <Link href={primaryHref}>I Need a Team</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={secondaryHref}>I&apos;m Looking for a Job</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
