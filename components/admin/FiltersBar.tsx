"use client";

import { Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterOption = {
  label: string;
  value: string;
};

type FilterConfig = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

type FiltersBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: FilterConfig[];
  extra?: React.ReactNode;
};

export function FiltersBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  extra,
}: FiltersBarProps) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(220px,1fr)_auto]">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                className="border-white/15 bg-white/5 pl-9 text-slate-100 placeholder:text-slate-400 focus-visible:ring-amber-300/60"
              />
            </div>

            {filters.map((filter) => (
              <Select key={filter.label} value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger className="border-white/15 bg-white/5 text-slate-100 focus:ring-amber-300/60">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0f1e32] text-slate-100">
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="focus:bg-white/10">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>

          {extra ? <div className="flex flex-wrap items-center justify-start gap-2 xl:justify-end">{extra}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
}
