import { env } from "@/lib/env";

export function resolveAssetUrl(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return "";
  }

  if (normalized.startsWith("/uploads/")) {
    return `${env.NEXT_PUBLIC_API_BASE_URL}${normalized}`;
  }

  return normalized;
}
