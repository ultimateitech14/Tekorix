import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createAdminAuditEntry } from "@/lib/admin-audit-store";
import {
  addContactSubmissionReply,
  deleteAllContactSubmissions,
  deleteContactSubmission,
  getContactSubmissionById,
  getContactSubmissions,
  markAllContactSubmissionsAsRead,
  markContactSubmissionAsRead,
} from "@/lib/contact-submissions-store";
import { sendContactReplyEmail } from "@/lib/contact-reply-mailer";

function isAuthorized() {
  return Boolean(cookies().get("admin_auth")?.value);
}

export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const items = await getContactSubmissions();
  const unreadCount = items.filter((item) => !item.isRead).length;

  return NextResponse.json({
    success: true,
    items,
    unreadCount,
  });
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

  const id = payload && typeof payload === "object" ? (payload as { id?: string }).id : undefined;
  const markAll =
    payload && typeof payload === "object" ? Boolean((payload as { markAll?: boolean }).markAll) : false;
  const replyMessage =
    payload && typeof payload === "object" ? (payload as { replyMessage?: string }).replyMessage?.trim() : "";
  const replyFromEmail =
    payload && typeof payload === "object" ? (payload as { replyFromEmail?: string }).replyFromEmail?.trim() : "";

  if (markAll) {
    await markAllContactSubmissionsAsRead();
    await createAdminAuditEntry({
      category: "activity",
      module: "Email & Notifications",
      action: "Marked All Contact Submissions As Read",
      target: "All contact submissions",
    });
    return NextResponse.json({ success: true });
  }

  if (!id) {
    return NextResponse.json({ success: false, message: "Submission id is required." }, { status: 400 });
  }

  if (replyMessage) {
    const submission = await getContactSubmissionById(id);

    if (!submission) {
      return NextResponse.json({ success: false, message: "Submission not found." }, { status: 404 });
    }

    const fromEmail = replyFromEmail || "noreply@startupwork.dev";
    const subject = `Re: ${submission.inquiryType} inquiry from ${submission.firstName} ${submission.lastName}`;
    const emailResult = await sendContactReplyEmail({
      toEmail: submission.email,
      fromEmail,
      subject,
      message: replyMessage,
    });

    const updated = await addContactSubmissionReply(id, replyMessage, {
      fromEmail,
      toEmail: submission.email,
      deliveryStatus: emailResult.sent ? "sent" : "failed",
      deliveryError: emailResult.error,
    });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Submission not found." }, { status: 404 });
    }

    await createAdminAuditEntry({
      category: "activity",
      module: "Email & Notifications",
      action: "Sent Contact Submission Reply",
      target: `${id} - ${emailResult.sent ? "sent" : "failed"}`,
    });

    return NextResponse.json({
      success: true,
      item: updated,
      emailSent: emailResult.sent,
      emailError: emailResult.error,
    });
  }

  await markContactSubmissionAsRead(id);
  await createAdminAuditEntry({
    category: "activity",
    module: "Email & Notifications",
    action: "Marked Contact Submission As Read",
    target: id,
  });
  return NextResponse.json({ success: true });
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

  const id = payload && typeof payload === "object" ? (payload as { id?: string }).id : undefined;
  const deleteAll =
    payload && typeof payload === "object"
      ? Boolean((payload as { deleteAll?: boolean }).deleteAll)
      : false;

  if (deleteAll) {
    await deleteAllContactSubmissions();
    await createAdminAuditEntry({
      category: "activity",
      module: "Email & Notifications",
      action: "Deleted All Contact Submissions",
      target: "All contact submissions",
    });
    return NextResponse.json({ success: true });
  }

  if (!id) {
    return NextResponse.json({ success: false, message: "Submission id is required." }, { status: 400 });
  }

  const deleted = await deleteContactSubmission(id);

  if (!deleted) {
    return NextResponse.json({ success: false, message: "Submission not found." }, { status: 404 });
  }

  await createAdminAuditEntry({
    category: "activity",
    module: "Email & Notifications",
    action: "Deleted Contact Submission",
    target: id,
  });

  return NextResponse.json({ success: true });
}
