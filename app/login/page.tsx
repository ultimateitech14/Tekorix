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
  description: "Secure admin sign-in for the operations workspace.",
  path: "/login",
});

export default function LoginPage() {
  const isAuthenticated =
    Boolean(cookies().get(ADMIN_AUTH_COOKIE)?.value) || cookies().get("admin_auth")?.value === "1";

  if (isAuthenticated) {
    redirect("/admin");
  }

  return (
    <section className="min-h-screen bg-[#E6F1FF] py-10 sm:py-12">
      <div className="site-container">
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
