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
          ? "border-[#D4E8FC] bg-[linear-gradient(165deg,#FBFDFF_0%,#F5FAFF_58%,#EEF6FF_100%)]"
          : "border-[#D4E8FC] bg-[linear-gradient(165deg,#FCFEFF_0%,#F7FBFF_100%)]",
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={cn(
                "text-sm tracking-[0.04em] text-slate-500",
                ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
              )}
            >
              {label}
            </p>
            <p
              className={cn(
                "mt-2 text-4xl leading-none text-slate-900",
                ENABLE_ADMIN_LIGHTER_TYPE ? "font-semibold" : "font-bold",
              )}
            >
              {value}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{detail}</p>
          </div>
          <span
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-lg border text-[#1B66B3]",
              ENABLE_ADMIN_UI_REFRESH
                ? "border-[#1B66B3]/25 bg-[#EAF4FF]"
                : "border-[#1B66B3]/30 bg-[#EAF4FF]",
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

