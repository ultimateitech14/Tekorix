"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type CompanyProfile = {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  googleMapLink: string;
};

const COMPANY_PROFILE_STORAGE_KEY = "company_profile";

const emptyCompanyProfile: CompanyProfile = {
  companyName: "",
  email: "",
  phone: "",
  address: "",
  googleMapLink: "",
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseCompanyProfile(raw: string | null): CompanyProfile {
  if (!raw) {
    return emptyCompanyProfile;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CompanyProfile>;

    return {
      companyName: normalizeText(parsed.companyName),
      email: normalizeText(parsed.email),
      phone: normalizeText(parsed.phone),
      address: normalizeText(parsed.address),
      googleMapLink: normalizeText(parsed.googleMapLink),
    };
  } catch {
    return emptyCompanyProfile;
  }
}

function useCompanyProfileField(field: keyof CompanyProfile, fallback: string) {
  const normalizedFallback = useMemo(() => normalizeText(fallback), [fallback]);
  const [value, setValue] = useState(normalizedFallback);

  useEffect(() => {
    const stored = parseCompanyProfile(window.localStorage.getItem(COMPANY_PROFILE_STORAGE_KEY));
    const next = stored[field] || normalizedFallback;
    setValue(next);
  }, [field, normalizedFallback]);

  return value;
}

type CompanyNameTextProps = {
  fallback: string;
  className?: string;
};

export function CompanyNameText({ fallback, className }: CompanyNameTextProps) {
  const name = useCompanyProfileField("companyName", fallback);

  if (!className) {
    return <>{name}</>;
  }

  return <span className={className}>{name}</span>;
}

type CompanyEmailLinkProps = {
  fallback: string;
  className?: string;
  prefix?: string;
};

export function CompanyEmailLink({ fallback, className, prefix = "" }: CompanyEmailLinkProps) {
  const email = useCompanyProfileField("email", fallback);

  return (
    <a href={`mailto:${email}`} className={className}>
      {prefix}
      {email}
    </a>
  );
}

type CompanyEmailButtonLinkProps = {
  fallback: string;
  variant?: "default" | "outline";
};

export function CompanyEmailButtonLink({ fallback, variant = "outline" }: CompanyEmailButtonLinkProps) {
  const email = useCompanyProfileField("email", fallback);

  return (
    <Button asChild variant={variant}>
      <a href={`mailto:${email}`}>Email {email}</a>
    </Button>
  );
}

type CompanyPhoneLinkProps = {
  fallback: string;
  className?: string;
};

export function CompanyPhoneLink({ fallback, className }: CompanyPhoneLinkProps) {
  const phone = useCompanyProfileField("phone", fallback);

  return (
    <a href={`tel:${phone}`} className={className}>
      {phone}
    </a>
  );
}

type CompanyAddressTextProps = {
  fallback?: string;
  className?: string;
};

export function CompanyAddressText({ fallback = "", className }: CompanyAddressTextProps) {
  const address = useCompanyProfileField("address", fallback);

  if (!address) {
    return null;
  }

  if (!className) {
    return <>{address}</>;
  }

  return <span className={className}>{address}</span>;
}

type CompanyMapLinkProps = {
  fallback?: string;
  className?: string;
  label?: string;
};

export function CompanyMapLink({ fallback = "", className, label = "View on Google Maps" }: CompanyMapLinkProps) {
  const link = useCompanyProfileField("googleMapLink", fallback);

  if (!link || !link.toLowerCase().startsWith("http")) {
    return null;
  }

  return (
    <a href={link} className={className} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}
