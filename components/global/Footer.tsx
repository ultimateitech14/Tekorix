import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

import { BrandLogo } from "@/components/global/BrandLogo";
import { navigationCtas, navigationItems } from "@/lib/constants/navigation";
import { publicContactContent, publicFooterContent, publicSocialLinks } from "@/lib/constants/public-content";

const socialMediaLinks = [
  { label: "LinkedIn", href: publicSocialLinks.linkedinCompany, icon: Linkedin },
  { label: "X", href: publicSocialLinks.x, icon: Twitter },
  { label: "Instagram", href: publicSocialLinks.instagram, icon: Instagram },
  { label: "Facebook", href: publicSocialLinks.facebook, icon: Facebook },
  { label: "YouTube", href: publicSocialLinks.youtube, icon: Youtube },
];

export function Footer() {
  return (
    <footer className="border-t border-[#BED9F3] bg-[#E6F1FF] text-slate-900">
      <div className="site-container grid gap-6 py-8 lg:grid-cols-[1.1fr_0.8fr_0.7fr] lg:py-9">
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center transition-opacity hover:opacity-95"
          >
            <BrandLogo className="h-11 sm:h-12" />
          </Link>
          <p className="max-w-2xl text-base text-slate-600 leading-relaxed">
            {publicFooterContent.description}
          </p>
          <p className="text-xs uppercase tracking-[0.22em] text-[#1B66B3]">
            {publicFooterContent.tagline}
          </p>
          <div className="grid gap-0.5 text-sm text-slate-600">
            <a href={`mailto:${publicContactContent.email}`} className="transition-colors hover:text-slate-900">
              {publicContactContent.email}
            </a>
            <a
              href={`tel:${publicContactContent.phone.replace(/\s+/g, "")}`}
              className="transition-colors hover:text-slate-900"
            >
              {publicContactContent.phone}
            </a>
            <p>{publicContactContent.primaryOffice}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-0.5">
            {socialMediaLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#BED9F3] bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-[#F1F7FF] hover:text-slate-900"
              >
                <item.icon className="h-3.5 w-3.5 text-[#1B66B3]" />
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1B66B3]">
            Explore
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-600 transition-colors hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1B66B3]">
            Start here
          </p>
          <div className="grid gap-2">
            <Link
              href={navigationCtas.hireTalent.href}
              className="rounded-2xl border border-[#BED9F3] bg-[#F1F7FF] px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-[#EAF4FF]"
            >
              {navigationCtas.hireTalent.label}
            </Link>
            <Link
              href={navigationCtas.findJob.href}
              className="rounded-2xl border border-[#BED9F3] bg-[#F1F7FF] px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-[#EAF4FF]"
            >
              {navigationCtas.findJob.label}
            </Link>
            <Link href="/contact" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
              Talk to {publicContactContent.companyName}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[#BED9F3]">
        <div className="site-container flex flex-col gap-2 py-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>{publicFooterContent.legalLeft}</p>
          <p>{publicFooterContent.legalRight}</p>
        </div>
      </div>
    </footer>
  );
}

