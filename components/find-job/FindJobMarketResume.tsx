import { Globe2, Layers3, Megaphone } from "lucide-react";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { themeTokens } from "@/lib/theme/tokens";

import { FindJobCandidateLeadForm } from "./FindJobCandidateLeadForm";

const marketSignals = [
  {
    icon: Megaphone,
    title: "Market your strengths",
    description: "Share desired role, stack, and salary direction so Tekorix can position your profile more accurately.",
  },
  {
    icon: Globe2,
    title: "Stay visible for future openings",
    description: "Use this path when you want to be considered beyond a single posted job and across incoming requirements.",
  },
  {
    icon: Layers3,
    title: "Designed for structured matching",
    description: "This route captures the details needed for stronger matching across future openings and inbound hiring needs.",
  },
];

export function FindJobMarketResume() {
  const { colors } = themeTokens;

  return (
    <section
      id="market-my-resume"
      className="public-section"
      style={{ backgroundColor: colors.surfaceAlt }}
    >
      <div className="site-container">
        <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <HomeSectionHeading
              eyebrow="Market my resume"
              title="Share a stronger candidate brief for future matching and profile marketing."
              description="If you want Tekorix to review you beyond one opening, submit your target role, preferred location, salary direction, and core skills along with your resume."
            />

            <div
              className="rounded-[1.75rem] border bg-[#DCEEFF] p-6 shadow-[0_22px_60px_-48px_rgba(15,23,42,0.2)]"
              style={{ borderColor: colors.border }}
            >
              <div className="space-y-4">
                {marketSignals.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border bg-[#DCEEFF] px-4 py-4"
                    style={{
                      borderColor: colors.border,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
                        style={{
                          backgroundColor:
                            item.title === "Market your strengths" ? colors.accent : "rgba(255,255,255,0.14)",
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                      </span>
                      <div className="space-y-2">
                        <p className="text-base font-semibold text-slate-950">{item.title}</p>
                        <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <FindJobCandidateLeadForm variant="market-resume" buttonLabel="Submit to Be Marketed" />
        </div>
      </div>
    </section>
  );
}

