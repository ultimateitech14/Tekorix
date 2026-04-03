import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { themeTokens } from "@/lib/theme/tokens";

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
  const { colors } = themeTokens;

  return (
    <section style={{ backgroundColor: colors.surfaceAlt }} className="py-16 sm:py-20">
      <div className="site-container space-y-10">
        <HomeSectionHeading
          eyebrow="How we work"
          title="A practical three-step model for building and sustaining delivery."
          description="Our operating approach is intentionally simple: define the outcome, assemble the right team model, and keep the programme stable as it scales."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.title}
              className="rounded-[1.75rem] border p-6 shadow-[0_22px_50px_-42px_rgba(62,127,193,0.15)] sm:p-7"
              style={{
                borderColor: colors.border,
                background: "linear-gradient(180deg, rgba(248,251,255,0.98) 0%, rgba(239,245,255,0.88) 100%)",
              }}
            >
              <div
                className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{
                  backgroundColor: colors.surfaceMuted,
                  color: colors.primary,
                }}
              >
                Step {step.number}
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
