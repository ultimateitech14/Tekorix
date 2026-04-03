import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ENABLE_ADMIN_LIGHTER_TYPE, ENABLE_ADMIN_UI_REFRESH } from "@/lib/ui-flags";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <Card
      className={cn(
        "backdrop-blur-xl",
        ENABLE_ADMIN_UI_REFRESH
          ? "border-white/[0.12] bg-[linear-gradient(140deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]"
          : "border-white/10 bg-white/5",
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={cn(
                "text-[0.8rem] tracking-[0.04em] text-slate-400",
                ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
              )}
            >
              {label}
            </p>
            <p
              className={cn(
                "mt-2 text-[2rem] leading-none text-white",
                ENABLE_ADMIN_LIGHTER_TYPE ? "font-semibold" : "font-bold",
              )}
            >
              {value}
            </p>
            <p className="mt-1 text-[0.84rem] leading-relaxed text-slate-400">{detail}</p>
          </div>
          <span
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-lg border text-amber-200",
              ENABLE_ADMIN_UI_REFRESH
                ? "border-amber-300/35 bg-amber-300/[0.12]"
                : "border-amber-300/40 bg-amber-300/15",
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
