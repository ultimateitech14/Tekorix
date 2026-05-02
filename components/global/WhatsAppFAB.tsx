"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MessageCircleMore, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";

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
    "fixed bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] right-2.5 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#BED9F3] bg-[#378FDD] p-0 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 sm:bottom-[calc(env(safe-area-inset-bottom)+1rem)] sm:right-3.5 sm:h-12 sm:w-12 xl:bottom-[calc(env(safe-area-inset-bottom)+2rem)] xl:right-6 xl:h-auto xl:w-auto xl:justify-start xl:gap-2 xl:px-4 xl:py-3";

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

  useEffect(() => {
    const open = showQuickContactMenu && isContactMenuOpen;

    window.dispatchEvent(
      new CustomEvent("tekorix:quick-contact-toggle", {
        detail: { open },
      }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("tekorix:quick-contact-toggle", {
          detail: { open: false },
        }),
      );
    };
  }, [isContactMenuOpen, showQuickContactMenu]);

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
            <span className="hidden xl:inline">{cta.label}</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="top"
          sideOffset={8}
          collisionPadding={12}
          className="w-auto border-0 bg-transparent p-0 shadow-none sm:w-[min(15.75rem,calc(100vw-1.25rem))] sm:rounded-[1.15rem] sm:border sm:border-[#C7DDFC] sm:bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,250,255,0.98)_100%)] sm:p-2 sm:text-slate-900 sm:shadow-[0_24px_60px_-36px_rgba(15,23,42,0.3)] sm:backdrop-blur-xl"
        >
          <div className="hidden px-1 pb-1 sm:block">
            <p className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[#1B66B3]">Quick contact</p>
          </div>

          <div className="flex flex-col items-end gap-2 sm:hidden">
            {quickContactOptions.map((option) => (
              <a
                key={option.label}
                href={option.href}
                target={option.target}
                rel={option.rel}
                aria-label={option.label}
                onClick={() => setIsContactMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D8E8FB] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(237,245,255,0.98)_100%)] text-[#1B66B3] shadow-[0_10px_24px_-20px_rgba(27,102,179,0.82)] transition-transform hover:-translate-y-0.5 hover:bg-[#F3F8FF]"
              >
                <option.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-[0.95rem] border border-[#D8E8FB] bg-white/75 sm:block">
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
      <span className="hidden xl:inline">{cta.label}</span>
    </Link>
  );
}
