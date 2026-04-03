import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createAdminAuditEntry } from "@/lib/admin-audit-store";
import { getEmailTemplateById } from "@/lib/email-templates-store";
import { sendContactReplyEmail } from "@/lib/contact-reply-mailer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAuthorized() {
  return Boolean(cookies().get("admin_auth")?.value);
}

function parseNonEmptyString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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

  const templateId = parseNonEmptyString(
    payload && typeof payload === "object" ? (payload as { templateId?: string }).templateId : "",
  );
  const toEmail = parseNonEmptyString(
    payload && typeof payload === "object" ? (payload as { toEmail?: string }).toEmail : "",
  );
  const fromEmail = parseNonEmptyString(
    payload && typeof payload === "object" ? (payload as { fromEmail?: string }).fromEmail : "",
  );
  const subjectOverride = parseNonEmptyString(
    payload && typeof payload === "object" ? (payload as { subject?: string }).subject : "",
  );
  const bodyOverride = parseNonEmptyString(
    payload && typeof payload === "object" ? (payload as { body?: string }).body : "",
  );

  if (!templateId) {
    return NextResponse.json({ success: false, message: "Template id is required." }, { status: 400 });
  }

  if (!toEmail || !toEmail.includes("@")) {
    return NextResponse.json({ success: false, message: "Valid recipient email is required." }, { status: 400 });
  }

  if (!fromEmail || !fromEmail.includes("@")) {
    return NextResponse.json({ success: false, message: "Valid sender email is required." }, { status: 400 });
  }

  const template = await getEmailTemplateById(templateId);

  if (!template) {
    return NextResponse.json({ success: false, message: "Template not found." }, { status: 404 });
  }

  if (!template.isActive) {
    return NextResponse.json({ success: false, message: "Template is inactive. Please activate first." }, { status: 400 });
  }

  const subject = subjectOverride || template.subject;
  const message = bodyOverride || template.body;

  const emailResult = await sendContactReplyEmail({
    toEmail,
    fromEmail,
    subject,
    message,
  });

  await createAdminAuditEntry({
    category: "notification",
    module: "Email & Notifications",
    action: emailResult.sent ? "Sent Template Email" : "Failed Template Email",
    target: `${template.id} - ${template.name} -> ${toEmail} -> ${emailResult.sent ? "sent" : "failed"}`,
  });

  return NextResponse.json(
    {
      success: emailResult.sent,
      message: emailResult.sent ? "Email sent successfully." : emailResult.error ?? "Unable to send email.",
      emailSent: emailResult.sent,
      emailError: emailResult.error,
    },
    {
      status: emailResult.sent ? 200 : 502,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
