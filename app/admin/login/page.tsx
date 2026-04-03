import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_AUTH_COOKIE } from "@/lib/auth/constants";

export default function AdminLoginLegacyPage() {
  const cookieStore = cookies();
  const isAuthenticated =
    Boolean(cookieStore.get(ADMIN_AUTH_COOKIE)?.value) || cookieStore.get("admin_auth")?.value === "1";

  redirect(isAuthenticated ? "/admin" : "/login");
}
