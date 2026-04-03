import type { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/admin/forms/forgot-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Forgot Password",
  description: "Request an admin password reset email.",
  path: "/admin/forgot-password",
});

export default function ForgotPasswordPage() {
  return (
    <section className="section-space">
      <div className="site-container">
        <div className="mx-auto grid max-w-md gap-6">
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Admin Access</p>
            <h1 className="font-display text-4xl uppercase tracking-[0.08em]">Reset Access</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to request a password reset link.
            </p>
          </div>

          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="font-display text-3xl uppercase tracking-[0.08em]">
                Forgot password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ForgotPasswordForm />
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Remembered it?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80">
                  Back to sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
