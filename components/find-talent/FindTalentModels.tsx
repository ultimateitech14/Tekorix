import Link from "next/link";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

const models = [
  {
    title: "Permanent Hire",
    description:
      "Bring long-term talent into your organization when you need continuity, ownership, and deeper role alignment.",
    bullets: [
      "Ideal for key product, platform, and leadership hires",
      "Supports long-horizon roadmap continuity",
      "Candidate screening aligned to team fit and delivery needs",
      "Best when you want talent embedded for the long term",
    ],
    cta: "Request Permanent Hiring",
  },
  {
    title: "Contractual Hire",
    description:
      "Access specialist capability quickly for project-driven needs, programme acceleration, or short-to-mid term capacity gaps.",
    bullets: [
      "Useful for urgent delivery or transformation programmes",
      "On-roll consultant options managed through Tekorix",
      "Flexible ramp-up for project-based demand",
      "Reduced hiring overhead for time-sensitive roles",
    ],
    cta: "Request Contractual Hiring",
  },
  {
    title: "Hourly Hire",
    description:
      "Use focused specialist bandwidth for targeted delivery needs, advisory help, troubleshooting, or sprint-level execution.",
    bullets: [
      "Works for targeted backlog or specialist tasks",
      "Good fit for niche or part-time expertise",
      "Flexible for discovery, audits, or short sprint support",
      "Lets teams add expertise without a full-time commitment",
    ],
    cta: "Request Hourly Support",
  },
];

export function FindTalentModels() {
  const { colors } = themeTokens;

  return (
    <section className="bg-[#E6F1FF] public-section">
      <div className="site-container public-stack">
        <HomeSectionHeading
          eyebrow="Hiring models"
          title="Choose the hiring structure that matches your delivery pressure."
          description="Tekorix supports permanent hiring, contractual deployment, and hourly engagement so companies can choose the right cost, speed, and continuity model."
        />

        <div className="grid items-stretch gap-5 xl:grid-cols-3">
          {models.map((model, index) => (
            <article
              key={model.title}
              className="flex h-full flex-col rounded-[1.75rem] border bg-[#F8FBFF] p-6 shadow-[0_22px_50px_-44px_rgba(15,23,42,0.28)] sm:p-7"
              style={{
                borderColor: index === 1 ? colors.primary : colors.border,
                backgroundColor: index === 1 ? colors.surfaceAlt : colors.surfaceCard,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: index === 1 ? colors.accent : colors.surfaceAlt,
                    color: index === 1 ? colors.white : colors.primary,
                  }}
                >
                  0{index + 1}
                </span>
                {index === 1 ? (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
                    style={{
                      backgroundColor: colors.surfaceMuted,
                      color: colors.primary,
                    }}
                  >
                    Fastest ramp
                  </span>
                ) : null}
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-display text-2xl font-semibold text-slate-950">{model.title}</h3>
                <p className="text-base leading-7 text-slate-600">{model.description}</p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {model.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                    <span
                      className="mt-2 h-2 w-2 rounded-full"
                      style={{ backgroundColor: colors.accent }}
                      aria-hidden
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[#BED9F3] bg-[#F8FBFF] text-slate-950 hover:bg-[#E6F1FF]"
                >
                  <Link href="#company-lead-form">{model.cta}</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

