import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let token: string;
  try {
    const body = await request.json();
    token = body.token;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });

  // Set as HttpOnly so JavaScript cannot read it (XSS protection)
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
