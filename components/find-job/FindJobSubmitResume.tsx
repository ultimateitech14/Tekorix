import { FileText, Linkedin, Send } from "lucide-react";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { themeTokens } from "@/lib/theme/tokens";

import { FindJobCandidateLeadForm } from "./FindJobCandidateLeadForm";

const resumeSupportItems = [
  {
    icon: FileText,
    title: "No exact role today?",
    description: "Submit your profile once so Tekorix can match you against future openings and delivery needs.",
  },
  {
    icon: Linkedin,
    title: "Share more context",
    description: "Add your LinkedIn profile to help recruiters quickly understand stack, projects, and trajectory.",
  },
  {
    icon: Send,
    title: "Simple next step",
    description: "Your resume can be reviewed for current and upcoming opportunities in one submission path.",
  },
];

export function FindJobSubmitResume() {
  const { colors } = themeTokens;

  return (
    <section id="submit-resume" className="bg-white py-16 sm:py-20">
      <div className="site-container">
        <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-6">
            <HomeSectionHeading
              eyebrow="Submit resume"
              title="Share your resume even when the perfect role is not visible yet."
              description="Use this route when you want Tekorix to review your profile for current or near-term openings across product engineering, SaaS, and enterprise delivery teams."
            />

            <div
              className="rounded-[1.75rem] border p-6"
              style={{ backgroundColor: colors.surfaceAlt, borderColor: colors.border }}
            >
              <div className="space-y-4">
                {resumeSupportItems.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white bg-white px-4 py-4">
                    <div className="flex items-start gap-3">
                      <span
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: colors.primary }}
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

          <FindJobCandidateLeadForm variant="resume-submission" buttonLabel="Apply Now" />
        </div>
      </div>
    </section>
  );
}
