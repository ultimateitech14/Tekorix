import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { navigationItems } from "@/lib/constants/navigation";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Tekorix Services",
  description:
    "Explore Tekorix services across product engineering, staffing, team building, GCC setup, and consulting support.",
  path: "/services",
  keywords: [
    "product engineering",
    "on-roll staffing",
    "contract staffing",
    "team building",
    "gcc setup",
    "consulting services",
  ],
});

export default function ServicesPage() {
  const servicesNavigation = navigationItems.find((item) => item.href === "/services");
  const serviceOverviewItems = servicesNavigation?.children ?? [];

  return (
    <>
      <section className="relative overflow-hidden bg-[#E6F1FF] public-section">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(220,238,255,0.98)_0%,rgba(207,227,255,0.98)_100%)]" />
        <div className="absolute -left-12 top-10 h-64 w-64 rounded-full bg-[rgba(45,143,229,0.12)] blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[rgba(83,174,250,0.16)] blur-3xl" />

        <div className="site-container relative">
          <div className="mx-auto max-w-4xl space-y-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#1B66B3]">Services</p>
            <h1 className="type-display text-slate-900">Structured services for talent, teams, and delivery support.</h1>
            <p className="type-body mx-auto max-w-3xl text-slate-600">
              Explore the four core Tekorix service paths clients use most often, with direct navigation into each
              destination.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#E6F1FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="All services"
            title="See every Tekorix service path from one page."
            description="All Services keeps the structure focused on HR, Business, Academy, and Industries so visitors can move quickly to the right destination."
          />

          <div className="grid gap-4 md:grid-cols-2">
            {serviceOverviewItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[1.5rem] bg-[linear-gradient(145deg,#F9FCFF_0%,#EDF6FF_100%)] p-5 shadow-[0_26px_58px_-44px_rgba(15,23,42,0.32)] transition-all hover:-translate-y-0.5 hover:shadow-[0_30px_66px_-44px_rgba(15,23,42,0.38)] sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDF5FF] text-[#1B66B3]">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="type-h3 block text-slate-950">{item.label}</span>
                    <span className="type-body mt-1 block text-slate-600">{item.description}</span>
                  </span>
                </div>
                <span className="type-body-sm mt-5 inline-flex items-center font-semibold text-[#1B66B3]">
                  View path
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PublicBottomCta
        title="Need the right service path for hiring, team setup, or delivery support?"
        description="Start with the Tekorix services catalog, then move directly into the service detail page that matches your requirement."
        primaryCta={{ label: "Find Talent", href: "/find-talent" }}
        secondaryCta={{ label: "Talk to Us", href: "/contact" }}
      />
    </>
  );
}
