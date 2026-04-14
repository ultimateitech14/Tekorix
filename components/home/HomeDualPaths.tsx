import Link from "next/link";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
import { navigationCtas } from "@/lib/constants/navigation";

const companyPoints = [
  "Dedicated hiring lanes for specialist roles",
  "Rapid GCC and product pod setup",
  "Flexible staffing, team building, and managed support",
];

const specialistPoints = [
  "Roles across product, data, cloud, and AI",
  "Longer-term enterprise programmes",
  "Career mobility with vetted client teams",
];

export function HomeDualPaths() {
  return (
    <section className="bg-[#E6F1FF] public-section">
      <div className="site-container public-stack">
        <HomeSectionHeading
          eyebrow="Two clear journeys"
          title="Choose the path that matches your next move."
          description="Tekorix is designed for both hiring leaders building teams and specialists looking for high-impact opportunities."
          align="center"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1B66B3]">
              For companies
            </p>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Hire Talent</h3>
            <p className="mt-4 max-w-xl text-base text-slate-600 leading-relaxed">
              Build specialist benches, dedicated engineering teams, and capability center extensions with a
              delivery model designed around speed, quality, and continuity.
            </p>
            <div className="mt-6 grid gap-3">
              {companyPoints.map((point) => (
                <div key={point} className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] px-4 py-3 text-sm text-slate-600">
                  {point}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild size="lg" className="shadow-sm">
                <Link href={navigationCtas.hireTalent.href}>{navigationCtas.hireTalent.label}</Link>
              </Button>
            </div>
          </article>

          <article className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-600">For specialists</p>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Find a Job</h3>
            <p className="mt-4 max-w-xl text-base text-slate-600 leading-relaxed">
              Explore roles with clients building modern products, cloud platforms, intelligent systems, and
              enterprise transformation programmes.
            </p>
            <div className="mt-6 grid gap-3">
              {specialistPoints.map((point) => (
                <div key={point} className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] px-4 py-3 text-sm text-slate-600">
                  {point}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild size="lg" variant="outline">
                <Link href={navigationCtas.findJob.href}>{navigationCtas.findJob.label}</Link>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

