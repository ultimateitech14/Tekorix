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
    <section className="bg-white py-6 sm:py-8">
      <div className="site-container">
        <div
          className="grid gap-3 rounded-[1.75rem] border p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-5"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surfaceAlt,
          }}
        >
          {trustItems.map((item) => (
            <div
              key={item}
              className="rounded-2xl border bg-white px-4 py-4 text-sm font-medium text-slate-700"
              style={{ borderColor: colors.border }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
