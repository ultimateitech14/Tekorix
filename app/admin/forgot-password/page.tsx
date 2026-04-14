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
    <section className="relative min-h-screen overflow-hidden bg-[#E6F1FF] py-10 sm:py-12">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(220,238,255,0.96)_0%,rgba(207,227,255,0.98)_100%)]" />
      <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-[rgba(45,143,229,0.14)] blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[rgba(83,174,250,0.2)] blur-3xl" />

      <div className="site-container relative">
        <div className="mx-auto grid max-w-md gap-6">
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1B66B3]">Admin Access</p>
            <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-slate-900">Reset Access</h1>
            <p className="text-sm text-slate-600">
              Enter your email to request a password reset link.
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
