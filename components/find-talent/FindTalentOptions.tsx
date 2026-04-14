import Link from "next/link";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

const options = [
  {
    title: "Build a Team from Scratch",
    bullets: [
      "Define the mix of roles across product, engineering, QA, and delivery",
      "Stand up pods for new products, features, or GCC extensions",
      "Create a ramp plan matched to budget and release pressure",
    ],
    cta: "Build My Team",
  },
  {
    title: "Restructure Your Existing Team",
    bullets: [
      "Fill delivery gaps without restarting your whole org chart",
      "Rebalance specialist coverage where throughput is blocked",
      "Add targeted expertise while Tekorix handles coordination overhead",
    ],
    cta: "Reshape My Team",
  },
  {
    title: "Choose Your Engagement Model",
    bullets: [
      "Compare permanent, contract, and hourly routes in one conversation",
      "Blend bench resources with long-term hiring where needed",
      "Adjust scale-up and scale-down based on roadmap changes",
    ],
    cta: "Choose My Model",
  },
];

export function FindTalentOptions() {
  const { colors } = themeTokens;

  return (
    <section className="bg-[#E6F1FF] public-section">
      <div className="site-container public-stack">
        <HomeSectionHeading
          eyebrow="Build or reshape"
          title="Use Tekorix for team structure decisions, not only staffing requests."
          description="We support team creation, restructuring, and engagement-model selection so companies can solve delivery bottlenecks with the right hiring shape."
        />

        <div className="grid gap-5 xl:grid-cols-3">
          {options.map((option, index) => (
            <article
              key={option.title}
              className="rounded-[1.75rem] border p-6 shadow-[0_22px_50px_-44px_rgba(15,23,42,0.25)] sm:p-7"
              style={{
                borderColor: colors.border,
                backgroundColor: index === 0 ? colors.surfaceAlt : colors.surfaceCard,
              }}
            >
              <h3 className="font-display text-2xl font-semibold text-slate-950">{option.title}</h3>

              <ul className="mt-5 space-y-3">
                {option.bullets.map((bullet) => (
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
                  <Link href="#company-lead-form">{option.cta}</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

