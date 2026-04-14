import Link from "next/link";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LinkCardProps = {
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
  className?: string;
};

export function LinkCard({
  title,
  description,
  href,
  ctaLabel = "Learn more",
  className,
}: LinkCardProps) {
  return (
    <Card
      className={cn(
        "group rounded-[1.5rem] border border-slate-200 bg-[#F8FBFF] shadow-[0_22px_55px_-44px_rgba(15,23,42,0.22)]",
        className,
      )}
    >
      <CardContent className="space-y-4 p-6">
        <CardTitle className="type-h3">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed text-slate-600">
          {description}
        </CardDescription>
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.01em] text-[#1B66B3] transition-transform duration-200 group-hover:translate-x-1"
        >
          {ctaLabel}
          <span aria-hidden>-&gt;</span>
        </Link>
      </CardContent>
    </Card>
  );
}

