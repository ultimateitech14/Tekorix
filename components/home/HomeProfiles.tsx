import Link from "next/link";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";

const profiles = [
  {
    name: "Aarav Menon",
    role: "Cloud & Data Architect",
    summary: "12 years | Fintech, SaaS, and data platform modernization",
    skills: ["AWS", "Snowflake", "Data Platforms", "Governance"],
  },
  {
    name: "Naina Kapoor",
    role: "Full-Stack Engineer",
    summary: "8 years | B2B SaaS, enterprise portals, and digital products",
    skills: ["React", "Next.js", "Node.js", "TypeScript"],
  },
  {
    name: "Rohan Iyer",
    role: "AI / ML Engineer",
    summary: "9 years | GenAI, MLOps, and intelligent automation",
    skills: ["Python", "LLMOps", "Azure AI", "MLOps"],
  },
];

export function HomeProfiles() {
  return (
    <section className="bg-[#CFE3FF] public-section">
      <div className="site-container public-stack">
        <HomeSectionHeading
          eyebrow="Representative profiles"
          title="Illustrative specialist profiles aligned to modern delivery needs."
          description="These cards show the type of vetted expertise Tekorix can position into teams, GCC pods, and specialist hiring plans."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {profiles.map((profile) => (
            <article
              key={profile.name}
              className="rounded-xl border border-[#7FB5EA] bg-[#DCEEFF] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#B5D5F8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B66B3]">
                  Representative profile
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-600">
                  Talent ready
                </span>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">{profile.name}</h3>
                <p className="text-base font-medium text-[#1B66B3]">
                  {profile.role}
                </p>
                <p className="text-base text-slate-600 leading-relaxed">{profile.summary}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[#7FB5EA] bg-[#C6E0FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">View Resume</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          These illustrative profiles show the kinds of specialist capability Tekorix can position into
          teams. Detailed profile sharing can happen through a direct inquiry path.
        </p>
      </div>
    </section>
  );
}

