import type { Metadata } from "next";
import Link from "next/link";

import { ResetPasswordForm } from "@/components/admin/forms/reset-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Reset Password",
  description: "Set a new admin password using a secure reset token.",
  path: "/admin/reset-password",
});

type ResetPasswordPageProps = {
  searchParams: {
    token?: string;
  };
};

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  return (
    <section className="section-space">
      <div className="site-container">
        <div className="mx-auto grid max-w-md gap-6">
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Admin Access</p>
            <h1 className="font-display text-4xl uppercase tracking-[0.08em]">Create New Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter a strong new password to restore access to your workspace.
            </p>
          </div>

          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="font-display text-3xl uppercase tracking-[0.08em]">
                Reset password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResetPasswordForm token={searchParams.token ?? ""} />
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Back to{" "}
                <Link href="/login" className="text-primary hover:text-primary/80">
                  sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
