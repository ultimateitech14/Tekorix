"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ExitIntentConfig = {
  storageKey: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

const exitIntentRoutes: Record<string, ExitIntentConfig> = {
  "/find-job": {
    storageKey: "tekorix:exit-intent:find-job",
    title: "Leave your resume before you go.",
    description:
      "Even if the perfect role is not visible right now, Tekorix can still review your profile for current and upcoming openings.",
    primaryHref: "/find-job#submit-resume",
    primaryLabel: "Submit Your Resume",
    secondaryHref: "/contact",
    secondaryLabel: "Talk to Us",
  },
  "/find-talent": {
    storageKey: "tekorix:exit-intent:find-talent",
    title: "Need a team before you go?",
    description:
      "Share the requirement once and Tekorix can route you into the right hiring, staffing, or team-building conversation.",
    primaryHref: "/find-talent#company-lead-form",
    primaryLabel: "Get My Team",
    secondaryHref: "/contact",
    secondaryLabel: "Talk to Us",
  },
};

export function PublicExitIntentDialog() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const config = useMemo(() => {
    if (!pathname) {
      return null;
    }

    return exitIntentRoutes[pathname] ?? null;
  }, [pathname]);

  useEffect(() => {
    if (!config || typeof window === "undefined") {
      return;
    }

    const activeConfig = config;

    if (!window.matchMedia("(pointer:fine)").matches || window.innerWidth < 1024) {
      return;
    }

    if (window.sessionStorage.getItem(activeConfig.storageKey) === "shown") {
      return;
    }

    let canTrigger = false;
    const enableTimer = window.setTimeout(() => {
      canTrigger = true;
    }, 5000);

    function markAsSeen() {
      window.sessionStorage.setItem(activeConfig.storageKey, "shown");
    }

    function handleMouseOut(event: MouseEvent) {
      if (!canTrigger || open) {
        return;
      }

      if (event.relatedTarget === null && event.clientY <= 24) {
        markAsSeen();
        setOpen(true);
      }
    }

    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.clearTimeout(enableTimer);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [config, open]);

  if (!config) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && typeof window !== "undefined") {
          window.sessionStorage.setItem(config.storageKey, "shown");
        }

        setOpen(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto rounded-[1.75rem] border border-slate-200 bg-white p-0 shadow-[0_34px_90px_-48px_rgba(15,23,42,0.45)]">
        <div className="h-1.5 bg-[#1B66B3]" />
        <div className="space-y-5 px-6 pb-6 pt-6 sm:px-7 sm:pb-7">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="font-display text-3xl font-semibold tracking-tight text-slate-950">
              {config.title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-7 text-slate-600">
              {config.description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="shadow-sm">
              <Link href={config.primaryHref}>{config.primaryLabel}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#BED9F3] bg-[#F8FBFF] text-slate-950 hover:bg-[#E6F1FF]"
            >
              <Link href={config.secondaryHref}>{config.secondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
