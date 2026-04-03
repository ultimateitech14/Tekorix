import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  clearAdminAuditEntries,
  clearAdminAuditEntriesByIds,
  listAdminAuditEntries,
} from "@/lib/admin-audit-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LogsTab = "activity" | "audit" | "notifications";

function isAuthorized() {
  return Boolean(cookies().get("admin_auth")?.value);
}

function parseTab(value: unknown): LogsTab | null {
  if (value === "activity" || value === "audit" || value === "notifications") {
    return value;
  }

  return null;
}

function isAuditLike(item: {
  category: "activity" | "audit" | "notification";
  module?: string;
  action: string;
}) {
  if (item.category === "notification") {
    return false;
  }

  if (item.category === "audit") {
    return true;
  }

  const moduleName = (item.module ?? "").toLowerCase();
  const action = item.action.toLowerCase();

  if (moduleName === "settings") {
    return true;
  }

  if (action.includes("template") || action.includes("provider")) {
    return true;
  }

  return false;
}

export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const all = await listAdminAuditEntries();

  const activity = all.filter((item) => item.category === "activity" && !isAuditLike(item));
  const audit = all.filter((item) => isAuditLike(item));
  const notifications = all.filter((item) => item.category === "notification");

  return NextResponse.json(
    {
      success: true,
      data: {
        activity,
        audit,
        notifications,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

export async function DELETE(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown = null;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const tab = parseTab(payload && typeof payload === "object" ? (payload as { tab?: string }).tab : null);

  if (tab === "activity") {
    const all = await listAdminAuditEntries();
    const ids = all
      .filter((item) => item.category === "activity" && !isAuditLike(item))
      .map((item) => item.id);
    const success = await clearAdminAuditEntriesByIds(ids);
    return NextResponse.json({ success });
  }

  if (tab === "audit") {
    const all = await listAdminAuditEntries();
    const ids = all.filter((item) => isAuditLike(item)).map((item) => item.id);
    const success = await clearAdminAuditEntriesByIds(ids);
    return NextResponse.json({ success });
  }

  if (tab === "notifications") {
    const success = await clearAdminAuditEntries({ categories: ["notification"] });
    return NextResponse.json({ success });
  }

  const success = await clearAdminAuditEntries();
  return NextResponse.json({ success });
}
