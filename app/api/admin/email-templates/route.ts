import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createAdminAuditEntry } from "@/lib/admin-audit-store";
import {
  createEmailTemplate,
  deleteAllEmailTemplates,
  deleteEmailTemplate,
  listEmailTemplates,
  updateEmailTemplate,
} from "@/lib/email-templates-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAuthorized() {
  return Boolean(cookies().get("admin_auth")?.value);
}

function parseBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1" || normalized === "yes") {
      return true;
    }
    if (normalized === "false" || normalized === "0" || normalized === "no") {
      return false;
    }
  }

  return null;
}

function parseNonEmptyString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const items = await listEmailTemplates();

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

export async function POST(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown = null;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const name = parseNonEmptyString(payload && typeof payload === "object" ? (payload as { name?: string }).name : "");
  const subject = parseNonEmptyString(
    payload && typeof payload === "object" ? (payload as { subject?: string }).subject : "",
  );
  const body = parseNonEmptyString(payload && typeof payload === "object" ? (payload as { body?: string }).body : "");
  const isActive = parseBoolean(
    payload && typeof payload === "object" ? (payload as { isActive?: boolean | string }).isActive : null,
  );

  if (name.length < 2) {
    return NextResponse.json({ success: false, message: "Template name is required." }, { status: 400 });
  }

  if (subject.length < 2) {
    return NextResponse.json({ success: false, message: "Email subject is required." }, { status: 400 });
  }

  if (body.length < 2) {
    return NextResponse.json({ success: false, message: "Email body is required." }, { status: 400 });
  }

  const item = await createEmailTemplate({
    name,
    subject,
    body,
    isActive: isActive !== null ? isActive : true,
  });

  await createAdminAuditEntry({
    category: "audit",
    module: "Email & Notifications",
    action: "Created Email Template",
    target: `${item.id} - ${item.name}`,
  });

  return NextResponse.json(
    {
      success: true,
      item,
    },
    {
      status: 201,
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

  let payload: unknown = null;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const id = parseNonEmptyString(payload && typeof payload === "object" ? (payload as { id?: string }).id : "");

  if (!id) {
    return NextResponse.json({ success: false, message: "Template id is required." }, { status: 400 });
  }

  const name = parseNonEmptyString(payload && typeof payload === "object" ? (payload as { name?: string }).name : "");
  const subject = parseNonEmptyString(
    payload && typeof payload === "object" ? (payload as { subject?: string }).subject : "",
  );
  const body = parseNonEmptyString(payload && typeof payload === "object" ? (payload as { body?: string }).body : "");
  const isActive = parseBoolean(
    payload && typeof payload === "object" ? (payload as { isActive?: boolean | string }).isActive : null,
  );

  const hasName = typeof (payload as { name?: unknown } | null)?.name !== "undefined";
  const hasSubject = typeof (payload as { subject?: unknown } | null)?.subject !== "undefined";
  const hasBody = typeof (payload as { body?: unknown } | null)?.body !== "undefined";
  const hasIsActive = typeof (payload as { isActive?: unknown } | null)?.isActive !== "undefined";

  if (!hasName && !hasSubject && !hasBody && !hasIsActive) {
    return NextResponse.json({ success: false, message: "No fields to update." }, { status: 400 });
  }

  if (hasName && name.length < 2) {
    return NextResponse.json({ success: false, message: "Template name is required." }, { status: 400 });
  }

  if (hasSubject && subject.length < 2) {
    return NextResponse.json({ success: false, message: "Email subject is required." }, { status: 400 });
  }

  if (hasBody && body.length < 2) {
    return NextResponse.json({ success: false, message: "Email body is required." }, { status: 400 });
  }

  if (hasIsActive && isActive === null) {
    return NextResponse.json({ success: false, message: "Invalid active flag." }, { status: 400 });
  }

  const item = await updateEmailTemplate(id, {
    ...(hasName ? { name } : {}),
    ...(hasSubject ? { subject } : {}),
    ...(hasBody ? { body } : {}),
    ...(hasIsActive && isActive !== null ? { isActive } : {}),
  });

  if (!item) {
    return NextResponse.json({ success: false, message: "Template not found." }, { status: 404 });
  }

  await createAdminAuditEntry({
    category: "audit",
    module: "Email & Notifications",
    action: "Updated Email Template",
    target: `${item.id} - ${item.name}`,
  });

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

  const deleteAll = Boolean(
    payload && typeof payload === "object" ? (payload as { deleteAll?: boolean }).deleteAll : false,
  );

  if (deleteAll) {
    await deleteAllEmailTemplates();
    await createAdminAuditEntry({
      category: "audit",
      module: "Email & Notifications",
      action: "Deleted All Email Templates",
      target: "All templates",
    });

    return NextResponse.json({ success: true });
  }

  const id = parseNonEmptyString(payload && typeof payload === "object" ? (payload as { id?: string }).id : "");

  if (!id) {
    return NextResponse.json({ success: false, message: "Template id is required." }, { status: 400 });
  }

  const deleted = await deleteEmailTemplate(id);

  if (!deleted) {
    return NextResponse.json({ success: false, message: "Template not found." }, { status: 404 });
  }

  await createAdminAuditEntry({
    category: "audit",
    module: "Email & Notifications",
    action: "Deleted Email Template",
    target: id,
  });

  return NextResponse.json({ success: true });
}
