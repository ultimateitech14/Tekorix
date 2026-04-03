import Link from "next/link";

import { BrandLogo } from "@/components/global/BrandLogo";
import { navigationCtas, navigationItems } from "@/lib/constants/navigation";
import { publicContactContent, publicFooterContent } from "@/lib/constants/public-content";
import { themeTokens } from "@/lib/theme/tokens";

export function Footer() {
  const { colors } = themeTokens;

  return (
    <footer
      className="border-t bg-[linear-gradient(180deg,#ffffff_0%,#f6faff_100%)] text-slate-900"
      style={{ borderColor: colors.border }}
    >
      <div className="site-container grid gap-10 py-14 lg:grid-cols-[1.1fr_0.8fr_0.7fr]">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-95">
            <BrandLogo className="h-14 sm:h-16" />
          </Link>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {publicFooterContent.description}
          </p>
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: colors.primary }}>
            {publicFooterContent.tagline}
          </p>
          <div className="grid gap-1 text-sm text-slate-600">
            <a href={`mailto:${publicContactContent.email}`} className="transition-colors hover:text-slate-950">
              {publicContactContent.email}
            </a>
            <a
              href={`tel:${publicContactContent.phone.replace(/\s+/g, "")}`}
              className="transition-colors hover:text-slate-950"
            >
              {publicContactContent.phone}
            </a>
            <p>{publicContactContent.primaryOffice}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: colors.primary }}>
            Explore
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-600 transition-colors hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: colors.primary }}>
            Start here
          </p>
          <div className="grid gap-2">
            <Link
              href={navigationCtas.hireTalent.href}
              className="rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
              style={{ borderColor: colors.border }}
            >
              {navigationCtas.hireTalent.label}
            </Link>
            <Link
              href={navigationCtas.findJob.href}
              className="rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
              style={{ borderColor: colors.border }}
            >
              {navigationCtas.findJob.label}
            </Link>
            <Link href="/contact" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
              Talk to {publicContactContent.companyName}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: colors.border }}>
        <div className="site-container flex flex-col gap-2 pb-[calc(9rem+env(safe-area-inset-bottom))] pt-4 text-xs text-slate-500 sm:pb-[calc(10rem+env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between lg:pb-28 xl:pb-10">
          <p>{publicFooterContent.legalLeft}</p>
          <p>{publicFooterContent.legalRight}</p>
        </div>
      </div>
    </footer>
  );
}
