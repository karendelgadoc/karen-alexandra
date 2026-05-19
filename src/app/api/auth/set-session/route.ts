import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

// Allowlist of admin email addresses. Comma-separated via env var ADMIN_EMAILS.
// Falls back to Karen's known addresses so a missing env var fails closed in dev too.
const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ??
  "karendelgadoc2@gmail.com,delgado.alexandra.karen@gmail.com"
)
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export async function POST(request: NextRequest) {
  let token: string;
  try {
    const body = await request.json();
    token = body.token;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!token || typeof token !== "string" || token.length < 20 || token.length > 4096) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  // ── Verify the token against InsForge before trusting it ──────────────────
  // Previously this endpoint accepted ANY string as `token` and set it as the
  // admin cookie. The middleware only checks for cookie *presence*, so anyone
  // could POST `{ "token": "x" }` and become admin.
  let userEmail: string | null = null;
  try {
    const insforge = createClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    });
    insforge.setAccessToken(token);
    const { data, error } = await insforge.auth.getCurrentUser();
    if (error || !data?.user?.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    userEmail = String(data.user.email).toLowerCase();
  } catch {
    return NextResponse.json({ error: "Could not verify token" }, { status: 401 });
  }

  // Email allowlist — even a valid Google sign-in must match an admin email
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    return NextResponse.json(
      { error: "This account is not authorized for admin access." },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ ok: true });

  // HttpOnly: JS cannot read (XSS-safe). Secure: HTTPS only in prod.
  // SameSite=Lax: blocks cross-site state-changing requests.
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
