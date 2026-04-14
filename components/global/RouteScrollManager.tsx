"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HASH_SCROLL_RETRY_DELAY_MS = 120;

function scrollToHashTarget(hash: string): boolean {
  const id = decodeURIComponent(hash.replace(/^#/, ""));

  if (!id) {
    return false;
  }

  const element = document.getElementById(id);

  if (!element) {
    return false;
  }

  element.scrollIntoView({ block: "start" });
  return true;
}

export function RouteScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    let timeoutId: number | undefined;

    const applyRouteScroll = () => {
      const { hash } = window.location;

      if (!hash) {
        window.scrollTo(0, 0);
        return;
      }

      if (scrollToHashTarget(hash)) {
        return;
      }

      timeoutId = window.setTimeout(() => {
        if (!scrollToHashTarget(hash)) {
          window.scrollTo(0, 0);
        }
      }, HASH_SCROLL_RETRY_DELAY_MS);
    };

    const frameId = window.requestAnimationFrame(applyRouteScroll);

    return () => {
      window.cancelAnimationFrame(frameId);
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [pathname]);

  useEffect(() => {
    let timeoutId: number | undefined;

    const handleHashChange = () => {
      const { hash } = window.location;

      if (!hash) {
        window.scrollTo(0, 0);
        return;
      }

      if (scrollToHashTarget(hash)) {
        return;
      }

      timeoutId = window.setTimeout(() => {
        scrollToHashTarget(hash);
      }, HASH_SCROLL_RETRY_DELAY_MS);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return null;
}
