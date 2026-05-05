import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { listPublicBlogPosts } from "@/lib/api/blog-posts";
import { resolveAssetUrl } from "@/lib/asset-url";
import { blogPosts as fallbackBlogPosts } from "@/lib/constants/blog-posts";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog and Hiring Insights",
  description:
    "Explore practical articles on hiring, staffing, candidate preparation, and delivery operations from Tekorix.",
  path: "/blog",
  keywords: ["blog", "hiring insights", "staffing", "candidate preparation", "delivery operations"],
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogIndexPage() {
  const posts = await listPublicBlogPosts().catch(() => fallbackBlogPosts);

  return (
    <section className="bg-[#E6F1FF] public-section">
      <div className="site-container public-stack">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B66B3]">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <HomeSectionHeading
          eyebrow="Blog"
          title="Latest articles, hiring ideas, and career insights."
          description="A practical editorial stream for hiring leaders, delivery teams, and professionals navigating modern careers."
          className="max-w-4xl"
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex min-h-[26rem] flex-col overflow-hidden rounded-xl bg-[#F8FBFF] shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="relative h-48">
                <Image src={resolveAssetUrl(post.coverImage)} alt={post.coverAlt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" unoptimized />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#EDF5FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B66B3]">
                    {post.category}
                  </span>
                  <span className="text-xs font-medium text-slate-600">{post.date}</span>
                </div>

                <h3 className="mt-5 text-xl font-semibold leading-snug text-slate-900">{post.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{post.description}</p>

                <div className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1B66B3]">
                  Read article
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
