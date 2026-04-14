import { cn } from "@/lib/utils";

type HomeSectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
};

export function HomeSectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "light",
  className,
}: HomeSectionHeadingProps) {
  const isDark = theme === "dark";
  const alignmentClasses = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl";

  return (
    <div className={cn("space-y-4", alignmentClasses, className)}>
      {eyebrow ? (
        <p
          className={cn(
            "text-sm font-semibold uppercase tracking-[0.24em]",
            isDark ? "text-[#378FDD]" : "text-[#1B66B3]",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-3">
        <h2
          className={cn(
            "font-display text-[clamp(1.95rem,1.55rem+1.1vw,2.65rem)] font-semibold leading-tight text-slate-900",
            isDark && "text-white",
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "text-base leading-relaxed text-slate-600 md:text-[1.02rem]",
            isDark && "text-slate-300",
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
