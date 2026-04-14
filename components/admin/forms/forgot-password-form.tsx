"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { getFieldErrors } from "@/components/admin/forms/form-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/lib/auth/client";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validators/auth";

const initialValues: ForgotPasswordValues = {
  email: "",
};

export function ForgotPasswordForm() {
  const [values, setValues] = useState<ForgotPasswordValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function updateEmail(value: string) {
    setValues({ email: value });
    setErrors({ email: undefined });
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = forgotPasswordSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      const result = await forgotPassword(parsed.data);

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
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {formError ? (
        <Alert className="border-red-300 bg-red-50 text-red-700">
          <AlertTitle>Request failed</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="forgot-email" className="text-xs uppercase tracking-[0.16em] text-slate-600">
          Account email
        </Label>
        <Input
          id="forgot-email"
          type="email"
          value={values.email}
          onChange={(event) => updateEmail(event.target.value)}
          placeholder="you@company.com"
          className="border-[#BED9F3] bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#1B66B3]"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email ? <p className="text-xs text-red-600">{errors.email}</p> : null}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Sending reset link..." : "Send Reset Link"}
      </Button>
    </form>
  );
}
