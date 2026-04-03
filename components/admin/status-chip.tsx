import { Badge } from "@/components/ui/badge";
import { ENABLE_ADMIN_LIGHTER_TYPE } from "@/lib/ui-flags";
import { cn } from "@/lib/utils";

type StatusChipProps = {
  status: string;
};

const tones: Record<string, string> = {
  published: "border-emerald-300/40 bg-emerald-300/15 text-emerald-100",
  draft: "border-slate-300/35 bg-slate-300/10 text-slate-200",
  closed: "border-rose-300/35 bg-rose-300/10 text-rose-100",
  shortlisted: "border-amber-300/45 bg-amber-300/18 text-amber-100",
  "pending review": "border-blue-300/40 bg-blue-300/15 text-blue-100",
  rejected: "border-rose-300/45 bg-rose-300/15 text-rose-100",
  reviewed: "border-cyan-300/40 bg-cyan-300/15 text-cyan-100",
  interview: "border-violet-300/40 bg-violet-300/15 text-violet-100",
  active: "border-emerald-300/40 bg-emerald-300/15 text-emerald-100",
  paused: "border-amber-300/45 bg-amber-300/18 text-amber-100",
};

export function StatusChip({ status }: StatusChipProps) {
  const key = status.toLowerCase();

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] tracking-[0.03em]",
        ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
        tones[key] ?? "border-slate-300/30 bg-slate-300/10 text-slate-100",
      )}
    >
      {status}
    </Badge>
  );
}
