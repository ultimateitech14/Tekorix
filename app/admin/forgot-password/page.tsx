import type { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/admin/forms/forgot-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata, noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Forgot Password",
  description: "Request an admin password reset email.",
  path: "/admin/forgot-password",
  robots: noIndexRobots,
});

export default function ForgotPasswordPage() {
  return (
    <section className="min-h-screen bg-[#E6F1FF] py-10 sm:py-12">
      <div className="site-container">
        <div className="mx-auto grid max-w-md gap-6">
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1B66B3]">Admin Access</p>
            <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-slate-900">Reset Access</h1>
            <p className="text-sm text-slate-600">
              Enter the admin email to request a password reset link. The link is delivered through the configured notification email channel.
            </p>
          </div>

          <Card className="rounded-[1.5rem] border border-[#BED9F3] bg-[#F8FBFF] text-slate-900 shadow-[0_24px_56px_-42px_rgba(15,23,42,0.24)]">
            <CardHeader>
              <CardTitle className="font-display text-3xl uppercase tracking-[0.08em] text-slate-900">
                Forgot password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ForgotPasswordForm />
              <p className="mt-4 text-center text-xs text-slate-600">
                Remembered it?{" "}
                <Link href="/login" className="text-[#1B66B3] hover:text-[#145188]">
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
