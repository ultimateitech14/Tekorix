import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createAdminAuditEntry } from "@/lib/admin-audit-store";
import {
  clearResumeBankEntries,
  getResumeBankEntries,
  removeResumeBankEntriesByApplicationIds,
  removeResumeBankEntryByApplicationId,
} from "@/lib/resume-bank-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAuthorized() {
  return Boolean(cookies().get("admin_auth")?.value);
}

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const items = await getResumeBankEntries();

  return NextResponse.json(
    {
      success: true,
      items,
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

  const deleteAll =
    payload && typeof payload === "object"
      ? Boolean((payload as { deleteAll?: boolean }).deleteAll)
      : false;

  if (deleteAll) {
    await clearResumeBankEntries();
    await createAdminAuditEntry({
      category: "activity",
      module: "Candidates",
      action: "Cleared Resume Bank",
      target: "All resume bank entries",
    });

    return NextResponse.json({ success: true, deletedCount: "all" });
  }

  const applicationIds =
    payload && typeof payload === "object" && Array.isArray((payload as { applicationIds?: unknown[] }).applicationIds)
      ? (payload as { applicationIds: unknown[] }).applicationIds.map((item) => toTrimmedString(item)).filter(Boolean)
      : [];

  if (applicationIds.length > 0) {
    const removed = await removeResumeBankEntriesByApplicationIds(applicationIds);

    if (removed > 0) {
      await createAdminAuditEntry({
        category: "activity",
        module: "Candidates",
        action: "Deleted Selected Resume Bank Entries",
        target: `${removed} record(s) removed`,
      });
    }

    return NextResponse.json({ success: true, deletedCount: removed });
  }

  const applicationId = toTrimmedString(
    payload && typeof payload === "object" ? (payload as { applicationId?: string }).applicationId : "",
  );

  if (!applicationId) {
    return NextResponse.json(
      { success: false, message: "applicationId or applicationIds or deleteAll is required." },
      { status: 400 },
    );
  }

  const removed = await removeResumeBankEntryByApplicationId(applicationId);

  if (!removed) {
    return NextResponse.json({ success: false, message: "Resume bank entry not found." }, { status: 404 });
  }

  await createAdminAuditEntry({
    category: "activity",
    module: "Candidates",
    action: "Deleted Resume Bank Entry",
    target: applicationId,
  });

  return NextResponse.json({ success: true, deletedCount: 1 });
}
