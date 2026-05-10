import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getRelatedServices, getServiceById, serviceCatalog } from "@/lib/constants/service-catalog";
import { themeTokens } from "@/lib/theme/tokens";

type ServiceDetailPageProps = {
  params: {
    serviceId: string;
  };
};

export function generateStaticParams() {
  return serviceCatalog.map((item) => ({ serviceId: item.id }));
}

export function generateMetadata({ params }: ServiceDetailPageProps): Metadata {
  const service = getServiceById(params.serviceId);

  if (!service) {
    return buildMetadata({
      title: "Service Not Found",
      description: "The requested service detail page could not be found.",
      path: "/services",
    });
  }

  return buildMetadata({
    title: service.title,
    description: service.shortDescription,
    path: `/services/${service.id}`,
    keywords: [service.title.toLowerCase(), "services", "team building", "staffing", "consulting"],
  });
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = getServiceById(params.serviceId);
  const { colors } = themeTokens;

  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(service.id);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.title, path: `/services/${service.id}` },
  ]);

  return (
    <section className="bg-[#E6F1FF] public-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="site-container">
        <div className="mb-8">
          <Button asChild variant="ghost" className="px-0 text-[#1B66B3] hover:bg-transparent hover:text-[#145188]">
            <Link href="/services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-8">
            <div className="flex flex-col gap-5 rounded-[2rem] bg-[linear-gradient(160deg,#F9FCFF_0%,#ECF5FF_100%)] p-6 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.32)] sm:flex-row sm:items-center sm:p-8">
              <span
                className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] text-white"
                style={{ backgroundColor: service.core ? colors.primary : colors.surfaceMuted, color: service.core ? colors.white : colors.primary }}
              >
                <service.icon className="h-9 w-9" />
              </span>

              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1B66B3]">Service detail</p>
                <h1 className="type-display text-slate-950">{service.title}</h1>
                <p className="type-lead text-slate-600">{service.shortDescription}</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-[linear-gradient(165deg,#F9FCFF_0%,#EFF7FF_100%)] p-6 shadow-[0_24px_56px_-44px_rgba(15,23,42,0.28)] sm:p-8">
              <h2 className="type-h2 text-slate-950">Overview</h2>
              <p className="type-body mt-4 text-slate-600">{service.description}</p>
            </div>

            <div className="rounded-[1.75rem] bg-[linear-gradient(165deg,#F9FCFF_0%,#EFF7FF_100%)] p-6 shadow-[0_24px_56px_-44px_rgba(15,23,42,0.28)] sm:p-8">
              <h2 className="type-h2 text-slate-950">Key features</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {service.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 rounded-xl bg-[#EDF5FF] px-4 py-4 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.34)]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1B66B3]" />
                    <span className="type-body-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-[linear-gradient(165deg,#F9FCFF_0%,#EFF7FF_100%)] p-6 shadow-[0_24px_56px_-44px_rgba(15,23,42,0.28)] sm:p-8">
              <h2 className="type-h2 text-slate-950">Benefits</h2>
              <div className="mt-6 space-y-4">
                {service.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 rounded-xl bg-[#F3F8FF] px-4 py-4 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.3)]">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1B66B3]" />
                    <span className="type-body-sm text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="rounded-[1.75rem] bg-[linear-gradient(165deg,#EAF4FF_0%,#DDEEFF_100%)] p-6 shadow-[0_26px_60px_-46px_rgba(15,23,42,0.32)]">
                <h3 className="type-h2 text-slate-950">Ready to get started?</h3>
                <p className="type-body-sm mt-4 text-slate-700">
                  If this service matches your current hiring or delivery requirement, move directly into a Tekorix conversation.
                </p>

                <div className="mt-6 space-y-3">
                  <Button asChild className="w-full shadow-sm">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-transparent bg-white/90 hover:bg-[#E6F1FF]">
                    <Link href="/services">View All Services</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-[linear-gradient(165deg,#F9FCFF_0%,#EEF7FF_100%)] p-6 shadow-[0_24px_56px_-44px_rgba(15,23,42,0.28)]">
                <h4 className="type-h3 text-slate-950">Related services</h4>
                <div className="mt-4 space-y-3">
                  {relatedServices.map((item) => (
                    <Link
                      key={item.id}
                      href={`/services/${item.id}`}
                      className="block rounded-xl bg-white/90 px-4 py-4 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.28)] transition-colors hover:bg-[#E6F1FF]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF5FF] text-[#1B66B3]">
                          <item.icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="type-body-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="type-body-sm mt-1 text-slate-600">{item.shortDescription}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
