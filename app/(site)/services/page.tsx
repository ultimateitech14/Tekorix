import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
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

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#7FB5EA] bg-[#CFE3FF] public-section">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(220,238,255,0.98)_0%,rgba(207,227,255,0.98)_100%)]" />
        <div className="absolute -left-12 top-10 h-64 w-64 rounded-full bg-[rgba(45,143,229,0.12)] blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[rgba(83,174,250,0.16)] blur-3xl" />

        <div className="site-container relative">
          <div className="mx-auto max-w-4xl space-y-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#1B66B3]">Services</p>
            <h1 className="text-5xl font-bold leading-tight text-slate-900 md:text-6xl">Structured services for talent, teams, and delivery support.</h1>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600">
              Explore the Tekorix services catalog the same way clients evaluate it: clear service definitions,
              visible core focus areas, and dedicated detail pages for each support model.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#CFE3FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Service catalog"
            title="Browse each service as its own client-ready path."
            description="The layout here is intentionally structured like a service catalog: icon-led cards, fast summaries, and direct links into a deeper service detail page."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceCatalog.map((item) => (
              <article
                key={item.id}
                id={item.id}
                className="scroll-mt-28 rounded-[1.75rem] border bg-[#DCEEFF] p-6 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.22)] sm:p-7"
                style={{ borderColor: item.core ? colors.primary : colors.border }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{ backgroundColor: item.core ? colors.primary : colors.surfaceMuted, color: item.core ? colors.white : colors.primary }}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  {item.core ? (
                    <span className="rounded-full bg-[#C6E0FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1B66B3]">
                      Core focus
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 space-y-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{item.title}</h2>
                  <p className="text-base leading-7 text-slate-600">{item.shortDescription}</p>
                </div>

                <div className="mt-6 space-y-3">
                  {item.features.slice(0, 3).map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1B66B3]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button asChild className="w-full shadow-sm">
                    <Link href={`/services/${item.id}`}>
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
                className="rounded-[1.5rem] border bg-[#DCEEFF] p-6 shadow-[0_22px_55px_-44px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-[0.18em]"
                  style={{ color: index === 1 ? colors.accent : colors.primary }}
                >
                  Step 0{index + 1}
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-[2rem] border bg-[#DCEEFF] p-6 shadow-[0_28px_70px_-50px_rgba(15,23,42,0.2)] sm:p-8"
            style={{ borderColor: colors.border }}
          >
            <HomeSectionHeading
              eyebrow="Why Tekorix"
              title="The overall services story stays broad, but the core commercial direction remains obvious."
              description="That balance matters. Clients should see staffing and team building clearly, while still understanding the wider consulting and delivery support capability."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {serviceValuePoints.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border bg-[#DCEEFF] px-5 py-6"
                  style={{
                    borderColor: colors.border,
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
                  <h3 className="mt-4 text-2xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
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
