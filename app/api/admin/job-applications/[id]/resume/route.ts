import { readFile } from "fs/promises";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createAdminAuditEntry } from "@/lib/admin-audit-store";
import { getJobApplicationResumeById } from "@/lib/job-applications-store";
import { upsertResumeBankEntryFromApplication } from "@/lib/resume-bank-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAuthorized() {
  return Boolean(cookies().get("admin_auth")?.value);
}

function sanitizeDownloadName(value: string) {
  return value.replace(/[^A-Za-z0-9._-]/g, "_");
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

  const result = await getJobApplicationResumeById(context.params.id);

  if (!result) {
    return NextResponse.json({ success: false, message: "Resume not found." }, { status: 404 });
  }

  try {
    await upsertResumeBankEntryFromApplication(result.application);
    await createAdminAuditEntry({
      category: "activity",
      module: "Candidates",
      action: "Added Resume To Resume Bank",
      target: `${result.application.id} - ${result.application.fullName} (${result.application.jobTitle})`,
    });
  } catch {
    // Do not block download if resume bank write fails.
  }

  try {
    const file = await readFile(result.absolutePath);
    const contentType = result.application.resume.contentType || "application/octet-stream";
    const filename = sanitizeDownloadName(result.application.resume.originalName);

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to read resume." }, { status: 500 });
  }
}
