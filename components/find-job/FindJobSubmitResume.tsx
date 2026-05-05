import Link from "next/link";
import { FileText, Linkedin, Send } from "lucide-react";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
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
    <section id="submit-resume" className="bg-[#E6F1FF] public-section">
      <div className="site-container">
        <div className="grid items-stretch gap-6 xl:grid-cols-2 xl:gap-8">
          <div
            className="flex h-full flex-col rounded-[1.75rem] border bg-[#F8FBFF] p-6 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.22)] sm:p-7"
            style={{ borderColor: colors.border }}
          >
            <HomeSectionHeading
              eyebrow="Submit resume"
              title="Share your resume even when the perfect role is not visible yet."
              description="Use this route when you want Tekorix to review your profile for current or near-term openings across product engineering, SaaS, and enterprise delivery teams."
            />

            <div
              className="mt-8 overflow-hidden rounded-[1.5rem] border bg-white/70"
              style={{ borderColor: colors.border }}
            >
              {resumeSupportItems.map((item, index) => (
                <div
                  key={item.title}
                  className={index === resumeSupportItems.length - 1 ? "px-5 py-5 sm:px-6" : "border-b border-[#E3EFFB] px-5 py-5 sm:px-6"}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-[0_18px_34px_-22px_rgba(37,99,235,0.52)]"
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

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
              <p className="max-w-md text-sm leading-6 text-slate-600">
                Want to understand the team, growth path, and company context before submitting?
              </p>
              <Button
                asChild
                variant="outline"
                className="border-[#BED9F3] bg-white text-slate-950 hover:bg-[#E6F1FF]"
              >
                <Link href="/careers">View Careers Page</Link>
              </Button>
            </div>
          </div>

          <FindJobCandidateLeadForm variant="resume-submission" buttonLabel="Apply Now" />
        </div>
      </div>
    </section>
  );
}

