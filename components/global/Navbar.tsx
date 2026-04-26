"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/global/BrandLogo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpenMenu, setDesktopOpenMenu] = useState<string | null>(null);
  const [mobileOpenMenu, setMobileOpenMenu] = useState<string | null>(null);
  const desktopMenuCloseTimeoutRef = useRef<number | null>(null);
  const hasDesktopOpenMenu = desktopOpenMenu !== null;

  function clearDesktopMenuCloseTimeout() {
    if (desktopMenuCloseTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(desktopMenuCloseTimeoutRef.current);
    desktopMenuCloseTimeoutRef.current = null;
  }

  function openDesktopMenu(href: string) {
    clearDesktopMenuCloseTimeout();
    setDesktopOpenMenu(href);
  }

  function closeDesktopMenu(href: string) {
    clearDesktopMenuCloseTimeout();
    setDesktopOpenMenu((current) => (current === href ? null : current));
  }

  function scheduleDesktopMenuClose(href: string) {
    clearDesktopMenuCloseTimeout();
    desktopMenuCloseTimeoutRef.current = window.setTimeout(() => {
      setDesktopOpenMenu((current) => (current === href ? null : current));
      desktopMenuCloseTimeoutRef.current = null;
    }, 120);
  }

  useEffect(() => {
    clearDesktopMenuCloseTimeout();
    setMobileOpen(false);
    setDesktopOpenMenu(null);
    setMobileOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    return () => {
      clearDesktopMenuCloseTimeout();
    };
  }, []);

  function isActivePath(href: string) {
    if (!pathname) {
      return false;
    }

    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMobileMenu() {
    setMobileOpen(false);
    setMobileOpenMenu(null);
  }

  function scrollToTopIfSameRoute(href: string) {
    const [targetPathWithQuery] = href.split("#");
    const targetPath = targetPathWithQuery.split("?")[0];

    if (pathname === targetPath) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white/95 shadow-[0_18px_42px_-32px_rgba(15,23,42,0.28)] backdrop-blur-xl">
      <div className="site-container flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="inline-flex shrink-0 items-center transition-opacity hover:opacity-95"
        >
          <BrandLogo priority className="h-12 sm:h-[3.35rem]" />
        </Link>

        <nav className="hidden flex-1 items-center justify-end gap-2 lg:flex">
          {navigationItems.map((item) => {
            const isActive = isActivePath(item.href);
            const isOpen = desktopOpenMenu === item.href;
            const isDesktopHighlighted = item.children?.length
              ? isOpen || (isActive && !hasDesktopOpenMenu)
              : isActive && !hasDesktopOpenMenu;
            const ItemIcon = item.icon;

            if (item.children?.length) {
              return (
                <DropdownMenu
                  key={item.href}
                  modal={false}
                  open={isOpen}
                  onOpenChange={(open) => {
                    if (open) {
                      openDesktopMenu(item.href);
                      return;
                    }

                    closeDesktopMenu(item.href);
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-current={isActive ? "page" : undefined}
                      onPointerEnter={() => openDesktopMenu(item.href)}
                      onPointerLeave={() => scheduleDesktopMenuClose(item.href)}
                      className={cn(
                        "group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors 2xl:px-3.5 2xl:text-sm",
                        isDesktopHighlighted
                          ? "font-semibold text-slate-900"
                          : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      )}
                    >
                      <ItemIcon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isDesktopHighlighted ? "text-[#1B66B3]" : "text-slate-500 group-hover:text-[#1B66B3]",
                        )}
                      />
                      {item.label}
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="center"
                    collisionPadding={16}
                    sideOffset={12}
                    onPointerEnter={() => openDesktopMenu(item.href)}
                    onPointerLeave={() => scheduleDesktopMenuClose(item.href)}
                    className="w-[min(31rem,calc(100vw-2rem))] rounded-[1.2rem] bg-white p-2.5 text-slate-900 shadow-[0_22px_54px_-36px_rgba(15,23,42,0.22)]"
                  >
                    <div className="space-y-2.5">
                      {item.featured ? (
                        <Link
                          href={item.href}
                          onClick={() => {
                            setDesktopOpenMenu(null);
                            scrollToTopIfSameRoute(item.href);
                          }}
                          className="block rounded-[0.95rem] bg-[#F3F8FF] px-3.5 py-2.5 transition-colors hover:bg-[#F8FBFF]"
                        >
                          <p className="text-base font-semibold text-slate-900">{item.featured.label}</p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.featured.description}</p>
                        </Link>
                      ) : null}

                      <div className="grid gap-1.5 md:grid-cols-2">
                        {item.children.map((child) => (
                          <Link
                            key={`${child.href}-${child.label}`}
                            href={child.href}
                            onClick={() => {
                              setDesktopOpenMenu(null);
                              scrollToTopIfSameRoute(child.href);
                            }}
                            className="group flex items-start gap-2.5 rounded-[0.95rem] px-2.5 py-2.5 transition-colors hover:bg-[#F3F8FF]"
                          >
                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F8FBFF] text-[#1B66B3]">
                              <child.icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[0.95rem] font-semibold leading-6 text-slate-900">
                                {child.label}
                              </span>
                              <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                                {child.description}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors 2xl:px-3.5 2xl:text-sm",
                  isDesktopHighlighted
                    ? "font-semibold text-slate-900"
                    : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <ItemIcon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isDesktopHighlighted ? "text-[#1B66B3]" : "text-slate-500 group-hover:text-[#1B66B3]",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          onClick={() => setMobileOpen((current) => !current)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {mobileOpen ? (
        <div className="bg-white lg:hidden">
          <div className="site-container py-4">
            <nav className="grid gap-2">
              {navigationItems.map((item) => {
                const isActive = isActivePath(item.href);
                const ItemIcon = item.icon;

                if (item.children?.length) {
                  const isExpanded = mobileOpenMenu === item.href;

                  return (
                    <div
                      key={item.href}
                      className="overflow-hidden rounded-[1.5rem] bg-white"
                    >
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors",
                          isActive || isExpanded
                            ? "bg-[#F8FBFF] font-semibold text-slate-900"
                            : "font-medium text-slate-600",
                        )}
                        onClick={() => setMobileOpenMenu((current) => (current === item.href ? null : item.href))}
                        aria-expanded={isExpanded}
                      >
                        <span className="flex items-center gap-2">
                          <ItemIcon
                            className={cn(
                              "h-4 w-4",
                              isActive || isExpanded ? "text-[#1B66B3]" : "text-slate-500",
                            )}
                          />
                          {item.label}
                        </span>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                      </button>

                      {isExpanded ? (
                        <div className="grid gap-2 px-3 pb-3">
                          {item.featured ? (
                            <Link
                              href={item.href}
                              onClick={() => {
                                closeMobileMenu();
                                scrollToTopIfSameRoute(item.href);
                              }}
                              className="rounded-xl bg-[#F3F8FF] px-4 py-3"
                            >
                              <p className="text-sm font-semibold text-slate-900">{item.featured.label}</p>
                              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.featured.description}</p>
                            </Link>
                          ) : null}

                          {item.children.map((child) => (
                            <Link
                              key={`${child.href}-${child.label}`}
                              href={child.href}
                              onClick={() => {
                                closeMobileMenu();
                                scrollToTopIfSameRoute(child.href);
                              }}
                              className="rounded-xl bg-white px-4 py-3 transition-colors hover:bg-[#F3F8FF]"
                            >
                              <div className="flex items-start gap-3">
                                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8FBFF] text-[#1B66B3]">
                                  <child.icon className="h-4 w-4" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-semibold text-slate-900">{child.label}</span>
                                  <span className="mt-1 block text-xs text-slate-600 leading-relaxed">
                                    {child.description}
                                  </span>
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-2xl px-4 py-3 text-sm transition-colors",
                      isActive
                        ? "bg-[#F8FBFF] font-semibold text-slate-900"
                        : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    )}
                  >
                    <ItemIcon className={cn("h-4 w-4", isActive ? "text-[#1B66B3]" : "text-slate-500")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

