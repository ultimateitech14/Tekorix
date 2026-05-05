import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ADMIN_AUTH_COOKIE } from "@/lib/auth/constants";

const adminRedirectToRootLoginPaths = new Set(["/admin/login"]);
const adminPublicAuthPaths = new Set(["/admin/forgot-password", "/admin/reset-password"]);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const adminToken = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  const legacyAdminAuth = request.cookies.get("admin_auth")?.value;
  const isAuthenticated = Boolean(adminToken) || legacyAdminAuth === "1";

  // Keep old admin auth URLs predictable and avoid redirect loops.
  if (adminRedirectToRootLoginPaths.has(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (adminPublicAuthPaths.has(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
