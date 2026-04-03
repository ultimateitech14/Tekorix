import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/site/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroCta = {
  label: string;
  href: string;
  variant?: "default" | "outline";
};

type HeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  className?: string;
  children?: ReactNode;
};

export function Hero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
  children,
}: HeroProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-slate-200 py-20 sm:py-24", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,248,255,0.98)_100%)]" />
      <div className="pointer-events-none absolute -left-32 -top-20 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-200/45 blur-3xl" />

      <Container className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="space-y-7">
          {eyebrow ? (
            <p className="type-eyebrow">{eyebrow}</p>
          ) : null}
          <h1 className="type-display max-w-4xl text-balance">
            {title}
          </h1>
          <p className="type-lead max-w-2xl text-muted-foreground">{description}</p>
          {primaryCta || secondaryCta ? (
            <div className="flex flex-wrap gap-3">
              {primaryCta ? (
                <Button
                  asChild
                  size="lg"
                  variant={primaryCta.variant ?? "default"}
                  className="border-0 bg-[#1D4ED8] text-white shadow-[0_20px_40px_-22px_rgba(37,99,235,0.7)] hover:bg-[#1E40AF]"
                >
                  <Link href={primaryCta.href}>{primaryCta.label}</Link>
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button
                  asChild
                  size="lg"
                  variant={secondaryCta.variant ?? "outline"}
                  className="border-slate-300 bg-white text-slate-950 hover:bg-slate-50"
                >
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        {children ? <div>{children}</div> : null}
      </Container>
    </section>
  );
}
