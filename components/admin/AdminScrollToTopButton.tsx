"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getScrollThreshold = () => Math.max(180, Math.min(window.innerHeight * 0.3, 320));

    const handleScroll = () => {
      setIsVisible(window.scrollY > getScrollThreshold());
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
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
      className={`fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-3 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-[#BFD9F7] bg-[#EAF4FF]/96 text-[#145188] shadow-[0_16px_36px_-26px_rgba(20,81,136,0.35)] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B66B3]/30 sm:bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] sm:right-4 sm:h-16 sm:w-16 lg:right-6 ${
        isVisible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span className="flex flex-col items-center gap-0.5 leading-none">
        <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="text-[0.72rem] font-medium sm:text-[0.8rem]">Top</span>
      </span>
    </button>
  );
}
