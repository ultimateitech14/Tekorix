"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Hash,
  KeyRound,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { getFieldErrors } from "@/components/admin/forms/form-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, getAdminMe } from "@/lib/auth/client";
import { changePasswordSchema, type ChangePasswordValues } from "@/lib/validators/auth";
import { cn } from "@/lib/utils";

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordUpdatedAt?: string | null;
};

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  visible: boolean;
  onToggleVisibility: () => void;
  onChange: (value: string) => void;
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

const initialPasswordValues: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Using the configured access password.";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently updated";
  }

  return dateTimeFormatter.format(parsed);
}

function PasswordField({
  id,
  label,
  placeholder,
  value,
  error,
  visible,
  onToggleVisibility,
  onChange,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-11 border-[#D4E8FC] bg-[#F8FBFF] pr-11 text-slate-900 placeholder:text-slate-400",
            error && "border-red-300 focus-visible:ring-red-300/40",
          )}
          aria-invalid={Boolean(error)}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string>("");
  const [passwordValues, setPasswordValues] = useState<ChangePasswordValues>(initialPasswordValues);
  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof ChangePasswordValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAdminMe();
      setProfile(data);
      setLastSynced(dateTimeFormatter.format(new Date()));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const securityTone = useMemo(
    () =>
      profile?.passwordUpdatedAt
        ? {
            label: "Custom password active",
            description: "This admin now signs in with the password last saved from this page.",
          }
        : {
            label: "Configured password active",
            description: "This admin is still using the backend-configured password until it is changed here.",
          },
    [profile?.passwordUpdatedAt],
  );

  function updatePasswordField(field: keyof ChangePasswordValues, value: string) {
    setPasswordValues((current) => ({ ...current, [field]: value }));
    setPasswordErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = changePasswordSchema.safeParse(passwordValues);

    if (!parsed.success) {
      setPasswordErrors(getFieldErrors(parsed.error));
      return;
    }

    setIsUpdatingPassword(true);
    setFormError(null);

    try {
      const result = await changePassword(parsed.data);
      toast.success(result.message);
      setPasswordValues(initialPasswordValues);
      setPasswordErrors({});
      await loadProfile();
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : "Unable to update password right now.");
    } finally {
      setIsUpdatingPassword(false);
    }
  }

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
    <div className="space-y-5">
      <Card className="overflow-hidden border-[#D4E8FC] bg-[linear-gradient(145deg,#FDFEFF_0%,#EDF6FF_52%,#E6F2FF_100%)]">
        <CardContent className="p-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.9fr)] xl:items-end">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C8DEF6] bg-[#F8FBFF]/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B66B3]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure Admin Access
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#BED9F3] bg-[#F8FBFF] text-[#1B66B3] shadow-[0_18px_40px_-30px_rgba(27,102,179,0.35)]">
                  <UserCircle2 className="h-9 w-9" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold text-slate-900">{profile.name}</h2>
                  <p className="mt-1 break-words text-sm text-slate-600">{profile.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C8DEF6] bg-[#F8FBFF] px-3 py-1 text-xs font-medium text-slate-700">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#1B66B3]" />
                      {formatRole(profile.role)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Session active
                    </span>
                  </div>
                </div>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Review the active admin account details here, then update the sign-in password whenever you need to
                rotate access for security.
              </p>
            </div>

            <div className="rounded-2xl border border-[#D4E8FC] bg-[#F8FBFF]/95 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Password status</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{securityTone.label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{securityTone.description}</p>
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#D4E8FC] bg-white/70 px-3 py-3">
                <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-[#1B66B3]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Last password update</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{formatDateTime(profile.passwordUpdatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.95fr)]">
        <Card className="border-[#D4E8FC] bg-[#F8FBFF]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-900">Account Overview</CardTitle>
            <CardDescription className="text-slate-500">
              Current admin identity, session status, and the latest sync snapshot from the backend.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              {
                label: "Name",
                value: profile.name,
                icon: <UserCircle2 className="h-4 w-4 text-[#1B66B3]" />,
              },
              {
                label: "Email",
                value: profile.email,
                icon: <Mail className="h-4 w-4 text-[#1B66B3]" />,
              },
              {
                label: "Role",
                value: formatRole(profile.role),
                icon: <ShieldCheck className="h-4 w-4 text-[#1B66B3]" />,
              },
              {
                label: "Admin ID",
                value: profile.id,
                icon: <Hash className="h-4 w-4 text-[#1B66B3]" />,
              },
              {
                label: "Session",
                value: "Active",
                icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
              },
              {
                label: "Last synced",
                value: lastSynced,
                icon: <RefreshCw className="h-4 w-4 text-[#1B66B3]" />,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-2 border-b border-[#E1EEFB] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                  {item.icon}
                  {item.label}
                </div>
                <p className="text-sm font-semibold text-slate-900 sm:text-right">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#D4E8FC] bg-[#F8FBFF]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-900">Change Password</CardTitle>
            <CardDescription className="text-slate-500">
              Save a new admin password here. The next sign-in will use this updated password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-xl border border-[#D4E8FC] bg-white/70 px-4 py-3 text-sm text-slate-600">
              Use a password with at least 8 characters. Keep it different from the current password for better
              security.
            </div>

            {formError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handlePasswordSubmit} noValidate>
              <PasswordField
                id="profile-current-password"
                label="Current Password"
                placeholder="Enter the current admin password"
                value={passwordValues.currentPassword}
                error={passwordErrors.currentPassword}
                visible={showCurrentPassword}
                onToggleVisibility={() => setShowCurrentPassword((current) => !current)}
                onChange={(value) => updatePasswordField("currentPassword", value)}
              />

              <PasswordField
                id="profile-new-password"
                label="New Password"
                placeholder="Enter a new secure password"
                value={passwordValues.newPassword}
                error={passwordErrors.newPassword}
                visible={showNewPassword}
                onToggleVisibility={() => setShowNewPassword((current) => !current)}
                onChange={(value) => updatePasswordField("newPassword", value)}
              />

              <PasswordField
                id="profile-confirm-password"
                label="Confirm New Password"
                placeholder="Re-enter the new password"
                value={passwordValues.confirmPassword}
                error={passwordErrors.confirmPassword}
                visible={showConfirmPassword}
                onToggleVisibility={() => setShowConfirmPassword((current) => !current)}
                onChange={(value) => updatePasswordField("confirmPassword", value)}
              />

              <div className="flex flex-col gap-3 border-t border-[#E1EEFB] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="inline-flex items-center gap-2 text-xs text-slate-500">
                  <LockKeyhole className="h-3.5 w-3.5 text-[#1B66B3]" />
                  Password changes are stored securely in the backend database.
                </p>
                <Button type="submit" disabled={isUpdatingPassword} className="sm:min-w-40">
                  {isUpdatingPassword ? "Saving..." : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
