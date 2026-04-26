"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MessageCircleMore, PhoneCall } from "lucide-react";
import { useState } from "react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getPublicWhatsAppHref, publicContactContent } from "@/lib/constants/public-content";

export function WhatsAppFAB() {
  const pathname = usePathname();
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const configuredWhatsAppHref = getPublicWhatsAppHref();
  const telHref = `tel:${publicContactContent.phone.replace(/\s+/g, "")}`;
  const whatsAppDisplay = publicContactContent.whatsAppDisplay || publicContactContent.phone;
  const whatsAppNumber = whatsAppDisplay.replace(/\D/g, "");
  const resolvedWhatsAppHref = configuredWhatsAppHref || (whatsAppNumber ? `https://wa.me/${whatsAppNumber}` : "");

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

  const showQuickContactMenu = cta.label === "Quick Contact";
  const floatingButtonClassName =
    "fixed bottom-[calc(env(safe-area-inset-bottom)+2rem)] right-6 z-30 hidden items-center gap-2 rounded-full border border-[#BED9F3] bg-[#378FDD] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 xl:inline-flex";

  const quickContactOptions = [
    {
      label: "Phone",
      value: publicContactContent.phone,
      href: telHref,
      icon: PhoneCall,
    },
    {
      label: "WhatsApp",
      value: whatsAppDisplay,
      href: resolvedWhatsAppHref,
      icon: MessageCircleMore,
      target: "_blank",
      rel: "noreferrer",
    },
    {
      label: "Email",
      value: publicContactContent.email,
      href: `mailto:${publicContactContent.email}`,
      icon: Mail,
    },
  ].filter((option) => Boolean(option.href && option.value));

  if (showQuickContactMenu) {
    return (
      <DropdownMenu modal={false} open={isContactMenuOpen} onOpenChange={setIsContactMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Open quick contact options"
            className={floatingButtonClassName}
          >
            <MessageCircleMore className="h-4 w-4" />
            <span className="hidden sm:inline">{cta.label}</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="top"
          sideOffset={10}
          collisionPadding={16}
          className="w-[min(15.75rem,calc(100vw-1.25rem))] rounded-[1.15rem] border border-[#C7DDFC] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,250,255,0.98)_100%)] p-2 text-slate-900 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.3)] backdrop-blur-xl"
        >
          <div className="px-1 pb-1">
            <p className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[#1B66B3]">Quick contact</p>
          </div>

          <div className="overflow-hidden rounded-[0.95rem] border border-[#D8E8FB] bg-white/75">
            {quickContactOptions.map((option, index) => (
              <div key={option.label}>
                <a
                  href={option.href}
                  target={option.target}
                  rel={option.rel}
                  onClick={() => setIsContactMenuOpen(false)}
                  className="group flex items-center gap-2.5 px-2.5 py-2.5 transition-colors hover:bg-[#F3F8FF]"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#FFFFFF_0%,#F2F8FF_100%)] text-[#1B66B3] shadow-[0_8px_20px_-16px_rgba(27,102,179,0.85)] ring-1 ring-[#DBEAFB]">
                    <option.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.9rem] font-semibold tracking-[-0.01em] text-slate-900">
                      {option.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.76rem] text-slate-600">{option.value}</span>
                  </span>
                </a>
                {index < quickContactOptions.length - 1 ? <div className="mx-2.5 h-px bg-[#E0ECFB]" /> : null}
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link
      href={cta.href}
      aria-label={cta.ariaLabel}
      className={floatingButtonClassName}
    >
      <MessageCircleMore className="h-4 w-4" />
      <span className="hidden sm:inline">{cta.label}</span>
    </Link>
  );
}
