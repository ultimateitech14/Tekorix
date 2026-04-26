import Link from "next/link";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { publicContactContent } from "@/lib/constants/public-content";
import { themeTokens } from "@/lib/theme/tokens";

const contactCards = [
  {
    label: "Email",
    value: publicContactContent.email,
    href: `mailto:${publicContactContent.email}`,
  },
  {
    label: "Phone",
    value: publicContactContent.phone,
    href: `tel:${publicContactContent.phone.replace(/\s+/g, "")}`,
  },
  {
    label: "Office hours",
    value: publicContactContent.officeHours,
  },
];

export function ContactDirectInfo() {
  const { colors } = themeTokens;

  return (
    <section className="bg-[#E6F1FF] public-section">
      <div className="site-container grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="public-stack">
          <HomeSectionHeading
            eyebrow="Direct contact"
            title="Prefer a direct route instead of a form?"
            description="Use these direct contact details when you already know the conversation you want to start."
          />

          <div className="overflow-hidden rounded-[1.75rem] bg-[linear-gradient(165deg,#F9FCFF_0%,#EEF7FF_100%)] shadow-[0_24px_56px_-40px_rgba(15,23,42,0.3)]">
            {contactCards.map((item, index) => (
              <div key={item.label} className="px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-lg font-semibold text-slate-950 transition-colors hover:text-[#1B66B3]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-lg font-semibold text-slate-950">{item.value}</p>
                  )}
                </div>
                {index < contactCards.length - 1 ? <div className="mt-5 h-px bg-[#DCEBFA]" /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#F8FBFF] p-7 shadow-[0_28px_68px_-44px_rgba(15,23,42,0.28)] sm:p-8">
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

          <div className="mt-8 grid gap-4">
            <Link
              href="#company-inquiry"
              className="group flex items-center justify-between rounded-[1.35rem] border border-[#BED9F3] bg-white px-5 py-4 transition-colors hover:bg-[#EEF6FF]"
            >
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: colors.primary }}>
                  Company path
                </span>
                <span className="mt-1 block text-base font-semibold text-slate-950">Get My Team</span>
              </span>
              <span className="text-sm font-semibold text-[#1B66B3] transition-transform group-hover:translate-x-0.5">
                Open
              </span>
            </Link>
            <Link
              href="#candidate-inquiry"
              className="group flex items-center justify-between rounded-[1.35rem] border border-[#BED9F3] bg-white px-5 py-4 transition-colors hover:bg-[#EEF6FF]"
            >
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: colors.primary }}>
                  Candidate path
                </span>
                <span className="mt-1 block text-base font-semibold text-slate-950">Apply Now</span>
              </span>
              <span className="text-sm font-semibold text-[#1B66B3] transition-transform group-hover:translate-x-0.5">
                Open
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

