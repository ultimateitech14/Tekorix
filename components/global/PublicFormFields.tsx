"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getPublicPhoneLengthMessage,
  getPublicPhoneMetadata,
  getPublicPhoneOptionLabel,
  normalizePublicPhoneDigits,
  publicPhonePrefixValues,
} from "@/lib/validators/public-form-fields";
import { cn } from "@/lib/utils";

export const publicFormEyebrowClass = "text-xs font-semibold uppercase tracking-[0.22em]";
export const publicFormHeadingClass =
  "font-display text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl";
export const publicFormDescriptionClass = "text-sm leading-6 text-slate-600 sm:text-base";
export const publicFormLabelClass = "text-xs font-semibold uppercase tracking-[0.14em] text-slate-700";
export const publicFormInputClass =
  "h-12 rounded-2xl border-slate-300 bg-white px-4 text-base text-slate-900 placeholder:text-slate-400 shadow-none transition hover:border-slate-400 focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/15 aria-[invalid=true]:border-red-400";
export const publicFormSelectTriggerClass =
  "h-12 rounded-2xl border-slate-300 bg-white px-4 text-base text-slate-900 shadow-none transition hover:border-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 aria-[invalid=true]:border-red-400 data-[placeholder]:text-slate-400";
export const publicFormTextareaClass =
  "min-h-32 rounded-[1.1rem] border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 shadow-none transition hover:border-slate-400 focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/15 aria-[invalid=true]:border-red-400";
export const publicFormFileInputClass =
  "block w-full rounded-[1.1rem] border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 transition hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 aria-[invalid=true]:border-red-400";
export const publicFormHelperTextClass = "text-xs leading-5 text-slate-500";
export const publicFormErrorTextClass = "text-xs leading-5 text-red-600";
export const publicFormNoteTextClass = "text-xs leading-5 text-slate-600";

type PublicFieldMessageProps = {
  error?: string;
  helperText?: string;
  note?: string;
  className?: string;
};

type PublicPhoneFieldProps = {
  idPrefix: string;
  label?: string;
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onBlur?: () => void;
  showSupportText?: boolean;
};

export function PublicFieldMessages({ error, helperText, note, className }: PublicFieldMessageProps) {
  if (!error && !helperText && !note) {
    return null;
  }

  return (
    <div className={cn("space-y-1", className)} aria-live={error ? "assertive" : "polite"}>
      {error ? <p className={publicFormErrorTextClass}>{error}</p> : null}
      {helperText ? <p className={publicFormHelperTextClass}>{helperText}</p> : null}
      {note ? <p className={publicFormNoteTextClass}>{note}</p> : null}
    </div>
  );
}

export function PublicPhoneField({
  idPrefix,
  label = "Phone Number",
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  error,
  helperText = "Use a direct mobile or work number so Tekorix can follow up quickly.",
  placeholder,
  disabled,
  className,
  onBlur,
  showSupportText = true,
}: PublicPhoneFieldProps) {
  const metadata = getPublicPhoneMetadata(countryCode);
  const effectivePlaceholder = placeholder || metadata.placeholder;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`${idPrefix}-phone-number`} className={publicFormLabelClass}>
        {label}
      </Label>
      <div className="grid gap-3 sm:grid-cols-[112px_minmax(0,1fr)]">
        <Select value={countryCode} onValueChange={onCountryCodeChange} disabled={disabled}>
          <SelectTrigger
            id={`${idPrefix}-phone-code`}
            className={cn(publicFormSelectTriggerClass, "min-w-0 px-3")}
            aria-label={`${label} country code`}
            aria-invalid={Boolean(error)}
          >
            <SelectValue aria-label={getPublicPhoneOptionLabel(countryCode)}>{countryCode}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {publicPhonePrefixValues.map((prefix) => (
              <SelectItem key={prefix} value={prefix}>
                {getPublicPhoneOptionLabel(prefix)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          id={`${idPrefix}-phone-number`}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={phoneNumber}
          onChange={(event) =>
            onPhoneNumberChange(normalizePublicPhoneDigits(countryCode, event.target.value))
          }
          onBlur={onBlur}
          placeholder={effectivePlaceholder}
          maxLength={metadata.maxLength}
          className={publicFormInputClass}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          autoComplete="tel-national"
        />
      </div>
      <PublicFieldMessages
        error={error}
        helperText={showSupportText ? helperText : undefined}
        note={showSupportText ? `${metadata.helperText} ${getPublicPhoneLengthMessage(countryCode)}` : undefined}
      />
    </div>
  );
}
