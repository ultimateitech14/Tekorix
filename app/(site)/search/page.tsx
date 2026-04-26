import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

type SearchEntry = {
  title: string;
  description: string;
  href: string;
  category: "Jobs" | "Services" | "Careers" | "About" | "Insights" | "Contact" | "Company";
  keywords: string[];
};

type SearchPageProps = {
  searchParams?: {
    q?: string;
  };
};

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search across jobs, services, careers, insights, and key pages on Tekorix.",
  path: "/search",
  keywords: ["search jobs", "site search", "services search"],
});

const siteSearchIndex: SearchEntry[] = [
  {
    title: "Job Search",
    description: "Browse current openings by keyword, location, and job type.",
    href: "/find-job#published-jobs",
    category: "Jobs",
    keywords: ["jobs", "openings", "vacancy", "apply", "careers", "roles"],
  },
  {
    title: "Careers Overview",
    description: "Explore culture, growth paths, and opportunities at Tekorix.",
    href: "/careers",
    category: "Careers",
    keywords: ["career", "join us", "early careers", "hiring", "opportunities"],
  },
  {
    title: "Services Overview",
    description: "Consulting, solutions, talent, and transformation support.",
    href: "/services",
    category: "Services",
    keywords: ["consulting", "solutions", "talent", "academy", "digital", "cloud"],
  },
  {
    title: "HR Consulting",
    description: "Workforce planning, hiring process design, and people advisory for growing teams.",
    href: "/hr-consulting",
    category: "Services",
    keywords: ["hr", "hiring", "recruitment", "people advisory", "workforce planning"],
  },
  {
    title: "Product Engineering",
    description: "Platform and engineering delivery support for product, cloud, and modernization work.",
    href: "/services/product-engineering",
    category: "Services",
    keywords: ["solutions", "products", "platform", "automation", "engineering"],
  },
  {
    title: "Talent Services",
    description: "Specialized engineering teams and experts for project acceleration.",
    href: "/services/team-building",
    category: "Services",
    keywords: ["talent", "staffing", "experts", "engineers", "team extension"],
  },
  {
    title: "About Tekorix",
    description: "Company story, values, and global delivery model.",
    href: "/about",
    category: "About",
    keywords: ["about", "company", "values", "global", "tekorix"],
  },
  {
    title: "Insights and Articles",
    description: "Ideas, stories, and industry perspectives from our teams.",
    href: "/about",
    category: "Insights",
    keywords: ["insights", "blog", "articles", "thought leadership", "news"],
  },
  {
    title: "Contact Us",
    description: "Start a conversation with the Tekorix team.",
    href: "/contact",
    category: "Contact",
    keywords: ["contact", "reach us", "message", "support", "sales"],
  },
  {
    title: "Home",
    description: "Engineering a smarter future with consulting, solutions, and talent.",
    href: "/",
    category: "Company",
    keywords: ["home", "engineering", "future", "tekorix", "digital"],
  },
];

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function scoreEntry(entry: SearchEntry, tokens: string[]) {
  let score = 0;

  for (const token of tokens) {
    if (!token) {
      continue;
    }

    if (normalizeText(entry.title).includes(token)) {
      score += 4;
    }

    if (normalizeText(entry.description).includes(token)) {
      score += 2;
    }

    if (entry.keywords.some((keyword) => normalizeText(keyword).includes(token))) {
      score += 3;
    }
  }

  return score;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q?.trim() ?? "";
  const normalizedQuery = normalizeText(query);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const ranked = tokens.length
    ? siteSearchIndex
        .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.entry)
    : siteSearchIndex.slice(0, 8);

  const jobSearchLink = query ? `/find-job?search=${encodeURIComponent(query)}#published-jobs` : "/find-job#published-jobs";

  return (
    <>
      <section className="border-b border-[#BED9F3] bg-[#E6F1FF] py-10 sm:py-12">
        <div className="site-container">
          <p className="type-eyebrow">Search</p>
          <h1 className="type-h1 mt-2">Find pages, services, and jobs</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Use one search across the full Tekorix website including jobs, services, careers, insights,
            and contact resources.
          </p>

          <form action="/search" method="get" className="mt-6 max-w-2xl">
            <div className="relative">
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search jobs, services, insights, contact..."
                className="h-11 w-full rounded-lg border border-[#BED9F3] bg-[#F8FBFF] px-4 pr-24 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1B66B3] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 h-8 rounded-md bg-[#1B66B3] px-3 text-xs font-medium text-white transition-colors hover:bg-[#145188]"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-[#E6F1FF] py-8 sm:py-10">
        <div className="site-container space-y-4">
          <article className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-5 shadow-[0_18px_44px_-38px_rgba(15,23,42,0.18)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Badge className="border border-slate-200 bg-transparent text-xs font-medium text-slate-900">
                  Jobs
                </Badge>
                <h2 className="mt-2 text-lg font-medium text-slate-950">Search open roles</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {query
                    ? `See matching jobs for "${query}".`
                    : "See all current openings and apply directly."}
                </p>
              </div>
              <Link
                href={jobSearchLink}
                className="rounded-md border border-[#BED9F3] bg-[#F8FBFF] px-3 py-2 text-sm font-medium text-slate-900 hover:border-[#1B66B3]"
              >
                View jobs
              </Link>
            </div>
          </article>

          {ranked.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {ranked.map((result) => (
                <article
                  key={`${result.href}-${result.title}`}
                  className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-5 shadow-[0_18px_44px_-38px_rgba(15,23,42,0.18)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-medium text-slate-950">{result.title}</h3>
                    <Badge className="border border-slate-200 bg-transparent text-xs font-medium text-slate-500">
                      {result.category}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{result.description}</p>
                  <Link href={result.href} className="mt-4 inline-flex text-sm font-medium text-[#1B66B3] hover:text-[#145188]">
                    Open page
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <article className="rounded-xl border border-[#BED9F3] bg-[#F8FBFF] p-5 shadow-[0_18px_44px_-38px_rgba(15,23,42,0.18)]">
              <h3 className="text-base font-medium text-slate-950">No direct matches found</h3>
              <p className="mt-2 text-sm text-slate-600">
                Try a broader term like consulting, jobs, talent, healthcare, or contact.
              </p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}

