import { ADMIN_AUTH_COOKIE } from "@/lib/auth/constants";

const AUTH_TOKEN_STORAGE_KEY = "tekorix_admin_token";
const AUTH_COOKIE_KEY = ADMIN_AUTH_COOKIE;
const LEGACY_AUTH_COOKIE_KEY = "admin_auth";
const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8;

function hasWindow() {
  return typeof window !== "undefined";
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (!hasWindow()) {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (!hasWindow()) {
    return;
  }

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function readCookie(name: string) {
  if (!hasWindow()) {
    return null;
  }

  const prefix = `${name}=`;
  const parts = document.cookie.split(";").map((item) => item.trim());

  for (const part of parts) {
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length));
    }
  }

  return null;
}

export function setAuthToken(token: string) {
  if (!hasWindow()) {
    return;
  }

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  setCookie(AUTH_COOKIE_KEY, token, AUTH_COOKIE_MAX_AGE_SECONDS);
  setCookie(LEGACY_AUTH_COOKIE_KEY, "1", AUTH_COOKIE_MAX_AGE_SECONDS);
}

export function getAuthToken() {
  if (!hasWindow()) {
    return null;
  }

  const fromStorage = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (fromStorage) {
    return fromStorage;
  }

  return readCookie(AUTH_COOKIE_KEY);
}

export function clearAuthToken() {
  if (!hasWindow()) {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  clearCookie(AUTH_COOKIE_KEY);
  clearCookie(LEGACY_AUTH_COOKIE_KEY);
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}
