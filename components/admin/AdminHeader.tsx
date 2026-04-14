import Link from "next/link";

import { LogoutButton } from "@/components/admin/logout-button";
import { BrandLogo } from "@/components/global/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminHeaderProps = {
  isAuthenticated: boolean;
};

export function AdminHeader({ isAuthenticated }: AdminHeaderProps) {
  const quickLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/jobs", label: "Jobs" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="site-container flex h-16 items-center justify-between gap-4">
        <Link href="/admin" className="inline-flex items-center gap-3 text-foreground transition-opacity hover:opacity-95">
          <BrandLogo className="h-10" priority />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Admin</span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-2 sm:flex">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]",
                    "text-muted-foreground transition hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
              <Link href="/admin/jobs/new">New Job</Link>
            </Button>
            <LogoutButton />
          </div>
        ) : null}
      </div>
    </header>
  );
}
