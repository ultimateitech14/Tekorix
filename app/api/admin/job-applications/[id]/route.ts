import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createAdminAuditEntry } from "@/lib/admin-audit-store";
import {
  getJobApplicationById,
  markJobApplicationAsRead,
  updateJobApplicationStatus,
} from "@/lib/job-applications-store";
import { jobApplicationStatusSchema } from "@/lib/validators/job-applications";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAuthorized() {
  return Boolean(cookies().get("admin_auth")?.value);
}

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, context: RouteContext) {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const item = await getJobApplicationById(context.params.id);

  if (!item) {
    return NextResponse.json({ success: false, message: "Application not found." }, { status: 404 });
  }

  return NextResponse.json(
    {
      success: true,
      item,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const statusValue =
    payload && typeof payload === "object" ? (payload as { status?: string }).status?.trim() : "";

  if (statusValue) {
    const parsedStatus = jobApplicationStatusSchema.safeParse(statusValue);

    if (!parsedStatus.success) {
      return NextResponse.json({ success: false, message: "Invalid status value." }, { status: 400 });
    }

    const updated = await updateJobApplicationStatus(context.params.id, parsedStatus.data);

    if (!updated) {
      return NextResponse.json({ success: false, message: "Application not found." }, { status: 404 });
    }

    await createAdminAuditEntry({
      category: "activity",
      module: "Applications",
      action: "Updated Application Status",
      target: `${context.params.id} - ${parsedStatus.data}`,
    });

    return NextResponse.json({ success: true, item: updated });
  }

  const updated = await markJobApplicationAsRead(context.params.id);

  if (!updated) {
    return NextResponse.json({ success: false, message: "Application not found." }, { status: 404 });
  }

  await createAdminAuditEntry({
    category: "activity",
    module: "Applications",
    action: "Marked Application As Read",
    target: context.params.id,
  });

  return NextResponse.json({ success: true, item: updated });
}
