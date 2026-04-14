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
    <section className="min-h-screen bg-[#E6F1FF] py-10 sm:py-12">
      <div className="site-container">
        <div className="mx-auto grid max-w-md gap-6">
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1B66B3]">Admin Access</p>
            <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-slate-900">Create New Password</h1>
            <p className="text-sm text-slate-600">
              Enter a strong new password to restore access to your workspace.
            </p>
          </div>

          <Card className="rounded-[1.5rem] border border-[#BED9F3] bg-[#F8FBFF] text-slate-900 shadow-[0_24px_56px_-42px_rgba(15,23,42,0.24)]">
            <CardHeader>
              <CardTitle className="font-display text-3xl uppercase tracking-[0.08em] text-slate-900">
                Reset password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResetPasswordForm token={searchParams.token ?? ""} />
              <p className="mt-4 text-center text-xs text-slate-600">
                Back to{" "}
                <Link href="/login" className="text-[#1B66B3] hover:text-[#145188]">
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
