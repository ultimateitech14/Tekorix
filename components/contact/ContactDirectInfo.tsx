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

          <div className="grid gap-3 rounded-[1.75rem] bg-[linear-gradient(165deg,#F7FBFF_0%,#ECF5FF_100%)] p-4 shadow-[0_24px_56px_-40px_rgba(15,23,42,0.3)] sm:p-5">
            {contactCards.map((item) => (
              <div key={item.label} className="rounded-[1.2rem] bg-[linear-gradient(180deg,rgba(248,251,255,0.98)_0%,rgba(238,246,255,0.98)_100%)] px-5 py-4 shadow-[0_16px_34px_-30px_rgba(15,23,42,0.2)] sm:px-6">
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
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[linear-gradient(165deg,#F7FBFF_0%,#ECF5FF_100%)] p-7 shadow-[0_28px_68px_-44px_rgba(15,23,42,0.28)] sm:p-8">
          <p
            className="inline-flex rounded-full bg-[#EDF5FF] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] sm:px-4 sm:py-1.5 sm:text-sm sm:tracking-[0.18em]"
            style={{ color: colors.primary }}
          >
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
              className="group flex items-center justify-between gap-4 rounded-[1.45rem] bg-[linear-gradient(135deg,rgba(227,240,255,0.95)_0%,rgba(248,251,255,0.98)_100%)] px-5 py-4 shadow-[0_18px_38px_-30px_rgba(27,102,179,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_46px_-30px_rgba(27,102,179,0.28)]"
            >
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: colors.primary }}>
                  Company path
                </span>
                <span className="mt-1 block text-base font-semibold text-slate-950">Get My Team</span>
              </span>
              <span className="inline-flex min-w-[4.9rem] items-center justify-center rounded-full bg-[#EDF5FF] px-3 py-2 text-sm font-semibold text-[#1B66B3] transition-transform group-hover:translate-x-0.5">
                Open
              </span>
            </Link>
            <Link
              href="#candidate-inquiry"
              className="group flex items-center justify-between gap-4 rounded-[1.45rem] bg-[linear-gradient(135deg,rgba(227,240,255,0.95)_0%,rgba(248,251,255,0.98)_100%)] px-5 py-4 shadow-[0_18px_38px_-30px_rgba(27,102,179,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_46px_-30px_rgba(27,102,179,0.28)]"
            >
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: colors.primary }}>
                  Candidate path
                </span>
                <span className="mt-1 block text-base font-semibold text-slate-950">Apply Now</span>
              </span>
              <span className="inline-flex min-w-[4.9rem] items-center justify-center rounded-full bg-[#EDF5FF] px-3 py-2 text-sm font-semibold text-[#1B66B3] transition-transform group-hover:translate-x-0.5">
                Open
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

