import { themeTokens } from "@/lib/theme/tokens";
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
  const { colors } = themeTokens;

  return (
    <div className={cn("space-y-4", alignmentClasses, className)}>
      {eyebrow ? (
        <p
          className={cn(
            "text-sm font-semibold uppercase tracking-[0.24em]",
            isDark ? "text-slate-200" : "text-slate-700",
          )}
          style={{ color: isDark ? colors.accent : colors.primary }}
        >
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-3">
        <h2
          className={cn(
            "font-display text-3xl font-semibold tracking-tight sm:text-4xl",
            isDark ? "text-white" : "text-slate-950",
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "text-base leading-7 sm:text-lg",
            isDark ? "text-slate-300" : "text-slate-600",
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
