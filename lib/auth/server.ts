import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_AUTH_COOKIE, ADMIN_AUTH_TTL_SECONDS } from "@/lib/auth/constants";
import { isProduction } from "@/lib/env";

export function getServerAuthToken() {
  return cookies().get(ADMIN_AUTH_COOKIE)?.value ?? null;
}

export function isServerAuthenticated() {
  return Boolean(getServerAuthToken());
}

export function requireAdminAuth() {
  if (!isServerAuthenticated()) {
    redirect("/admin/login");
  }
}

export const adminAuthCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProduction,
  path: "/",
  maxAge: ADMIN_AUTH_TTL_SECONDS,
};
