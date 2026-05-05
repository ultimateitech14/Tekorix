import { Button } from "@/components/ui/button";

function normalizeText(value: string) {
  return value.trim();
}

type CompanyNameTextProps = {
  fallback: string;
  className?: string;
};

export function CompanyNameText({ fallback, className }: CompanyNameTextProps) {
  const name = normalizeText(fallback);

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
  const email = normalizeText(fallback);

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
  const email = normalizeText(fallback);

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
  const phone = normalizeText(fallback);

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
  const address = normalizeText(fallback);

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
  const link = normalizeText(fallback);

  if (!link || !link.toLowerCase().startsWith("http")) {
    return null;
  }

  return (
    <a href={link} className={className} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}
