import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createAdminAuditEntry } from "@/lib/admin-audit-store";
import {
  deleteAllJobApplications,
  deleteJobApplicationById,
  getJobApplications,
  markAllJobApplicationsAsRead,
  markJobApplicationAsRead,
  updateJobApplicationStatus,
} from "@/lib/job-applications-store";
import { clearResumeBankEntries, removeResumeBankEntryByApplicationId } from "@/lib/resume-bank-store";
import { jobApplicationStatusSchema } from "@/lib/validators/job-applications";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAuthorized() {
  return Boolean(cookies().get("admin_auth")?.value);
}

function parseScope(value: unknown) {
  return value === "candidates" ? "candidates" : "applications";
}

export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const items = await getJobApplications();
  const unreadCount = items.filter((item) => !item.isRead).length;

  return NextResponse.json(
    {
      success: true,
      items,
      unreadCount,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

export async function PATCH(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const markAll =
    payload && typeof payload === "object"
      ? Boolean((payload as { markAll?: boolean }).markAll)
      : false;

  if (markAll) {
    await markAllJobApplicationsAsRead();
    await createAdminAuditEntry({
      category: "activity",
      module: "Applications",
      action: "Marked All Applications As Read",
      target: "All applications",
    });
    return NextResponse.json({ success: true });
  }

  const id = payload && typeof payload === "object" ? (payload as { id?: string }).id?.trim() : "";

  if (!id) {
    return NextResponse.json({ success: false, message: "Application id is required." }, { status: 400 });
  }

  const statusValue =
    payload && typeof payload === "object" ? (payload as { status?: string }).status?.trim() : "";

  if (statusValue) {
    const parsedStatus = jobApplicationStatusSchema.safeParse(statusValue);

    if (!parsedStatus.success) {
      return NextResponse.json({ success: false, message: "Invalid status value." }, { status: 400 });
    }

    const updated = await updateJobApplicationStatus(id, parsedStatus.data);

    if (!updated) {
      return NextResponse.json({ success: false, message: "Application not found." }, { status: 404 });
    }

    await createAdminAuditEntry({
      category: "activity",
      module: "Applications",
      action: "Updated Application Status",
      target: `${id} - ${parsedStatus.data}`,
    });

    return NextResponse.json({ success: true, item: updated });
  }

  const updated = await markJobApplicationAsRead(id);

  if (!updated) {
    return NextResponse.json({ success: false, message: "Application not found." }, { status: 404 });
  }

  await createAdminAuditEntry({
    category: "activity",
    module: "Applications",
    action: "Marked Application As Read",
    target: id,
  });

  return NextResponse.json({ success: true, item: updated });
}

export async function DELETE(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const scope = parseScope(payload && typeof payload === "object" ? (payload as { scope?: string }).scope : null);
  const moduleName = scope === "candidates" ? "Candidates" : "Applications";
  const deleteAll =
    payload && typeof payload === "object"
      ? Boolean((payload as { deleteAll?: boolean }).deleteAll)
      : false;

  if (deleteAll) {
    const deletedCount = await deleteAllJobApplications();
    await clearResumeBankEntries();

    await createAdminAuditEntry({
      category: "activity",
      module: moduleName,
      action: scope === "candidates" ? "Cleared Candidate Directory" : "Deleted All Applications",
      target: `${deletedCount} record(s) removed`,
    });

    return NextResponse.json({ success: true, deletedCount });
  }

  const id = payload && typeof payload === "object" ? (payload as { id?: string }).id?.trim() : "";

  if (!id) {
    return NextResponse.json({ success: false, message: "Application id is required." }, { status: 400 });
  }

  const deleted = await deleteJobApplicationById(id);

  if (!deleted) {
    return NextResponse.json({ success: false, message: "Application not found." }, { status: 404 });
  }

  await removeResumeBankEntryByApplicationId(id);

  await createAdminAuditEntry({
    category: "activity",
    module: moduleName,
    action: scope === "candidates" ? "Deleted Candidate" : "Deleted Application",
    target: `${id} - ${deleted.fullName}`,
  });

  return NextResponse.json({ success: true, item: deleted });
}
