"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { themeTokens } from "@/lib/theme/tokens";

const ANY_LOCATION = "All locations";

const locationOptions = [
  ANY_LOCATION,
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "Singapore",
  "Remote",
];

function normalizeLocation(value: string) {
  return locationOptions.includes(value) ? value : ANY_LOCATION;
}

type JobSearchPanelProps = {
  basePath?: string;
};

export function JobSearchPanel({ basePath = "/careers/job-results" }: JobSearchPanelProps) {
  const { colors } = themeTokens;
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchFromUrl = searchParams?.get("search")?.trim() ?? "";
  const locationFromUrl = normalizeLocation(searchParams?.get("location")?.trim() ?? ANY_LOCATION);

  const [keyword, setKeyword] = useState(searchFromUrl);
  const [location, setLocation] = useState(locationFromUrl);

  useEffect(() => {
    setKeyword(searchFromUrl);
    setLocation(locationFromUrl);
  }, [searchFromUrl, locationFromUrl]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = keyword.trim();
    const params = new URLSearchParams();

    if (query) {
      params.set("search", query);
    }

    if (location !== ANY_LOCATION) {
      params.set("location", location);
    }

    const nextQuery = params.toString();
    router.push(nextQuery ? `${basePath}?${nextQuery}` : basePath);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border bg-[#E4F1FF] p-3 sm:p-4 md:grid-cols-[200px_1fr_auto]"
      style={{ borderColor: colors.border }}
    >
      <label className="sr-only" htmlFor="job-search-location">
        Location
      </label>
      <select
        id="job-search-location"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        className="h-12 rounded-xl border bg-white px-4 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
        style={{ borderColor: colors.border }}
      >
        {locationOptions.map((option) => (
          <option key={option} value={option} className="bg-white text-slate-900">
            {option}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="job-search-keyword">
        Search by job name
      </label>
      <Input
        id="job-search-keyword"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="Search by job name"
        className="h-12 rounded-xl border bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 transition hover:border-slate-300 focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/20"
        style={{ borderColor: colors.border }}
      />

      <Button
        type="submit"
        className="h-11 border-0 px-6 text-white shadow-[0_18px_36px_-20px_rgba(37,99,235,0.6)] hover:opacity-95"
        style={{ backgroundColor: colors.primary }}
      >
        <Search className="h-4 w-4" />
        Search jobs
      </Button>
    </form>
  );
}
