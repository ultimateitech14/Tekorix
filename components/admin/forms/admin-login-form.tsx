"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { getFieldErrors } from "@/components/admin/forms/form-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin } from "@/lib/auth/client";
import { loginSchema, type LoginValues } from "@/lib/validators/auth";

const initialValues: LoginValues = {
  email: "",
  password: "",
};

const BLOCKED_NEXT_PATHS = new Set(["/login", "/admin/login", "/admin/forgot-password", "/admin/reset-password"]);

function getNextPath(nextParam: string | null) {
  if (!nextParam || !nextParam.startsWith("/") || nextParam.startsWith("//")) {
    return "/admin";
  }

  if (typeof window === "undefined") {
    return "/admin";
  }

  try {
    const resolved = new URL(nextParam, window.location.origin);

    if (resolved.origin !== window.location.origin) {
      return "/admin";
    }

    if (BLOCKED_NEXT_PATHS.has(resolved.pathname)) {
      return "/admin";
    }

    return `${resolved.pathname}${resolved.search}`;
  } catch {
    return "/admin";
  }
}

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState<LoginValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function updateField(field: keyof LoginValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      const result = await loginAdmin(parsed.data);
      toast.success(result.message);
      const nextPath = getNextPath(searchParams?.get("next") ?? null);
      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {formError ? (
        <Alert className="border-red-300 bg-red-50 text-red-700">
          <AlertTitle>Sign-in failed</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="admin-email" className="text-xs uppercase tracking-[0.16em] text-slate-600">
          Email
        </Label>
        <Input
          id="admin-email"
          type="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="admin@startupwork.dev"
          className="border-[#BED9F3] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#1B66B3]"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email ? <p className="text-xs text-red-600">{errors.email}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-password" className="text-xs uppercase tracking-[0.16em] text-slate-600">
          Password
        </Label>
        <Input
          id="admin-password"
          type="password"
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          placeholder="********"
          className="border-[#BED9F3] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#1B66B3]"
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password ? <p className="text-xs text-red-600">{errors.password}</p> : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/forgot-password" className="text-xs text-slate-600 hover:text-slate-900">
          Forgot password?
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}
