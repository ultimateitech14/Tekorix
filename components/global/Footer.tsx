import Link from "next/link";

import { BrandLogo } from "@/components/global/BrandLogo";
import { navigationCtas, navigationItems } from "@/lib/constants/navigation";
import { publicContactContent, publicFooterContent } from "@/lib/constants/public-content";

export function Footer() {
  return (
    <footer className="border-t border-[#7FB5EA] bg-[#CFE3FF] text-slate-900">
      <div className="site-container grid gap-8 py-14 lg:grid-cols-[1.1fr_0.8fr_0.7fr]">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-95">
            <BrandLogo className="h-14 sm:h-16" />
          </Link>
          <p className="max-w-2xl text-base text-slate-600 leading-relaxed">
            {publicFooterContent.description}
          </p>
          <p className="text-xs uppercase tracking-[0.22em] text-[#1B66B3]">
            {publicFooterContent.tagline}
          </p>
          <div className="grid gap-1 text-sm text-slate-600">
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
              className="rounded-2xl border border-[#7FB5EA] bg-[#DCEEFF] px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-[#CFE3FF]"
            >
              {navigationCtas.hireTalent.label}
            </Link>
            <Link
              href={navigationCtas.findJob.href}
              className="rounded-2xl border border-[#7FB5EA] bg-[#DCEEFF] px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-[#CFE3FF]"
            >
              {navigationCtas.findJob.label}
            </Link>
            <Link href="/contact" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
              Talk to {publicContactContent.companyName}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[#7FB5EA]">
        <div className="site-container flex flex-col gap-2 pb-6 pt-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:pb-8 xl:pb-10">
          <p>{publicFooterContent.legalLeft}</p>
          <p>{publicFooterContent.legalRight}</p>
        </div>
      </div>
    </footer>
  );
}

