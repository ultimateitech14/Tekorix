"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { blogPosts } from "@/lib/constants/blog-posts";
import { cn } from "@/lib/utils";

export function HomeBlog() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const node = trackRef.current;

    if (!node) {
      return;
    }

    const updateScrollState = () => {
      setCanScrollLeft(node.scrollLeft > 8);
      setCanScrollRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 8);
    };

    updateScrollState();
    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  function scrollCards(direction: -1 | 1) {
    const node = trackRef.current;

    if (!node) {
      return;
    }

    const amount = Math.round(node.clientWidth * 0.82) * direction;
    node.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className="bg-[#E6F1FF] public-section">
      <div className="site-container public-stack">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <HomeSectionHeading
            eyebrow="Blog"
            title="Latest articles, hiring ideas, and career insights."
            description="Stay informed with expert perspectives, industry trends, and practical knowledge."
            className="max-w-3xl"
          />

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B66B3]"
          >
            View all articles
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Scroll blog cards left"
            onClick={() => scrollCards(-1)}
            disabled={!canScrollLeft}
            className={cn(
              "absolute left-1 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#BED9F3] bg-[#F8FBFF]/95 text-[#1B66B3] shadow-sm backdrop-blur transition",
              canScrollLeft ? "opacity-100 hover:bg-[#EDF5FF]" : "pointer-events-none opacity-35",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={trackRef}
            className="flex touch-auto snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 pl-0.5 pr-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex min-h-[27.5rem] w-[min(88vw,22rem)] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-[#F8FBFF] shadow-sm transition-transform hover:-translate-y-1 md:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
              >
                <div className="relative h-52">
                  <Image
                    src={post.coverImage}
                    alt={post.coverAlt}
                    fill
                    sizes="(min-width: 768px) 24rem, 88vw"
                    className="object-cover"
                  />
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

          <button
            type="button"
            aria-label="Scroll blog cards right"
            onClick={() => scrollCards(1)}
            disabled={!canScrollRight}
            className={cn(
              "absolute right-1 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#BED9F3] bg-[#F8FBFF]/95 text-[#1B66B3] shadow-sm backdrop-blur transition",
              canScrollRight ? "opacity-100 hover:bg-[#EDF5FF]" : "pointer-events-none opacity-35",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

