import { NextResponse } from "next/server";

import { createContactSubmission } from "@/lib/contact-submissions-store";
import { contactFormSchema } from "@/lib/validators/contact";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request payload.",
      },
      { status: 400 },
    );
  }

  const parsed = contactFormSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid request.",
      },
      { status: 400 },
    );
  }

  await createContactSubmission(parsed.data);

  return NextResponse.json({
    success: true,
    message: "Thanks. Your request has been received and our team will follow up shortly.",
  });
}
