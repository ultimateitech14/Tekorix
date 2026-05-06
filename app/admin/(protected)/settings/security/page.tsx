import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { ChangePasswordForm } from "@/components/admin/forms/change-password-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSecurityPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="border-[#D4E8FC] bg-[#F8FBFF] shadow-[0_24px_60px_-46px_rgba(15,23,42,0.18)]">
        <CardHeader className="space-y-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F2FF] text-[#1B66B3]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="space-y-2">
            <CardTitle className="text-2xl text-slate-950">Security Settings</CardTitle>
            <p className="text-sm leading-6 text-slate-600">
              Rotate the admin password here when you need to secure access for the control center.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
          <div className="rounded-2xl border border-[#D4E8FC] bg-white/80 px-5 py-4">
            Keep the password unique and share it only with the people responsible for the admin workspace.
          </div>
          <div className="rounded-2xl border border-[#D4E8FC] bg-white/80 px-5 py-4">
            Password updates are saved through the Express backend and take effect on the next sign-in.
          </div>
          <div className="rounded-2xl border border-[#D4E8FC] bg-white/80 px-5 py-4">
            If you do not know the current password, use the forgot-password flow. A reset link is sent to the configured admin email after the notification provider is set up.
          </div>
          <Button asChild variant="outline" className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-[#EDF5FF]">
            <Link href="/admin/forgot-password">Open Forgot Password</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="rounded-[1.75rem] border border-[#D4E8FC] bg-[#F8FBFF] shadow-[0_24px_60px_-46px_rgba(15,23,42,0.18)]">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
