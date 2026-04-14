import { cookies } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { BrandLogo } from "@/components/global/BrandLogo";
import { AdminLoginForm } from "@/components/admin/forms/admin-login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ADMIN_AUTH_COOKIE } from "@/lib/auth/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Login",
  description: "Secure admin sign-in for StartupWork operations workspace.",
  path: "/login",
});

export default function LoginPage() {
  const isAuthenticated =
    Boolean(cookies().get(ADMIN_AUTH_COOKIE)?.value) || cookies().get("admin_auth")?.value === "1";

  if (isAuthenticated) {
    redirect("/admin");
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#E6F1FF] py-10 sm:py-12">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(220,238,255,0.96)_0%,rgba(207,227,255,0.98)_100%)]" />
      <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-[rgba(45,143,229,0.14)] blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[rgba(83,174,250,0.2)] blur-3xl" />

      <div className="site-container relative">
        <div className="mx-auto grid max-w-md gap-6">
          <div className="flex justify-center">
            <BrandLogo priority className="h-20 sm:h-24" />
          </div>

          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1B66B3]">Admin Access</p>
            <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-slate-900">Control Center Sign In</h1>
            <p className="text-sm text-slate-600">Use your workspace credentials to continue.</p>
          </div>

          <Card className="rounded-[1.5rem] border border-[#BED9F3] bg-[#F8FBFF] text-slate-900 shadow-[0_24px_56px_-42px_rgba(15,23,42,0.24)]">
            <CardHeader>
              <CardTitle className="font-display text-3xl uppercase tracking-[0.08em] text-slate-900">
                Welcome back
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<p className="text-sm text-slate-600">Loading sign-in form...</p>}>
                <AdminLoginForm />
              </Suspense>
              <p className="mt-4 text-center text-xs text-slate-600">
                Need access?{" "}
                <Link href="/contact" className="text-[#1B66B3] hover:text-[#145188]">
                  Contact operations
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
