"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Hash, Mail, ShieldCheck, UserCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminMe } from "@/lib/auth/client";

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatRole(value: string) {
  return value
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string>("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getAdminMe();

        if (!active) {
          return;
        }

        setProfile(data);
        setLastSynced(dateTimeFormatter.format(new Date()));
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Unable to load profile.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="border-[#D4E8FC] bg-[#F8FBFF]">
        <CardContent className="p-6 text-sm text-slate-600">Loading profile...</CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card className="border-[#D4E8FC] bg-[#F8FBFF]">
        <CardContent className="p-6 text-sm text-red-600">{error ?? "Profile not available."}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-[#D4E8FC] bg-[linear-gradient(150deg,#F9FCFF_0%,#EDF6FF_100%)]">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Admin Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#D4E8FC] bg-[#F8FBFF] p-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#BED9F3] bg-[#EAF4FF] text-[#1B66B3]">
              <UserCircle2 className="h-7 w-7" />
            </span>
            <div>
              <p className="text-lg font-semibold text-slate-900">{profile.name}</p>
              <p className="text-sm text-slate-600">{profile.email}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#D4E8FC] bg-[#F8FBFF] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.14em] text-slate-500">Name</p>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                <UserCircle2 className="h-4 w-4 text-[#1B66B3]" />
                {profile.name}
              </p>
            </div>

            <div className="rounded-xl border border-[#D4E8FC] bg-[#F8FBFF] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.14em] text-slate-500">Email</p>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                <Mail className="h-4 w-4 text-[#1B66B3]" />
                {profile.email}
              </p>
            </div>

            <div className="rounded-xl border border-[#D4E8FC] bg-[#F8FBFF] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.14em] text-slate-500">Role</p>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                <ShieldCheck className="h-4 w-4 text-[#1B66B3]" />
                {formatRole(profile.role)}
              </p>
            </div>

            <div className="rounded-xl border border-[#D4E8FC] bg-[#F8FBFF] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.14em] text-slate-500">Admin ID</p>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                <Hash className="h-4 w-4 text-[#1B66B3]" />
                {profile.id}
              </p>
            </div>

            <div className="rounded-xl border border-[#D4E8FC] bg-[#F8FBFF] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.14em] text-slate-500">Session</p>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                <BadgeCheck className="h-4 w-4 text-emerald-600" />
                Active
              </p>
            </div>

            <div className="rounded-xl border border-[#D4E8FC] bg-[#F8FBFF] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.14em] text-slate-500">Last synced</p>
              <p className="text-sm font-medium text-slate-900">{lastSynced}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
