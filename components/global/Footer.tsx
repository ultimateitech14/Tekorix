import Link from "next/link";
import { ArrowRight, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";

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
  const exploreLinks = [
    ...navigationItems.map((item) => ({ label: item.label, href: item.href })),
    { label: "Careers", href: "/careers" },
  ];
  const contactRows = [
    {
      label: "Email",
      value: publicContactContent.email,
      href: `mailto:${publicContactContent.email}`,
      icon: Mail,
    },
    {
      label: "Phone",
      value: publicContactContent.phone,
      href: `tel:${publicContactContent.phone.replace(/\s+/g, "")}`,
      icon: Phone,
    },
    {
      label: "Office",
      value: publicContactContent.primaryOffice,
      href: null,
      icon: MapPin,
    },
  ];

  return (
    <footer data-site-footer className="border-t border-[#BED9F3] bg-[#E6F1FF] text-slate-900">
      <div className="site-container grid gap-8 py-8 lg:grid-cols-[1.16fr_0.78fr_0.82fr] lg:gap-10 lg:py-9">
        <div className="space-y-5">
          <Link
            href="/"
            className="inline-flex items-center transition-opacity hover:opacity-95"
          >
            <BrandLogo className="h-11 sm:h-12" />
          </Link>

          <div className="space-y-3">
            <p className="max-w-2xl text-base leading-relaxed text-slate-600">
              {publicFooterContent.description}
            </p>
            <p className="text-sm font-medium text-[#1B66B3]">
              {publicFooterContent.tagline}
            </p>
          </div>

          <div className="grid gap-3 sm:max-w-xl">
            {contactRows.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-start gap-3 text-sm text-slate-600 transition-colors hover:text-slate-900"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDF5FF] text-[#1B66B3]">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="space-y-0.5">
                    <span className="block text-xs font-semibold tracking-[0.14em] text-slate-400">
                      {item.label}
                    </span>
                    <span className="block">{item.value}</span>
                  </span>
                </a>
              ) : (
                <div key={item.label} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDF5FF] text-[#1B66B3]">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="space-y-0.5">
                    <span className="block text-xs font-semibold tracking-[0.14em] text-slate-400">
                      {item.label}
                    </span>
                    <span className="block">{item.value}</span>
                  </span>
                </div>
              ),
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {socialMediaLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#9FC3E8] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-[#DCEEFF] hover:text-slate-950"
              >
                <item.icon className="h-3.5 w-3.5 text-[#145188]" />
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4 lg:pt-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1B66B3]">
            Explore
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {exploreLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-1 text-sm text-slate-600 transition-colors hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4 lg:pt-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1B66B3]">
            Start here
          </p>
          <div className="space-y-3">
            <Link
              href={navigationCtas.hireTalent.href}
              className="flex items-center justify-between rounded-2xl border border-[#BED9F3] bg-white/75 px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-[#EAF4FF]"
            >
              <span>{navigationCtas.hireTalent.label}</span>
              <ArrowRight className="h-4 w-4 text-[#1B66B3]" />
            </Link>
            <Link
              href={navigationCtas.findJob.href}
              className="flex items-center justify-between rounded-2xl border border-[#BED9F3] bg-white/75 px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-[#EAF4FF]"
            >
              <span>{navigationCtas.findJob.label}</span>
              <ArrowRight className="h-4 w-4 text-[#1B66B3]" />
            </Link>
            <div className="pt-1">
              <p className="text-sm leading-6 text-slate-600">
                Need to start a conversation with {publicContactContent.companyName}?
              </p>
              <Link href="/contact" className="mt-2 inline-flex text-sm font-semibold text-[#1B66B3] transition-colors hover:text-[#145188]">
                Talk to Tekorix
              </Link>
            </div>
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

