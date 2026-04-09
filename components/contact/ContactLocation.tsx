import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { publicContactContent, publicOfficeContent } from "@/lib/constants/public-content";
import { themeTokens } from "@/lib/theme/tokens";

const officeItems = [
  {
    label: "Primary office",
    value: publicContactContent.addressLines.join(", "),
  },
  {
    label: "Delivery coverage",
    value: publicContactContent.deliveryCoverage,
  },
  {
    label: "Working style",
    value: publicContactContent.workingStyle,
  },
];

export function ContactLocation() {
  const { colors } = themeTokens;

  return (
    <section className="bg-[#CFE3FF] public-section">
      <div className="site-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="public-stack">
          <HomeSectionHeading
            eyebrow="Location and coverage"
            title="A contact footprint designed for delivery, talent, and support conversations."
            description="Use this page as a starting point whether you need local hiring support, distributed team coverage, or a direct Tekorix conversation."
          />

          <div className="grid gap-4">
            {officeItems.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border bg-[#DCEEFF] px-5 py-5 shadow-[0_18px_44px_-40px_rgba(15,23,42,0.28)]"
                style={{ borderColor: colors.border }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-3 text-base font-medium text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-[2rem] border p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.24)] sm:p-8"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surfaceAlt,
          }}
        >
          <div
            className="flex min-h-[320px] items-center justify-center rounded-[1.5rem] border border-dashed text-center"
            style={{ borderColor: colors.primary }}
          >
            <div className="max-w-sm space-y-3 px-6">
              <p
                className="text-sm font-semibold uppercase tracking-[0.22em]"
                style={{ color: colors.primary }}
              >
                {publicOfficeContent.mapPlaceholderEyebrow}
              </p>
              <h3 className="font-display text-2xl font-semibold text-slate-950">
                {publicOfficeContent.mapPlaceholderTitle}
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                {publicOfficeContent.mapPlaceholderDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

