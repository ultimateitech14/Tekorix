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
    <div className="relative min-h-screen overflow-x-hidden bg-[#E6F1FF]">
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
