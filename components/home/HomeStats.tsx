const stats = [
  { value: "48+", label: "Global hubs" },
  { value: "3.2K+", label: "Specialists deployed" },
  { value: "97%", label: "Renewal rate" },
  { value: "24/7", label: "Programme coverage" },
];

export function HomeStats() {
  return (
    <section className="border-y border-[#BED9F3] bg-[#E6F1FF]">
      <div className="site-container grid gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] px-5 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#9CC6F1] hover:bg-white hover:shadow-[0_24px_56px_-42px_rgba(27,102,179,0.24)] lg:text-left"
          >
            <p className="text-3xl font-semibold tracking-tight text-[#378FDD] sm:text-4xl">
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
