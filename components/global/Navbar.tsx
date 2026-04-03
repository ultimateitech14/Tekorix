"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/global/BrandLogo";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/lib/constants/navigation";
import { themeTokens } from "@/lib/theme/tokens";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { colors } = themeTokens;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function isActivePath(href: string) {
    if (!pathname) {
      return false;
    }

    if (href === "/find-job") {
      return pathname === "/find-job" || pathname.startsWith("/careers");
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b shadow-[0_18px_42px_-32px_rgba(62,127,193,0.22)] backdrop-blur-xl"
      style={{
        background:
          "linear-gradient(180deg, rgba(248,251,255,0.96) 0%, rgba(238,245,255,0.94) 100%)",
        borderColor: colors.border,
      }}
    >
      <div className="site-container flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="inline-flex shrink-0 items-center transition-opacity hover:opacity-95"
        >
          <BrandLogo priority className="h-12 sm:h-[3.35rem]" />
        </Link>

        <nav className="hidden flex-1 items-center justify-end gap-0.5 xl:flex">
          {navigationItems.map((item) => {
            const isActive = isActivePath(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-[13px] font-medium transition-colors 2xl:px-3.5 2xl:text-sm",
                  isActive ? "text-slate-950" : "text-slate-600 hover:bg-white/70 hover:text-slate-950",
                )}
                style={
                  isActive
                    ? {
                        backgroundColor: colors.surfaceMuted,
                        boxShadow: "0 14px 28px -22px rgba(62,127,193,0.4)",
                        border: `1px solid ${colors.border}`,
                      }
                    : undefined
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="bg-white/90 text-slate-900 hover:bg-white hover:text-slate-950 xl:hidden"
          style={{ borderColor: colors.border }}
          onClick={() => setMobileOpen((current) => !current)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {mobileOpen ? (
        <div
          className="border-t xl:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(248,251,255,0.98) 0%, rgba(238,245,255,0.98) 100%)",
            borderColor: colors.border,
          }}
        >
          <div className="site-container py-4">
            <nav className="grid gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  aria-current={isActivePath(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    isActivePath(item.href)
                      ? "text-slate-950"
                      : "text-slate-600 hover:bg-white/80 hover:text-slate-950",
                  )}
                  style={
                    isActivePath(item.href)
                      ? {
                          backgroundColor: colors.surfaceMuted,
                          border: `1px solid ${colors.border}`,
                        }
                      : undefined
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
