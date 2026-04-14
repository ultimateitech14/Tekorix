import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";

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
  return (
    <section className="bg-[#E6F1FF] public-section">
      <div className="site-container public-stack">
        <HomeSectionHeading
          eyebrow="Service lines"
          title="Structured offers built for team building, delivery, and long-term capability."
          description="Tekorix combines consulting, staffing, IT services, and workforce development so clients can move from planning to execution without changing partners."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.title}
              className={service.isCore
                ? "rounded-xl border border-[#1B66B3] bg-[#EDF5FF] p-6 shadow-sm sm:p-7"
                : "rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-6 shadow-sm sm:p-7"}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={service.isCore
                    ? "inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1B66B3] text-sm font-semibold text-white"
                    : "inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF5FF] text-sm font-semibold text-[#1B66B3]"}
                >
                  {service.number}
                </span>
                {service.isCore ? (
                  <span className="rounded-full bg-[#EDF5FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B66B3]">
                    Core service
                  </span>
                ) : null}
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

