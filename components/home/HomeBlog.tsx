import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";

const blogPosts = [
  {
    category: "Hiring",
    date: "April 2026",
    title: "How high-growth teams reduce hiring friction without slowing delivery.",
    description:
      "A practical look at role clarity, faster screening, and team-building models that keep projects moving.",
    href: "/services#team-building",
  },
  {
    category: "Careers",
    date: "April 2026",
    title: "What strong candidates do before applying for modern engineering roles.",
    description:
      "The preparation patterns that help professionals stand out across product, cloud, data, and AI hiring.",
    href: "/academy#career-acceleration",
  },
  {
    category: "Delivery",
    date: "April 2026",
    title: "Why contract staffing works best when scope and ownership are defined early.",
    description:
      "How companies can use flexible hiring support without creating confusion across teams and timelines.",
    href: "/services#contract-staffing",
  },
];

export function HomeBlog() {
  return (
    <section className="bg-[#CFE3FF] public-section">
      <div className="site-container public-stack">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <HomeSectionHeading
            eyebrow="Blog"
            title="Latest articles, hiring ideas, and career insights."
            description="A clean editorial section for practical content around hiring, delivery teams, and job growth."
            className="max-w-3xl"
          />

          <Link
            href="/search?q=insights"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B66B3]"
          >
            View all articles
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="group rounded-xl border border-[#7FB5EA] bg-[#DCEEFF] p-6 shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-[#B5D5F8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B66B3]">
                  {post.category}
                </span>
                <span className="text-xs font-medium text-slate-600">{post.date}</span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-900">{post.title}</h3>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">{post.description}</p>

              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#1B66B3]">
                Read article
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

