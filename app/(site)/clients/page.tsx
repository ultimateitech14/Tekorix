import type { Metadata } from "next";
import { Building2, Handshake, Layers3, ShieldCheck } from "lucide-react";

import { PublicBottomCta } from "@/components/global/PublicBottomCta";
import { PublicPageHero } from "@/components/global/PublicPageHero";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { publicClientLogoPlaceholders } from "@/lib/constants/public-content";
import { buildMetadata } from "@/lib/seo";
import { themeTokens } from "@/lib/theme/tokens";

export const metadata: Metadata = buildMetadata({
  title: "Client Partnerships and Delivery Trust",
  description:
    "See how Tekorix positions its client partnerships around delivery continuity, capability support, and scalable engagement models.",
  path: "/clients",
  keywords: ["clients", "delivery partner", "staffing partner", "engineering support", "trust"],
});

const partnershipBlocks = [
  {
    title: "Scaling product and platform teams",
    situation: "A client needs stronger engineering capacity without slowing current roadmap execution.",
    response: "Tekorix can support with specialist hiring, contract talent, or team-based extension paths.",
  },
  {
    title: "Improving delivery continuity",
    situation:
      "A programme has momentum risk because internal team bandwidth and operational structure are stretched.",
    response: "Tekorix can pair workforce support with clearer operating rhythm and role coverage planning.",
  },
  {
    title: "Standing up a new capability lane",
    situation:
      "A client needs to create a new function, pod, or GCC-style extension but wants less setup friction.",
    response:
      "Tekorix can help define the team shape, then support the staffing and execution layer behind it.",
  },
];

const trustThemes = [
  {
    icon: Handshake,
    title: "Partnership over placement",
    description: "The site positions Tekorix as an ongoing partner, not only a one-time sourcing channel.",
  },
  {
    icon: Layers3,
    title: "Flexible engagement paths",
    description:
      "Clients can use specialist hires, dedicated teams, or advisory-led support depending on need.",
  },
  {
    icon: ShieldCheck,
    title: "Operational confidence",
    description:
      "Payroll, compliance, HR coordination, and continuity stay visible when staffing models require it.",
  },
  {
    icon: Building2,
    title: "Delivery context matters",
    description:
      "The message stays grounded in actual team-building and programme support, not abstract brand statements.",
  },
];

const engagementHighlights = [
  {
    value: "Team-first",
    label: "Commercial direction",
    detail: "Staffing, team building, and delivery support remain the core visible themes.",
  },
  {
    value: "Cross-model",
    label: "Support options",
    detail: "Permanent, contract, advisory, and pod-based models can sit under one partner conversation.",
  },
  {
    value: "Proof-ready",
    label: "Future expansion",
    detail: "The structure is designed for later addition of real logos, case studies, and industry proof.",
  },
];

export default function ClientsPage() {
  const { colors } = themeTokens;

  return (
    <>
      <PublicPageHero
        eyebrow="Clients"
        title="Positioned for partnerships built on delivery trust, not generic vendor language."
        description="The Tekorix client story is designed to show how the company can support delivery continuity, team quality, and engagement flexibility without fabricating named proof before final approved content exists."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "View Services", href: "/services" }}
        signals={[
          "Generic-safe proof positioning",
          "Designed for future logo and case-study expansion",
          "Client trust without exaggerated claims",
        ]}
        panelEyebrow="Client page role"
        panelTitle="This page works as a trust layer for prospects evaluating capability, flexibility, and partnership fit."
        panelItems={[
          {
            title: "Who it serves",
            description:
              "Decision-makers evaluating staffing, consulting, and engineering support across multiple paths.",
          },
          {
            title: "What it avoids",
            description:
              "No fabricated client names, fake quotes, or over-specific metrics that cannot be backed today.",
          },
          {
            title: "What it adds",
            description:
              "A cleaner proof page that sits naturally beside Services, Industries, and Find Talent.",
          },
        ]}
        panelNoteTitle="Trust-first page"
        panelNoteDescription="Use this page to support credibility and client conversation flow before deeper case-study content is introduced."
      />

      <section className="bg-[#CFE3FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Partnership positioning"
            title="A clean public proof layer for the kinds of clients Tekorix is built to support."
            description="These cards signal the type of organizations and delivery environments the business is designed around while leaving room for approved logos later."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {publicClientLogoPlaceholders.map((item, index) => (
              <div
                key={item.name}
                className="rounded-[1.5rem] border bg-[#DCEEFF] p-5 text-center shadow-[0_24px_60px_-46px_rgba(15,23,42,0.2)]"
                style={{ borderColor: colors.border }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
                  L{index + 1}
                </div>
                <p
                  className="mt-4 text-sm font-semibold uppercase tracking-[0.14em]"
                  style={{ color: colors.accent }}
                >
                  Client profile
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section" style={{ backgroundColor: colors.surfaceAlt }}>
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Capability highlights"
            title="Examples of the partnership patterns this client page should communicate."
            description="Rather than overbuilding heavy case studies now, the page uses scenario-style blocks that explain where Tekorix can create value."
            align="center"
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {partnershipBlocks.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.75rem] border bg-[#DCEEFF] p-6 shadow-[0_22px_55px_-44px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-[0.18em]"
                  style={{ color: colors.accent }}
                >
                  Capability block
                </p>
                <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h2>
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-[#DCEEFF] px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Client need
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{item.situation}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-[#DCEEFF] px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Tekorix role
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{item.response}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-[2rem] border bg-[#DCEEFF] p-6 shadow-[0_28px_70px_-50px_rgba(15,23,42,0.2)] sm:p-8"
            style={{ borderColor: colors.border }}
          >
            <HomeSectionHeading
              eyebrow="Working style"
              title="The proof story should reinforce how Tekorix works with clients, not just who it wants to serve."
              description="This keeps the page grounded in credible partnership themes until more detailed client references are approved."
            />

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {trustThemes.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border bg-[#DCEEFF] px-5 py-6"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: index === 0 ? colors.surfaceAlt : colors.surfaceCard,
                  }}
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white"
                    style={{
                      backgroundColor: index === 0 ? colors.primary : colors.surfaceMuted,
                      color: index === 0 ? colors.white : colors.primary,
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#CFE3FF] public-section">
        <div className="site-container public-stack">
          <HomeSectionHeading
            eyebrow="Engagement highlights"
            title="A simple success layer that can expand later without changing the page structure."
            description="These highlights help the page feel complete now while keeping room for later approved metrics, logos, or named delivery stories."
            align="center"
          />

          <div className="grid gap-5 md:grid-cols-3">
            {engagementHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border bg-[#DCEEFF] p-6 text-center shadow-[0_24px_60px_-46px_rgba(15,23,42,0.22)]"
                style={{ borderColor: colors.border }}
              >
                <p className="font-display text-4xl font-semibold tracking-tight text-slate-950">
                  {item.value}
                </p>
                <p
                  className="mt-2 text-sm font-semibold uppercase tracking-[0.16em]"
                  style={{ color: colors.accent }}
                >
                  {item.label}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicBottomCta
        title="Need a partner for team building, delivery continuity, or specialist capability?"
        description="Use the Tekorix public site to move from trust-building into the right next conversation for staffing, consulting, or engineering execution support."
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "Find Talent", href: "/find-talent" }}
      />
    </>
  );
}

