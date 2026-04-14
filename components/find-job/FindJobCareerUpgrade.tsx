import Link from "next/link";
import { ArrowRight, Compass, FileSearch, Route } from "lucide-react";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

const advisoryTracks = [
  {
    icon: Route,
    title: "Role-fit direction",
    description: "Understand which product, platform, cloud, or data roles align best with your current strengths.",
  },
  {
    icon: Compass,
    title: "1-3 year planning",
    description: "Get clearer guidance on what skills and experience patterns help candidates move into stronger teams.",
  },
  {
    icon: FileSearch,
    title: "Resume and interview signals",
    description: "Learn what hiring managers scan for when assessing product-facing engineering profiles.",
  },
];

export function FindJobCareerUpgrade() {
  const { colors } = themeTokens;

  return (
    <section className="bg-[#E6F1FF] public-section">
      <div className="site-container public-stack">
        <HomeSectionHeading
          eyebrow="Upgrade career"
          title="Get practical guidance on how to position your next career move."
          description="Tekorix can help candidates understand role fit, move from support or services into product teams, and improve how their profile is presented to hiring managers."
          align="center"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {advisoryTracks.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border bg-[#F8FBFF] p-6 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.25)]"
              style={{ borderColor: colors.border }}
            >
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: colors.primary }}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div
          className="rounded-[2rem] border bg-[#F8FBFF] px-6 py-8 shadow-[0_28px_80px_-54px_rgba(15,23,42,0.22)] sm:px-8"
          style={{ borderColor: colors.border }}
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: colors.primary }}>
                Career review
              </p>
              <h3 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Want a clearer path before you apply broadly?
              </h3>
              <p className="max-w-3xl text-base leading-7 text-slate-600">
                Use the stronger candidate-intake path so Tekorix can review your target role, location, and
                profile positioning with more context.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="border-0 text-white shadow-[0_20px_40px_-22px_rgba(37,99,235,0.65)] hover:opacity-95"
              style={{ backgroundColor: colors.primary }}
            >
              <Link href="#market-my-resume">
                Get My Free Review
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

