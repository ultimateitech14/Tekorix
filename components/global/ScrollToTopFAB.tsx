"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollToTopFAB() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 420);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function handleScrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={handleScrollTop}
      className={`fixed bottom-[calc(env(safe-area-inset-bottom)+7rem)] right-6 z-30 hidden h-16 w-16 items-center justify-center rounded-full border border-[#BED9F3] bg-[#F8FBFF]/96 text-[#145188] shadow-[0_16px_36px_-26px_rgba(20,81,136,0.35)] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white xl:flex ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span className="flex flex-col items-center gap-0.5 leading-none">
        <ChevronUp className="h-4 w-4" />
        <span className="text-[0.9rem] font-medium">Top</span>
      </span>
    </button>
  );
}
