import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { themeTokens } from "@/lib/theme/tokens";

const services = [
  {
    number: "01",
    title: "Consulting",
    description:
      "Operating model design, programme planning, and transformation governance for complex business change.",
  },
  {
    number: "02",
    title: "Talent — Staffing & Team Building",
    description:
      "Build dedicated teams, GCC extensions, and specialist benches aligned to roadmap demand and delivery velocity.",
    isCore: true,
  },
  {
    number: "03",
    title: "Solutions & IT Services",
    description:
      "Delivery support across cloud, data, integration, AI, and product engineering for enterprise programmes.",
  },
  {
    number: "04",
    title: "Academy — Upskill & Reskill",
    description:
      "Practical learning tracks that strengthen internal capability and prepare teams for modern platforms and tooling.",
  },
];

export function HomeServices() {
  const { colors } = themeTokens;

  return (
    <section className="py-16 sm:py-20" style={{ backgroundColor: colors.page }}>
      <div className="site-container space-y-10">
        <HomeSectionHeading
          eyebrow="Service lines"
          title="Structured offers built for team building, delivery, and long-term capability."
          description="Tekorix combines consulting, staffing, IT services, and workforce development so clients can move from planning to execution without changing partners."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-[1.75rem] border p-6 shadow-[0_22px_50px_-40px_rgba(62,127,193,0.16)] sm:p-7"
              style={{
                borderColor: service.isCore ? colors.primary : colors.border,
                background:
                  service.isCore
                    ? "linear-gradient(180deg, rgba(230,240,255,0.96) 0%, rgba(220,235,251,0.92) 100%)"
                    : "linear-gradient(180deg, rgba(248,251,255,0.98) 0%, rgba(239,245,255,0.88) 100%)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: service.isCore ? colors.primary : colors.surfaceMuted,
                    color: service.isCore ? colors.white : colors.primary,
                  }}
                >
                  {service.number}
                </span>
                {service.isCore ? (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
                    style={{
                      backgroundColor: colors.surfaceMuted,
                      color: colors.primary,
                    }}
                  >
                    Core service
                  </span>
                ) : null}
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-display text-2xl font-semibold text-slate-950">{service.title}</h3>
                <p className="text-base leading-7 text-slate-600">{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
