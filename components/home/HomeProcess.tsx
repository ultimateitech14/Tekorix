import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Align on business goals, team shape, timelines, and the specialist mix required to de-risk delivery.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "Assemble vetted specialists, delivery pods, or GCC structures with clear onboarding and governance.",
  },
  {
    number: "03",
    title: "Sustain",
    description:
      "Support continuity through performance tracking, coverage planning, and ongoing capability development.",
  },
];

export function HomeProcess() {
  return (
    <section className="bg-[#E6F1FF] public-section">
      <div className="site-container public-stack">
        <HomeSectionHeading
          eyebrow="How we work"
          title="A practical three-step model for building and sustaining delivery."
          description="Our operating approach is intentionally simple: define the outcome, assemble the right team model, and keep the programme stable as it scales."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.title}
              className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-6 shadow-sm sm:p-7"
            >
              <div className="inline-flex rounded-full bg-[#EDF5FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1B66B3]">
                Step {step.number}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

