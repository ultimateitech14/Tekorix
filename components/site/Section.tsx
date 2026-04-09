import type { ReactNode } from "react";

import { Container } from "@/components/site/Container";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  className?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function Section({
  id,
  className,
  eyebrow,
  title,
  description,
  actions,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("section-space", className)}>
      <Container>
        {eyebrow || title || description || actions ? (
          <header className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              {eyebrow ? (
                <p className="type-eyebrow">{eyebrow}</p>
              ) : null}
              {title ? (
                <h2 className="type-h2 text-balance">
                  {title}
                </h2>
              ) : null}
              {description ? <p className="type-body text-muted-foreground">{description}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
          </header>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
