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
    <section className="section-space">
      <div className="site-container">
        <div className="mx-auto grid max-w-md gap-6">
          <div className="flex justify-center">
            <BrandLogo priority className="h-20 sm:h-24" />
          </div>

          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Admin Access</p>
            <h1 className="font-display text-4xl uppercase tracking-[0.08em]">Control Center Sign In</h1>
            <p className="text-sm text-muted-foreground">Use your workspace credentials to continue.</p>
          </div>

          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="font-display text-3xl uppercase tracking-[0.08em]">
                Welcome back
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<p className="text-sm text-muted-foreground">Loading sign-in form...</p>}>
                <AdminLoginForm />
              </Suspense>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Need access?{" "}
                <Link href="/contact" className="text-primary hover:text-primary/80">
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
