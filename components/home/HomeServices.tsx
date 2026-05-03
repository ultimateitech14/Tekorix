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
    title: "Talent - Staffing & Team Building",
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
    title: "Academy - Upskill & Reskill",
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
          titleClassName="!max-w-[50rem] !text-[clamp(1.72rem,1.28rem+1.15vw,2.45rem)]"
        />

        <div className="grid gap-4 md:grid-cols-2 xl:gap-6">
          {services.map((service) => (
            <article
              key={service.title}
              className={service.isCore
                ? "group relative flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-[#1B66B3] bg-[linear-gradient(180deg,rgba(237,245,255,0.98)_0%,rgba(247,251,255,0.98)_100%)] p-5 shadow-[0_22px_58px_-42px_rgba(27,102,179,0.24)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#145188] hover:shadow-[0_30px_70px_-40px_rgba(27,102,179,0.32)] active:-translate-y-0.5 sm:p-6"
                : "group relative flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-[#BED9F3] bg-[linear-gradient(180deg,rgba(248,251,255,0.98)_0%,rgba(241,247,255,0.98)_100%)] p-5 shadow-[0_20px_54px_-42px_rgba(27,102,179,0.2)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#9CC6F1] hover:bg-white hover:shadow-[0_28px_66px_-40px_rgba(27,102,179,0.24)] active:-translate-y-0.5 sm:p-6"}
            >
              <div
                aria-hidden="true"
                className={service.isCore
                  ? "absolute right-0 top-0 h-28 w-28 rounded-full bg-[rgba(27,102,179,0.12)] blur-3xl"
                  : "absolute right-0 top-0 h-28 w-28 rounded-full bg-[rgba(83,174,250,0.12)] blur-3xl"}
              />

              <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
                <span
                  className={service.isCore
                    ? "inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1B66B3] text-sm font-semibold text-white transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12"
                    : "inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#EDF5FF] text-sm font-semibold text-[#1B66B3] transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12"}
                >
                  {service.number}
                </span>
                {service.isCore ? (
                  <span className="inline-flex rounded-full bg-[#EDF5FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B66B3] shadow-[0_12px_28px_-22px_rgba(27,102,179,0.32)]">
                    Core service
                  </span>
                ) : null}
              </div>

              <div className="relative z-10 mt-6 flex flex-1 flex-col space-y-3">
                <h3 className="font-display text-[1.18rem] font-semibold leading-snug tracking-[-0.02em] text-slate-900 sm:text-[1.34rem]">
                  {service.title}
                </h3>
                <p className="text-sm leading-7 text-slate-600 sm:text-base">{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
