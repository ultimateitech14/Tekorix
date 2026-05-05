import { NextResponse } from "next/server";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:4001";

function resolveApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
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
    const response = await fetch(`${resolveApiBaseUrl()}/api/v1/job-applications`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });
    const payload = await response.text();

    return new NextResponse(payload, {
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
        message: "Unable to submit application right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
