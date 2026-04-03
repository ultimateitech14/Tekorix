"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";

import { adminNavSections, isPathActive } from "@/components/admin/nav-config";
import { BrandLogo } from "@/components/global/BrandLogo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { clearAuthToken } from "@/lib/auth/store";
import { ENABLE_ADMIN_LIGHTER_TYPE, ENABLE_ADMIN_UI_REFRESH } from "@/lib/ui-flags";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

type SidebarNavigationProps = {
  collapsed: boolean;
  pathname: string;
  currentSearch: string;
  onLogout: () => void;
  onNavigate?: () => void;
};

function splitHref(href: string) {
  const [path, query = ""] = href.split("?");
  return { path, query };
}

function hasQuery(href: string) {
  return href.includes("?");
}

function matchesQuery(currentSearch: URLSearchParams, href: string) {
  const { query } = splitHref(href);

  if (!query) {
    return true;
  }

  const expectedParams = new URLSearchParams(query);
  let matches = true;

  expectedParams.forEach((value, key) => {
    if (currentSearch.get(key) !== value) {
      matches = false;
    }
  });

  return matches;
}

function isChildActive(pathname: string, currentSearch: URLSearchParams, href: string, siblingHasQueryMatch: boolean) {
  const { path, query } = splitHref(href);

  if (pathname !== path) {
    return false;
  }

  if (query) {
    return matchesQuery(currentSearch, href);
  }

  return !siblingHasQueryMatch && currentSearch.toString().length === 0;
}

function SidebarNavigation({ collapsed, pathname, currentSearch, onLogout, onNavigate }: SidebarNavigationProps) {
  const currentQuery = useMemo(() => new URLSearchParams(currentSearch), [currentSearch]);
  const activeSectionHref = useMemo(() => {
    const activeSection = adminNavSections.find(
      (section) =>
        section.children.length > 0 &&
        (isPathActive(pathname, section.href) ||
          section.children.some((item) => {
            if (hasQuery(item.href)) {
              return isChildActive(pathname, currentQuery, item.href, true);
            }

            return isPathActive(pathname, item.href);
          })),
    );

    return activeSection?.href ?? null;
  }, [pathname, currentQuery]);
  const [expandedSectionHrefs, setExpandedSectionHrefs] = useState<string[]>(
    activeSectionHref ? [activeSectionHref] : [],
  );
  const [activeExpandedSectionHref, setActiveExpandedSectionHref] = useState<string | null>(activeSectionHref);

  useEffect(() => {
    if (pathname === "/admin") {
      setExpandedSectionHrefs([]);
      setActiveExpandedSectionHref(null);
      return;
    }

    if (!activeSectionHref) {
      return;
    }

    setExpandedSectionHrefs((current) =>
      current.includes(activeSectionHref) ? current : [...current, activeSectionHref],
    );
    setActiveExpandedSectionHref((current) => current ?? activeSectionHref);
  }, [activeSectionHref, pathname]);

  function toggleSection(sectionHref: string) {
    setExpandedSectionHrefs((current) => {
      const isExpanded = current.includes(sectionHref);

      if (isExpanded) {
        const next = current.filter((href) => href !== sectionHref);

        setActiveExpandedSectionHref((activeCurrent) => {
          if (activeCurrent !== sectionHref) {
            return activeCurrent;
          }

          return next[next.length - 1] ?? activeSectionHref ?? null;
        });

        return next;
      }

      setActiveExpandedSectionHref(sectionHref);
      return [...current, sectionHref];
    });
  }

  return (
    <div className="flex h-full flex-col text-slate-100">
      <div className={cn("mb-4 px-2 py-2", collapsed ? "flex justify-center" : "space-y-3")}>
        <Link
          href="/admin"
          onClick={() => onNavigate?.()}
          aria-label="Go to Tekorix admin dashboard"
          className={cn(
            "inline-flex items-center overflow-hidden transition-opacity hover:opacity-95",
            collapsed ? "justify-center" : "w-full",
          )}
        >
          <BrandLogo priority className={collapsed ? "h-10" : "h-14"} />
        </Link>
        {!collapsed ? (
          <div className="px-1">
            <p
              className={cn(
                "text-[0.82rem] tracking-[0.06em] text-amber-200",
                ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
              )}
            >
              TekOrix Admin
            </p>
            <p className="text-[0.8rem] text-slate-400">Hiring control center</p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {adminNavSections.map((section) => {
          const Icon = section.icon;
          const hasChildren = !collapsed && section.children.length > 0;
          const hasQueryChildMatch = section.children.some((item) =>
            hasQuery(item.href) ? isChildActive(pathname, currentQuery, item.href, true) : false,
          );
          const sectionActive =
            isPathActive(pathname, section.href) ||
            section.children.some((item) =>
              isChildActive(pathname, currentQuery, item.href, hasQueryChildMatch),
            );
          const sectionExpanded = expandedSectionHrefs.includes(section.href);
          const sectionExpandedAndActive = activeExpandedSectionHref === section.href;

          return (
            <div key={section.label} className="space-y-1">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleSection(section.href)}
                  aria-expanded={sectionExpanded}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-[0.98rem] transition-colors",
                    sectionExpandedAndActive
                      ? "border-amber-300/50 bg-amber-300/15 text-amber-200"
                      : sectionExpanded || sectionActive
                        ? "border-white/20 bg-white/[0.04] text-slate-100"
                      : "border-transparent text-slate-300 hover:border-white/20 hover:bg-white/5 hover:text-white",
                    ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{section.label}</span>
                  <ChevronDown
                    className={cn(
                      "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
                      sectionExpanded && "rotate-180",
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={section.href}
                  onClick={() => {
                    if (section.href === "/admin") {
                      setExpandedSectionHrefs([]);
                      setActiveExpandedSectionHref(null);
                    }

                    onNavigate?.();
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[0.98rem] transition-colors",
                    sectionActive
                      ? "border-amber-300/50 bg-amber-300/15 text-amber-200"
                      : "border-transparent text-slate-300 hover:border-white/20 hover:bg-white/5 hover:text-white",
                    ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
                    collapsed && "justify-center px-0",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed ? <span>{section.label}</span> : null}
                </Link>
              )}

              {hasChildren && sectionExpanded ? (
                <div className="space-y-1 pl-11">
                  {section.children.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        setActiveExpandedSectionHref(section.href);
                        onNavigate?.();
                      }}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-[0.86rem] transition-colors",
                        isChildActive(pathname, currentQuery, item.href, hasQueryChildMatch)
                          ? "bg-amber-200/10 text-amber-100"
                          : "text-slate-400 hover:text-slate-200",
                        ENABLE_ADMIN_LIGHTER_TYPE ? "font-normal" : "font-medium",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
        <div
          className={cn(
            "rounded-xl border p-3",
            ENABLE_ADMIN_UI_REFRESH ? "border-white/[0.12] bg-white/[0.06]" : "border-white/10 bg-white/5",
            collapsed && "flex justify-center px-1.5 py-2.5",
          )}
        >
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <UserCircle2 className="h-8 w-8 text-amber-200" />
            {!collapsed ? (
              <div>
                <p className={cn("text-sm text-white", ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold")}>
                  TekOrix Admin
                </p>
                <p className="text-xs text-slate-400">admin@tekorix.com</p>
              </div>
            ) : null}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start border-amber-300/40 bg-amber-300/5 text-amber-100 hover:border-amber-200/60 hover:bg-amber-300/15",
            ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
            collapsed && "justify-center px-0",
          )}
          onClick={() => {
            onNavigate?.();
            onLogout();
          }}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed ? "Logout" : null}
        </Button>
      </div>
    </div>
  );
}

export function Sidebar({ collapsed, mobileOpen, onMobileOpenChange }: SidebarProps) {
  const pathname = usePathname() ?? "/admin";
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentSearch = searchParams?.toString() ?? "";

  function handleLogout() {
    clearAuthToken();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r p-3 backdrop-blur-xl lg:block",
          ENABLE_ADMIN_UI_REFRESH ? "border-white/[0.12] bg-[#081528]/90" : "border-white/10 bg-[#081528]/80",
          collapsed ? "w-24" : "w-72",
        )}
      >
        <SidebarNavigation
          collapsed={collapsed}
          pathname={pathname}
          currentSearch={currentSearch}
          onLogout={handleLogout}
        />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          className={cn(
            "w-[88vw] border-r p-3 text-white sm:max-w-sm",
            ENABLE_ADMIN_UI_REFRESH ? "border-white/[0.12] bg-[#081528]/[0.96]" : "border-white/10 bg-[#081528]",
          )}
        >
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          <SidebarNavigation
            collapsed={false}
            pathname={pathname}
            currentSearch={currentSearch}
            onLogout={handleLogout}
            onNavigate={() => onMobileOpenChange(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
