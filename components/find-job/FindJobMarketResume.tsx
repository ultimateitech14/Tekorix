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
        <div className="grid items-stretch gap-6 xl:grid-cols-2 xl:gap-8">
          <div
            className="flex h-full flex-col rounded-[1.75rem] border bg-[#F8FBFF] p-6 shadow-[0_22px_60px_-48px_rgba(15,23,42,0.2)] sm:p-7"
            style={{ borderColor: colors.border }}
          >
            <HomeSectionHeading
              eyebrow="Market my resume"
              title="Share a stronger candidate brief for future matching and profile marketing."
              description="If you want Tekorix to review you beyond one opening, submit your target role, preferred location, salary direction, and core skills along with your resume."
            />

            <div
              className="mt-8 overflow-hidden rounded-[1.5rem] border bg-white/70"
              style={{ borderColor: colors.border }}
            >
              {marketSignals.map((item, index) => (
                <div
                  key={item.title}
                  className={index === marketSignals.length - 1 ? "px-5 py-5 sm:px-6" : "border-b border-[#E3EFFB] px-5 py-5 sm:px-6"}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-[0_18px_34px_-22px_rgba(37,99,235,0.52)]"
                      style={{
                        backgroundColor: item.title === "Market your strengths" ? colors.accent : colors.primary,
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

          <FindJobCandidateLeadForm variant="market-resume" buttonLabel="Submit to Be Marketed" />
        </div>
      </div>
    </section>
  );
}

