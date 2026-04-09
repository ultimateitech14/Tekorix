import { themeTokens } from "@/lib/theme/tokens";
import { publicContactContent } from "@/lib/constants/public-content";

const quickItems = [
  {
    title: "Office hours",
    description: publicContactContent.officeHours,
  },
  {
    title: "Company inquiries",
    description: "Use the company form when you need hiring, staffing, or team support.",
  },
  {
    title: "Candidate inquiries",
    description: "Use the candidate form for profile submission, LinkedIn review, or resume sharing.",
  },
];

export function ContactQuickBlock() {
  const { colors } = themeTokens;

  return (
    <section style={{ backgroundColor: colors.surfaceAlt }} className="py-8 sm:py-10">
      <div className="site-container grid gap-4 xl:grid-cols-3">
        {quickItems.map((item) => (
          <div
            key={item.title}
            className="rounded-[1.5rem] border bg-[#DCEEFF] px-5 py-5 shadow-[0_18px_44px_-40px_rgba(15,23,42,0.24)]"
            style={{ borderColor: colors.border }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-[0.18em]"
              style={{ color: colors.primary }}
            >
              {item.title}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

