"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { getFieldErrors } from "@/components/admin/forms/form-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/lib/auth/client";
import { changePasswordSchema, type ChangePasswordValues } from "@/lib/validators/auth";

const initialValues: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordForm() {
  const [values, setValues] = useState<ChangePasswordValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function updateField(field: keyof ChangePasswordValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = changePasswordSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      const result = await changePassword(parsed.data);

      if (!result.success) {
        setFormError(result.message);
        return;
      }

      toast.success(result.message);
      setValues(initialValues);
      setErrors({});
    } catch {
      setFormError("Could not connect to authentication service.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="surface-card space-y-5 p-6 sm:p-8" onSubmit={handleSubmit} noValidate>
      {formError ? (
        <Alert className="border-red-400/50 bg-red-500/10 text-red-100">
          <AlertTitle>Change failed</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label
          htmlFor="security-current-password"
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
          Current password
        </Label>
        <Input
          id="security-current-password"
          type="password"
          value={values.currentPassword}
          onChange={(event) => updateField("currentPassword", event.target.value)}
          placeholder="Current password"
          className="bg-background/60"
          aria-invalid={Boolean(errors.currentPassword)}
        />
        {errors.currentPassword ? <p className="text-xs text-red-300">{errors.currentPassword}</p> : null}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="security-new-password"
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
          New password
        </Label>
        <Input
          id="security-new-password"
          type="password"
          value={values.newPassword}
          onChange={(event) => updateField("newPassword", event.target.value)}
          placeholder="New password"
          className="bg-background/60"
          aria-invalid={Boolean(errors.newPassword)}
        />
        {errors.newPassword ? <p className="text-xs text-red-300">{errors.newPassword}</p> : null}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="security-confirm-password"
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
          Confirm new password
        </Label>
        <Input
          id="security-confirm-password"
          type="password"
          value={values.confirmPassword}
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          placeholder="Confirm new password"
          className="bg-background/60"
          aria-invalid={Boolean(errors.confirmPassword)}
        />
        {errors.confirmPassword ? <p className="text-xs text-red-300">{errors.confirmPassword}</p> : null}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}
