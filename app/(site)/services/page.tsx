import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, GraduationCap } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/lib/constants/navigation";
import { buildMetadata } from "@/lib/seo";
import { serviceCatalog, serviceDeliveryFlow, serviceValuePoints } from "@/lib/constants/service-catalog";
import { themeTokens } from "@/lib/theme/tokens";

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
  const { colors } = themeTokens;
  const servicesNavigation = navigationItems.find((item) => item.href === "/services");
  const serviceOverviewItems = servicesNavigation?.children ?? [];
  const serviceCatalogCards: {
    id: string;
    title: string;
    shortDescription: string;
    features: string[];
    core?: boolean;
    icon: LucideIcon;
    href: string;
  }[] = [
    ...serviceCatalog.map((item) => ({
      id: item.id,
      title: item.title,
      shortDescription: item.shortDescription,
      features: item.features,
      core: item.core,
      icon: item.icon,
      href: `/services/${item.id}`,
    })),
    {
      id: "academy",
      title: "Academy",
      shortDescription:
        "Role-based learning support for teams and candidates through upskilling tracks, workshops, and certification readiness.",
      features: [
        "Corporate training workshops for delivery teams",
        "Upskill and reskill tracks for role transitions",
        "Certification guidance aligned to career outcomes",
      ],
      icon: GraduationCap,
      href: "/academy",
    },
  ];

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
              Explore the Tekorix services catalog the same way clients evaluate it: clear service definitions,
              visible core focus areas, and dedicated detail pages for each support model.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#E6F1FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="All services"
            title="See every Tekorix service path from one page."
            description="All Services opens this page so visitors can quickly view HR Consulting, Business support, Industries coverage, and Academy pathways before going deeper."
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

          <HomeSectionHeading
            eyebrow="Service catalog"
            title="Browse each service as its own client-ready path."
            description="The layout here is intentionally structured like a service catalog: icon-led cards, fast summaries, and direct links into a deeper service detail page."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceCatalogCards.map((item) => (
              <article
                key={item.id}
                id={item.id}
                className="scroll-mt-28 flex h-full flex-col rounded-[1.75rem] bg-[linear-gradient(160deg,#F9FCFF_0%,#ECF5FF_100%)] p-6 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.34)] sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{ backgroundColor: item.core ? colors.primary : colors.surfaceMuted, color: item.core ? colors.white : colors.primary }}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  {item.core ? (
                    <span className="rounded-full bg-[#EDF5FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1B66B3]">
                      Core focus
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 space-y-3">
                  <h2 className="type-h3 text-slate-950">{item.title}</h2>
                  <p className="type-body text-slate-600">{item.shortDescription}</p>
                </div>

                <div className="mt-6 flex-1 space-y-3">
                  {item.features.slice(0, 3).map((feature) => (
                    <div key={feature} className="type-body-sm flex items-start gap-3 text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1B66B3]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button asChild className="h-11 w-full shadow-sm">
                    <Link href={item.href}>
                      Explore Service
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section" style={{ backgroundColor: colors.surfaceAlt }}>
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="How services connect"
            title="Each service exists independently, but the buying journey still follows a clear flow."
            description="This section keeps the services page commercially structured: first identify the real gap, then match the support model, then keep delivery stable."
            align="center"
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {serviceDeliveryFlow.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] bg-[linear-gradient(165deg,#F9FCFF_0%,#EEF7FF_100%)] p-6 shadow-[0_24px_58px_-44px_rgba(15,23,42,0.3)]"
              >
                <p
                  className="type-body-sm font-semibold uppercase tracking-[0.18em]"
                  style={{ color: index === 1 ? colors.accent : colors.primary }}
                >
                  Step 0{index + 1}
                </p>
                <h2 className="type-h3 mt-4 text-slate-950">{item.title}</h2>
                <p className="type-body mt-3 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] bg-[linear-gradient(170deg,#F9FCFF_0%,#EAF4FF_100%)] p-6 shadow-[0_30px_74px_-52px_rgba(15,23,42,0.28)] sm:p-8">
            <HomeSectionHeading
              eyebrow="Why Tekorix"
              title="The overall services story stays broad, but the core commercial direction remains obvious."
              description="That balance matters. Clients should see staffing and team building clearly, while still understanding the wider consulting and delivery support capability."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {serviceValuePoints.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] bg-white/85 px-5 py-6 shadow-[0_22px_52px_-42px_rgba(15,23,42,0.24)]"
                  style={{
                    backgroundColor: index === 0 ? colors.surfaceAlt : colors.surfaceCard,
                  }}
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white"
                    style={{
                      backgroundColor: index === 0 ? colors.primary : colors.surfaceMuted,
                      color: index === 0 ? colors.white : colors.primary,
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="type-h3 mt-4 text-slate-950">{item.title}</h3>
                  <p className="type-body mt-3 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
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
