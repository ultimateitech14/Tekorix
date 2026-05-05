import { CheckCircle2 } from "lucide-react";

import { themeTokens } from "@/lib/theme/tokens";

const trustItems = [
  "Fast deployment routes",
  "On-roll consultants",
  "Compliance and HR handled",
  "Flexible scale-up or scale-down",
  "Long-term delivery support",
];

export function FindTalentTrustStrip() {
  const { colors } = themeTokens;

  return (
    <section className="bg-[#F8FBFF] py-4 sm:py-5">
      <div className="site-container">
        <div
          className="rounded-[1.75rem] border p-4 sm:p-5"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surfaceAlt,
          }}
        >
          <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
            {trustItems.map((item) => (
              <div
                key={item}
                className="flex min-h-[50px] items-center justify-center gap-2 rounded-full border bg-[#F8FBFF] px-4 py-3 text-center text-sm font-medium text-slate-700"
                style={{ borderColor: colors.border }}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1B66B3]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

