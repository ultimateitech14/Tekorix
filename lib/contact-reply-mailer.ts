import "server-only";

import nodemailer from "nodemailer";

type SendContactReplyEmailInput = {
  toEmail: string;
  fromEmail: string;
  subject: string;
  message: string;
};

function parseSmtpPort(value: string | undefined) {
  const parsed = Number(value);

  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }

  return 587;
}

function parseSmtpSecure(value: string | undefined) {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim() ?? "";
  const user = process.env.SMTP_USER?.trim() ?? "";
  const pass = process.env.SMTP_PASS ?? "";

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port: parseSmtpPort(process.env.SMTP_PORT),
    secure: parseSmtpSecure(process.env.SMTP_SECURE),
    auth: {
      user,
      pass,
    },
  };
}

function buildHtml(message: string) {
  const escaped = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br/>");

  return `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">${escaped}</div>`;
}

export async function sendContactReplyEmail(payload: SendContactReplyEmailInput) {
  const config = getSmtpConfig();

  if (!config) {
    return {
      sent: false,
      error: "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE.",
    } as const;
  }

  try {
    const transport = nodemailer.createTransport(config);

    await transport.sendMail({
      from: payload.fromEmail,
      to: payload.toEmail,
      subject: payload.subject,
      text: payload.message,
      html: buildHtml(payload.message),
      replyTo: payload.fromEmail,
    });

    return {
      sent: true,
      error: null,
    } as const;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email reply.";

    return {
      sent: false,
      error: message,
    } as const;
  }
}

