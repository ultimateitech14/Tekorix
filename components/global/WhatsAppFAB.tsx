"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircleMore } from "lucide-react";

import { getPublicWhatsAppHref, publicContactContent } from "@/lib/constants/public-content";

export function WhatsAppFAB() {
  const pathname = usePathname();
  const whatsAppHref = getPublicWhatsAppHref();
  const hasWhatsAppHref = Boolean(whatsAppHref);

  const cta =
    pathname === "/find-job"
      ? {
          href: "/find-job#submit-resume",
          label: "Quick Resume",
          ariaLabel: "Open the quick resume section",
        }
      : pathname === "/find-talent"
        ? {
            href: "/find-talent#company-lead-form",
            label: "Quick Hiring",
            ariaLabel: "Open the quick hiring section",
          }
        : pathname === "/contact"
          ? {
              href: "/contact#company-inquiry",
              label: "Quick Contact",
              ariaLabel: "Open the quick contact section",
            }
          : {
              href: "/contact",
              label: "Quick Contact",
              ariaLabel: "Open the Tekorix contact page",
            };

  const href = hasWhatsAppHref ? whatsAppHref : cta.href;
  const label = hasWhatsAppHref ? "WhatsApp" : cta.label;
  const ariaLabel = hasWhatsAppHref
    ? `Open WhatsApp chat for ${publicContactContent.companyName}`
    : cta.ariaLabel;

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+2rem)] right-6 z-30 hidden items-center gap-2 rounded-full border border-[#BED9F3] bg-[#378FDD] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 xl:inline-flex"
      target={hasWhatsAppHref ? "_blank" : undefined}
      rel={hasWhatsAppHref ? "noreferrer" : undefined}
    >
      <MessageCircleMore className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
