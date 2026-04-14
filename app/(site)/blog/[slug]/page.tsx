import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { blogPosts, getBlogPostBySlug } from "@/lib/constants/blog-posts";
import { buildMetadata } from "@/lib/seo";

type BlogDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogDetailPageProps): Metadata {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return buildMetadata({
      title: "Blog Article",
      description: "Read practical insights from Tekorix.",
      path: "/blog",
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: [post.category.toLowerCase(), "tekorix blog", "hiring", "delivery"],
  });
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-[#E6F1FF] public-section">
      <div className="site-container public-stack">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B66B3]">
          <ArrowLeft className="h-4 w-4" />
          Back to all articles
        </Link>

        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#EDF5FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B66B3]">
              {post.category}
            </span>
            <span className="text-sm text-slate-600">{post.date}</span>
            <span className="text-sm text-slate-600">|</span>
            <span className="text-sm text-slate-600">{post.readTime}</span>
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            {post.title}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            {post.description}
          </p>
        </header>

        <div className="relative h-[18rem] overflow-hidden rounded-2xl bg-[#F8FBFF] sm:h-[24rem] lg:h-[30rem]">
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            priority
            sizes="(min-width: 1024px) 80vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-8 rounded-2xl bg-[#F8FBFF] p-6 md:p-8">
          <p className="text-base leading-8 text-slate-700 md:text-lg">{post.intro}</p>

          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="text-2xl font-semibold leading-tight text-slate-900">{section.heading}</h2>

              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-slate-700">
                  {paragraph}
                </p>
              ))}

              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-6 text-base leading-8 text-slate-700">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
