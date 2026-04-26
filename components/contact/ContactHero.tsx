"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { themeTokens } from "@/lib/theme/tokens";

export function ContactHero() {
  const { colors } = themeTokens;
  const [activeInquiry, setActiveInquiry] = useState<"company" | "candidate">("company");

  useEffect(() => {
    const updateActiveInquiry = () => {
      setActiveInquiry(window.location.hash === "#candidate-inquiry" ? "candidate" : "company");
    };

    updateActiveInquiry();
    window.addEventListener("hashchange", updateActiveInquiry);

    return () => {
      window.removeEventListener("hashchange", updateActiveInquiry);
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-b" style={{ backgroundColor: colors.page, borderColor: colors.border }}>
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(238,246,255,0.96) 0%, rgba(211,232,255,0.98) 100%)",
        }}
      />
      <div
        className="absolute -left-10 top-10 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(37,99,235,0.12)" }}
      />
      <div
        className="absolute right-0 top-0 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(96,165,250,0.18)" }}
      />

      <div className="site-container relative public-hero-space">
        <div className="max-w-4xl public-stack">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.26em]" style={{ color: colors.primary }}>
              Contact
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Let&apos;s build something together.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Reach Tekorix for team-building, specialist hiring, career conversations, and direct delivery
              support. Use the path that matches what you need next.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className={activeInquiry === "company"
                ? "border-0 text-white shadow-[0_20px_40px_-22px_rgba(37,99,235,0.7)] hover:opacity-95"
                : "border border-[#BED9F3] bg-[#F8FBFF] text-slate-950 hover:bg-[#E6F1FF] hover:text-slate-950"}
              style={activeInquiry === "company" ? { backgroundColor: colors.primary } : undefined}
            >
              <Link href="#company-inquiry" onClick={() => setActiveInquiry("company")}>
                Company Inquiry
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className={activeInquiry === "candidate"
                ? "border-0 text-white shadow-[0_20px_40px_-22px_rgba(37,99,235,0.7)] hover:opacity-95"
                : "border border-[#BED9F3] bg-[#F8FBFF] text-slate-950 hover:bg-[#E6F1FF] hover:text-slate-950"}
              style={activeInquiry === "candidate" ? { backgroundColor: colors.primary } : undefined}
            >
              <Link href="#candidate-inquiry" onClick={() => setActiveInquiry("candidate")}>
                Candidate Inquiry
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

