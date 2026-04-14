import { Badge } from "@/components/ui/badge";
import { ENABLE_ADMIN_LIGHTER_TYPE } from "@/lib/ui-flags";
import { cn } from "@/lib/utils";

type StatusChipProps = {
  status: string;
};

const tones: Record<string, string> = {
  published: "border-emerald-300/40 bg-emerald-300/15 text-emerald-700",
  draft: "border-slate-300/35 bg-slate-300/10 text-slate-700",
  closed: "border-rose-300/35 bg-rose-300/10 text-rose-700",
  shortlisted: "border-amber-300/45 bg-amber-300/18 text-amber-700",
  "pending review": "border-blue-300/40 bg-blue-300/15 text-blue-700",
  rejected: "border-rose-300/45 bg-rose-300/15 text-rose-700",
  reviewed: "border-cyan-300/40 bg-cyan-300/15 text-cyan-700",
  interview: "border-violet-300/40 bg-violet-300/15 text-violet-700",
  active: "border-emerald-300/40 bg-emerald-300/15 text-emerald-700",
  paused: "border-amber-300/45 bg-amber-300/18 text-amber-700",
};

export function StatusChip({ status }: StatusChipProps) {
  const key = status.toLowerCase();

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs tracking-[0.03em]",
        ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
        tones[key] ?? "border-slate-300/30 bg-slate-300/10 text-slate-900",
      )}
    >
      {status}
    </Badge>
  );
}


