import { NextResponse } from "next/server";
import { env } from "@/lib/env";

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

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/api/v1/contact-submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const responseText = await response.text();

    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit your request right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
