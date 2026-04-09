import Link from "next/link";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
import { publicBrandContent, publicSocialLinks } from "@/lib/constants/public-content";
import { themeTokens } from "@/lib/theme/tokens";

const profiles = [
  {
    title: `${publicBrandContent.companyName} company page`,
    description: `Follow ${publicBrandContent.companyName} for hiring updates, service announcements, and broader capability visibility.`,
    cta: `Follow ${publicBrandContent.companyName}`,
    href: publicSocialLinks.linkedinCompany,
  },
  {
    title: "Leadership profile",
    description:
      "Use leadership visibility for strategic introductions, business inquiries, and higher-trust context.",
    cta: "Connect with Leadership",
    href: publicSocialLinks.linkedinLeadership,
  },
  {
    title: "Company updates",
    description:
      "Keep delivery highlights, role updates, and capability announcements visible from one public channel.",
    cta: "View Updates",
    href: publicSocialLinks.linkedinUpdates,
  },
];

export function ContactLinkedIn() {
  const { colors } = themeTokens;

  return (
    <section style={{ backgroundColor: colors.surfaceAlt }} className="public-section">
      <div className="site-container public-stack">
        <HomeSectionHeading
          eyebrow="LinkedIn and network presence"
          title="Keep professional connections visible alongside direct inquiry routes."
          description="Use LinkedIn as a parallel trust layer for visitors who prefer to follow, connect, or continue the conversation through a professional network."
        />

        <div className="grid gap-5 xl:grid-cols-3">
          {profiles.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.75rem] border bg-[#DCEEFF] p-6 shadow-[0_22px_50px_-44px_rgba(15,23,42,0.24)] sm:p-7"
              style={{ borderColor: colors.border }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">LinkedIn</p>
              <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>

              <div className="mt-8">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[#7FB5EA] bg-[#DCEEFF] text-slate-950 hover:bg-[#CFE3FF]"
                >
                  <Link href={item.href} target="_blank" rel="noreferrer">
                    {item.cta}
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

