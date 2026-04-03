import Link from "next/link";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

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
  const { colors } = themeTokens;

  return (
    <section className="py-16 sm:py-20" style={{ backgroundColor: colors.page }}>
      <div className="site-container space-y-10">
        <HomeSectionHeading
          eyebrow="Representative profiles"
          title="Illustrative specialist profiles aligned to modern delivery needs."
          description="These cards show the type of vetted expertise Tekorix can position into teams, GCC pods, and specialist hiring plans."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {profiles.map((profile) => (
            <article
              key={profile.name}
              className="rounded-[1.75rem] border p-6 shadow-[0_22px_50px_-42px_rgba(62,127,193,0.15)]"
              style={{
                borderColor: colors.border,
                background: "linear-gradient(180deg, rgba(248,251,255,0.98) 0%, rgba(239,245,255,0.88) 100%)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{
                    backgroundColor: colors.surfaceMuted,
                    color: colors.primary,
                  }}
                >
                  Representative profile
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Talent ready
                </span>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="font-display text-2xl font-semibold text-slate-950">{profile.name}</h3>
                <p className="text-lg font-medium" style={{ color: colors.primary }}>
                  {profile.role}
                </p>
                <p className="text-sm leading-6 text-slate-600">{profile.summary}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600"
                    style={{ borderColor: colors.border, backgroundColor: colors.surfaceAlt }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-white text-slate-950 hover:bg-slate-50"
                  style={{ borderColor: colors.border }}
                >
                  <Link href="/contact">View Resume</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p className="text-sm leading-6 text-slate-500">
          These illustrative profiles show the kinds of specialist capability Tekorix can position into
          teams. Detailed profile sharing can happen through a direct inquiry path.
        </p>
      </div>
    </section>
  );
}
