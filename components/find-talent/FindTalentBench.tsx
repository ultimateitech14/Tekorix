import Link from "next/link";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

const benchRoles = [
  "Full-Stack Developers",
  "Backend Engineers",
  "Frontend Developers",
  "Cloud Engineers",
  "QA / Test Engineers",
  "DevOps Engineers",
  "Product Managers",
  "Solutions Architects",
];

export function FindTalentBench() {
  const { colors } = themeTokens;

  return (
    <section style={{ backgroundColor: colors.surfaceAlt }} className="public-section">
      <div className="site-container public-stack">
        <HomeSectionHeading
          eyebrow="Bench resources"
          title="Ready-to-deploy talent categories for faster starts."
          description="Use Tekorix bench capacity when you need specialist coverage sooner than a traditional hiring cycle allows."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {benchRoles.map((role) => (
              <div
                key={role}
                className="rounded-[1.5rem] border bg-[#DCEEFF] px-5 py-5 shadow-[0_18px_44px_-40px_rgba(15,23,42,0.28)]"
                style={{ borderColor: colors.border }}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: colors.primaryDark }}>
                  Available category
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-slate-950">{role}</h3>
              </div>
            ))}
          </div>

          <div
            className="rounded-[1.75rem] border bg-[#DCEEFF] p-6 shadow-[0_22px_50px_-42px_rgba(15,23,42,0.24)] sm:p-7"
            style={{ borderColor: colors.border }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Why this helps</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
              <p>Bench-ready talent reduces lost time between demand approval and actual delivery start.</p>
              <p>Tekorix can position consultants, short-term specialists, or broader delivery pods depending on the need.</p>
              <p>When a role is not already on the bench, we can still shape the right hiring model and route.</p>
            </div>

            <div className="mt-8 grid gap-3">
              <Button
                asChild
                className="border-0 text-white hover:opacity-95"
                style={{ backgroundColor: colors.accent }}
              >
                <Link href="#company-lead-form">View Available Talent</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#7FB5EA] bg-[#DCEEFF] text-slate-950 hover:bg-[#CFE3FF]"
              >
                <Link href="/contact">Talk to Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

