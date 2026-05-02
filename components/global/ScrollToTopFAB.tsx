"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollToTopFAB() {
  const [isVisible, setIsVisible] = useState(false);
  const [isQuickContactOpen, setIsQuickContactOpen] = useState(false);

  useEffect(() => {
    const getScrollThreshold = () => {
      const firstSection = document.querySelector("main > section");

      if (!(firstSection instanceof HTMLElement)) {
        return Math.max(220, Math.min(window.innerHeight * 0.55, 560));
      }

      return Math.max(220, firstSection.offsetHeight - Math.min(72, window.innerHeight * 0.08));
    };

    const onScroll = () => {
      setIsVisible(window.scrollY > getScrollThreshold());
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const handleQuickContactToggle = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;

      setIsQuickContactOpen(Boolean(detail?.open));
    };

    window.addEventListener("tekorix:quick-contact-toggle", handleQuickContactToggle as EventListener);

    return () => {
      window.removeEventListener("tekorix:quick-contact-toggle", handleQuickContactToggle as EventListener);
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
      className={`fixed bottom-[calc(env(safe-area-inset-bottom)+3.95rem)] z-30 flex h-12 w-12 items-center justify-center rounded-full border border-[#BED9F3] bg-[#F8FBFF]/96 text-[#145188] shadow-[0_16px_36px_-26px_rgba(20,81,136,0.35)] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B66B3]/30 sm:bottom-[calc(env(safe-area-inset-bottom)+4.35rem)] sm:h-14 sm:w-14 xl:bottom-[calc(env(safe-area-inset-bottom)+7rem)] xl:h-16 xl:w-16 ${
        isQuickContactOpen
          ? "left-2.5 right-auto sm:left-3.5 sm:right-auto xl:left-6 xl:right-auto"
          : "right-2.5 left-auto sm:right-3.5 sm:left-auto xl:right-6 xl:left-auto"
      } ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span className="flex flex-col items-center gap-0.5 leading-none">
        <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="text-[0.72rem] font-medium sm:text-[0.82rem] xl:text-[0.9rem]">Top</span>
      </span>
    </button>
  );
}
