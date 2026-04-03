"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type TabsPillItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  items: string[];
};

type TabsPillsProps = {
  tabs: TabsPillItem[];
};

export function TabsPills({ tabs }: TabsPillsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeId) ?? tabs[0],
    [tabs, activeId],
  );

  if (!tabs.length || !activeTab) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex min-w-full gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-[0_16px_34px_-28px_rgba(15,23,42,0.14)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium tracking-[0.01em] transition",
                tab.id === activeTab.id
                  ? "border-[#BFDBFE] bg-[#EFF6FF] text-slate-950"
                  : "border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-950",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_-44px_rgba(15,23,42,0.22)] sm:p-8">
        <h3 className="type-h3">{activeTab.title}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {activeTab.description}
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {activeTab.items.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
