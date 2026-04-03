import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createAdminAuditEntry } from "@/lib/admin-audit-store";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings-store";
import { siteSettingsUpdateSchema } from "@/lib/validators/site-settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAuthorized() {
  return cookies().get("admin_auth")?.value === "1";
}

export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const data = await getSiteSettings();

  return NextResponse.json(
    {
      success: true,
      message: "Site settings fetched successfully.",
      data,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

export async function PUT(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request payload." }, { status: 400 });
  }

  const parsed = siteSettingsUpdateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid request.",
      },
      { status: 400 },
    );
  }

  const data = await updateSiteSettings(parsed.data);
  const changedFields = Object.keys(parsed.data);

  await createAdminAuditEntry({
    category: "audit",
    module: "Settings",
    action: "Updated Site Settings",
    target: changedFields.length ? changedFields.join(", ") : "General settings",
  });

  return NextResponse.json(
    {
      success: true,
      message: "Site settings updated successfully.",
      data,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
