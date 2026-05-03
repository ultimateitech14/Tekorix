import { cn } from "@/lib/utils";

type HomeSectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function HomeSectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "light",
  className,
  titleClassName,
  descriptionClassName,
}: HomeSectionHeadingProps) {
  const isDark = theme === "dark";
  const alignmentClasses = align === "center" ? "mx-auto max-w-[52rem] text-center" : "max-w-[52rem]";

  return (
    <div className={cn("space-y-4 sm:space-y-5", alignmentClasses, className)}>
      {eyebrow ? (
        <p
          className={cn(
            "inline-flex w-fit items-center rounded-full bg-[#EDF5FF] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1B66B3] sm:px-4 sm:py-1.5 sm:text-sm sm:tracking-[0.18em]",
            align === "center" && "mx-auto",
            isDark && "bg-white/12 text-[#7DB8F1]",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-3.5">
        <h2
          className={cn(
            "text-balance font-display text-[clamp(1.72rem,1.28rem+1.18vw,2.55rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-slate-900",
            isDark && "text-white",
            titleClassName,
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "max-w-2xl text-[0.98rem] leading-relaxed text-slate-600 sm:text-base md:text-[1.02rem]",
            align === "center" && "mx-auto",
            isDark && "text-slate-300",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
