"use client";

import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { getFieldErrors } from "@/components/admin/forms/form-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth/client";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validators/auth";

type ResetPasswordFormProps = {
  token: string;
};

type ResetFields = Omit<ResetPasswordValues, "token">;

const initialFields: ResetFields = {
  password: "",
  confirmPassword: "",
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [fields, setFields] = useState<ResetFields>(initialFields);
  const [errors, setErrors] = useState<Partial<Record<keyof ResetFields | "token", string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasToken = useMemo(() => token.trim().length > 0, [token]);

  function updateField(field: keyof ResetFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = resetPasswordSchema.safeParse({
      token,
      ...fields,
    });

    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      const result = await resetPassword(parsed.data);

      if (!result.success) {
        setFormError(result.message);
        return;
      }

      toast.success(result.message);
      setFields(initialFields);
      setErrors({});
    } catch {
      setFormError("Could not connect to authentication service.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!hasToken) {
    return (
      <Alert className="border-red-300 bg-red-50 text-red-700">
        <AlertTitle>Missing reset token</AlertTitle>
        <AlertDescription>Use the full password reset link from your email and try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {formError ? (
        <Alert className="border-red-300 bg-red-50 text-red-700">
          <AlertTitle>Reset failed</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="reset-password" className="text-xs uppercase tracking-[0.16em] text-slate-600">
          New password
        </Label>
        <Input
          id="reset-password"
          type="password"
          value={fields.password}
          onChange={(event) => updateField("password", event.target.value)}
          placeholder="Enter a strong password"
          className="border-[#BED9F3] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#1B66B3]"
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password ? <p className="text-xs text-red-600">{errors.password}</p> : null}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="reset-confirm-password"
          className="text-xs uppercase tracking-[0.16em] text-slate-600"
        >
          Confirm password
        </Label>
        <Input
          id="reset-confirm-password"
          type="password"
          value={fields.confirmPassword}
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          placeholder="Re-enter your password"
          className="border-[#BED9F3] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#1B66B3]"
          aria-invalid={Boolean(errors.confirmPassword)}
        />
        {errors.confirmPassword ? <p className="text-xs text-red-600">{errors.confirmPassword}</p> : null}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Resetting password..." : "Reset Password"}
      </Button>
    </form>
  );
}
