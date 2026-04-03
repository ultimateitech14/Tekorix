import { themeTokens } from "@/lib/theme/tokens";

const stats = [
  { value: "48+", label: "Global hubs" },
  { value: "3.2K+", label: "Specialists deployed" },
  { value: "97%", label: "Renewal rate" },
  { value: "24/7", label: "Programme coverage" },
];

export function HomeStats() {
  const { colors } = themeTokens;

  return (
    <section
      className="border-y"
      style={{
        backgroundColor: colors.surfaceAlt,
        borderColor: colors.border,
      }}
    >
      <div className="site-container grid gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-[1.5rem] border px-5 py-5 text-center shadow-[0_20px_40px_-34px_rgba(62,127,193,0.14)] lg:text-left"
            style={{ borderColor: colors.border, backgroundColor: colors.surfaceCard }}
          >
            <p className="text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: colors.accent }}>
              {item.value}
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-600">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
