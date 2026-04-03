"use client";

import { Suspense, useState } from "react";

import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { Header } from "@/components/admin/Header";
import { Sidebar } from "@/components/admin/Sidebar";
import { ENABLE_ADMIN_UI_REFRESH } from "@/lib/ui-flags";
import { cn } from "@/lib/utils";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden",
        ENABLE_ADMIN_UI_REFRESH
          ? "bg-[radial-gradient(circle_at_14%_16%,rgba(245,197,24,0.1),transparent_34%),radial-gradient(circle_at_84%_10%,rgba(14,165,233,0.1),transparent_32%),linear-gradient(180deg,#061425_0%,#081729_48%,#06111f_100%)]"
          : "bg-[radial-gradient(circle_at_14%_18%,rgba(245,197,24,0.12),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(249,215,95,0.1),transparent_28%),linear-gradient(180deg,#071423_0%,#08172a_52%,#071423_100%)]",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          ENABLE_ADMIN_UI_REFRESH
            ? "opacity-25 [background:linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:56px_56px]"
            : "opacity-30 [background:linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:48px_48px]",
        )}
      />

      <Suspense fallback={null}>
        <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen} />
      </Suspense>

      <div
        className={cn(
          "relative min-h-screen transition-[padding-left] duration-300",
          collapsed ? "lg:pl-24" : "lg:pl-72",
        )}
      >
        <Header
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((current) => !current)}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />

        <main
          className={cn(
            "px-4 sm:px-6 lg:px-8",
            ENABLE_ADMIN_UI_REFRESH ? "pb-10 pt-7 md:pt-8" : "pb-8 pt-6",
          )}
        >
          <AdminAuthGuard />
          {children}
        </main>
      </div>
    </div>
  );
}
