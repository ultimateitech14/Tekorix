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
    <div className="flex h-full flex-col text-slate-900">
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
                "text-sm tracking-[0.06em] text-[#1B66B3]",
                ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
              )}
            >
              TekOrix Admin
            </p>
            <p className="text-sm text-slate-500">Hiring control center</p>
          </div>
        ) : null}
      </div>

      <nav className="admin-scrollbar flex-1 space-y-1.5 overflow-y-auto pr-1">
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
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-base transition-colors",
                    sectionExpandedAndActive
                      ? "border-[#1B66B3]/35 bg-[#EAF4FF] text-[#1B66B3]"
                      : sectionExpanded || sectionActive
                        ? "border-[#C3DDF9] bg-[#F4F9FF] text-slate-900"
                      : "border-transparent text-slate-600 hover:border-[#C3DDF9] hover:bg-[#F8FBFF] hover:text-slate-900",
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
                    "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-base transition-colors",
                    sectionActive
                      ? "border-[#1B66B3]/35 bg-[#EAF4FF] text-[#1B66B3]"
                      : "border-transparent text-slate-600 hover:border-[#C3DDF9] hover:bg-[#F8FBFF] hover:text-slate-900",
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
                        "block rounded-md px-2 py-1.5 text-sm transition-colors",
                        isChildActive(pathname, currentQuery, item.href, hasQueryChildMatch)
                          ? "bg-[#EAF4FF] text-[#1B66B3]"
                          : "text-slate-500 hover:text-slate-700",
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

      <div className="mt-4 space-y-3 border-t border-[#D4E8FC] pt-4">
        <Link
          href="/admin/profile"
          onClick={() => onNavigate?.()}
          className={cn(
            "block rounded-xl border p-3 transition-colors",
            pathname === "/admin/profile"
              ? "border-[#1B66B3]/35 bg-[#EAF4FF]"
              : ENABLE_ADMIN_UI_REFRESH
                ? "border-[#D4E8FC] bg-[#F1F7FF] hover:border-[#C3DDF9] hover:bg-[#EAF4FF]"
                : "border-[#D4E8FC] bg-[#F8FBFF] hover:border-[#C3DDF9] hover:bg-[#EAF4FF]",
            collapsed && "flex justify-center px-1.5 py-2.5",
          )}
        >
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <UserCircle2 className="h-8 w-8 text-[#1B66B3]" />
            {!collapsed ? (
              <div>
                <p className={cn("text-sm text-slate-900", ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold")}>
                  TekOrix Admin
                </p>
                <p className="text-xs text-slate-500">admin@tekorix.com</p>
                <p className="mt-1 text-xs text-[#1B66B3]">View profile</p>
              </div>
            ) : null}
          </div>
        </Link>

        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start border-[#1B66B3]/35 bg-[#EAF4FF] text-[#1B66B3] hover:border-[#145188]/50 hover:bg-[#DFEEFF]",
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
          ENABLE_ADMIN_UI_REFRESH ? "border-[#D4E8FC] bg-[#F8FBFF]/90" : "border-[#D4E8FC] bg-[#F8FBFF]/80",
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
            "w-[88vw] border-r p-3 text-slate-900 sm:max-w-sm",
            ENABLE_ADMIN_UI_REFRESH ? "border-[#D4E8FC] bg-[#F8FBFF]/[0.96]" : "border-[#D4E8FC] bg-[#F8FBFF]",
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

