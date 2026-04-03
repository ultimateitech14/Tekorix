"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

export function StickyLeadForm() {
  const pathname = usePathname();
  const { colors } = themeTokens;

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
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-30 px-3 sm:bottom-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-4">
      <div
        className="mx-auto max-w-4xl rounded-[1.5rem] border bg-white/95 p-2.5 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-3"
        style={{
          borderColor: colors.border,
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="pointer-events-auto px-2 py-1">
            <p className="text-sm font-semibold text-slate-950">Need a team or exploring your next role?</p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Pick the right Tekorix path and we&apos;ll keep the conversation focused from the first click.
            </p>
          </div>
          <div className="pointer-events-auto grid gap-2 sm:grid-cols-2">
            <Button
              asChild
              className="border-0 text-white shadow-[0_18px_36px_-20px_rgba(37,99,235,0.6)] hover:opacity-95"
              style={{ backgroundColor: colors.primary }}
            >
              <Link href={primaryHref}>I Need a Team</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-300 bg-white text-slate-950 hover:bg-slate-50 hover:text-slate-950"
            >
              <Link href={secondaryHref}>I&apos;m Looking for a Job</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
