import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { ContactCandidateForm } from "@/components/contact/ContactCandidateForm";
import { ContactCompanyForm } from "@/components/contact/ContactCompanyForm";
import { themeTokens } from "@/lib/theme/tokens";

const trustBadges = [
  "Company hiring and team support",
  "Candidate outreach and profile review",
  "Direct contact for delivery conversations",
];

export function ContactInquiryGrid() {
  const { colors } = themeTokens;

  return (
    <section style={{ backgroundColor: colors.surfaceAlt }} className="public-section">
      <div className="site-container public-stack">
        <HomeSectionHeading
          eyebrow="Core inquiry flow"
          title="Choose the contact path that matches your next move."
          description="Companies can share hiring or team-building requirements, while candidates can submit their profile for review from the same Tekorix contact page."
        />

        <div className="flex flex-wrap gap-2">
          {trustBadges.map((badge) => (
            <div
              key={badge}
              className="rounded-full border bg-[#F8FBFF] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600"
              style={{ borderColor: colors.border }}
            >
              {badge}
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ContactCompanyForm />
          <ContactCandidateForm />
        </div>
      </div>
    </section>
  );
}

