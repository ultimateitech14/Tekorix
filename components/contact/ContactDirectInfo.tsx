import Link from "next/link";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { Button } from "@/components/ui/button";
import { publicContactContent } from "@/lib/constants/public-content";
import { themeTokens } from "@/lib/theme/tokens";

const contactCards = [
  {
    label: "Email",
    value: publicContactContent.email,
    href: `mailto:${publicContactContent.email}`,
    detail: "General inquiries, hiring requests, and delivery conversations.",
  },
  {
    label: "Phone",
    value: publicContactContent.phone,
    href: `tel:${publicContactContent.phone.replace(/\s+/g, "")}`,
    detail: "Business hours support for direct discussions and call-backs.",
  },
  {
    label: "Office hours",
    value: publicContactContent.officeHours,
    detail: "Use forms any time and Tekorix can follow up in the next active window.",
  },
];

export function ContactDirectInfo() {
  const { colors } = themeTokens;

  return (
    <section className="bg-[#CFE3FF] public-section">
      <div className="site-container grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="public-stack">
          <HomeSectionHeading
            eyebrow="Direct contact"
            title="Prefer a direct route instead of a form?"
            description="Use these direct contact details when you already know the conversation you want to start."
          />

          <div className="grid gap-4">
            {contactCards.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border bg-[#DCEEFF] px-5 py-5 shadow-[0_18px_44px_-40px_rgba(15,23,42,0.28)]"
                style={{ borderColor: colors.border }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-3 block text-lg font-semibold text-slate-950 hover:text-[#1B66B3]"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-3 text-lg font-semibold text-slate-950">{item.value}</p>
                )}
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-[2rem] border bg-[#DCEEFF] p-7 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.2)] sm:p-8"
          style={{ borderColor: colors.border }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: colors.primary }}>
            Get in touch
          </p>
          <h3 className="mt-4 font-display text-3xl font-semibold text-slate-950">
            Support that matches the inquiry.
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Company requests, candidate outreach, and broader business questions do not need the same flow.
            The page structure keeps those paths separate while still offering direct Tekorix contact when
            needed.
          </p>

          <div className="mt-8 grid gap-3">
            <Button
              asChild
              className="border-0 text-white shadow-[0_20px_40px_-22px_rgba(37,99,235,0.65)] hover:opacity-95"
              style={{ backgroundColor: colors.primary }}
            >
              <Link href="#company-inquiry">Get My Team</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#7FB5EA] bg-[#DCEEFF] text-slate-950 hover:bg-[#CFE3FF] hover:text-slate-950"
            >
              <Link href="#candidate-inquiry">Apply Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

