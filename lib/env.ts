const DEFAULT_SITE_URL = "http://localhost:3000";
const DEFAULT_API_BASE_URL = "http://127.0.0.1:4001";

type AppEnv = {
  NODE_ENV: "development" | "test" | "production";
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_API_BASE_URL: string;
};

function resolveNodeEnv(): AppEnv["NODE_ENV"] {
  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
    return process.env.NODE_ENV;
  }

  return "development";
}

function getEnv(name: keyof NodeJS.ProcessEnv, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function normalizeUrl(value: string) {
  const url = new URL(value);
  return url.toString().replace(/\/$/, "");
}

export const env: AppEnv = {
  NODE_ENV: resolveNodeEnv(),
  NEXT_PUBLIC_SITE_URL: normalizeUrl(getEnv("NEXT_PUBLIC_SITE_URL", DEFAULT_SITE_URL)),
  NEXT_PUBLIC_API_BASE_URL: normalizeUrl(
    getEnv("NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL),
  ),
};

export const isProduction = env.NODE_ENV === "production";
