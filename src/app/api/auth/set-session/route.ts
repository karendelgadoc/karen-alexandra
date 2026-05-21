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
  if (!process.env.NEXT_PUBLIC_INSFORGE_URL) {
    console.error("[set-session] NEXT_PUBLIC_INSFORGE_URL env var not set");
    return NextResponse.json(
      { error: "Server misconfigured: NEXT_PUBLIC_INSFORGE_URL is not set" },
      { status: 500 }
    );
  }

  let userEmail: string | null = null;
  try {
    // isServerMode: true is REQUIRED here. Without it, getCurrentUser()
    // reads from tokenManager.getSession() (browser sessionStorage), which
    // is empty in a Node route → returns { user: null }. Server mode makes
    // it hit /api/auth/sessions/current with the bearer token directly.
    const insforge = createClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
      isServerMode: true,
    });
    insforge.setAccessToken(token);
    const { data, error } = await insforge.auth.getCurrentUser();
    if (error || !data?.user?.email) {
      console.error("[set-session] getCurrentUser failed", { error, hasUser: !!data?.user });
      return NextResponse.json(
        { error: `Token verification failed: ${error?.message ?? "no user returned"}` },
        { status: 401 }
      );
    }
    userEmail = String(data.user.email).toLowerCase();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[set-session] verification threw", msg);
    return NextResponse.json(
      { error: `Could not verify token: ${msg}` },
      { status: 401 }
    );
  }

  // Email allowlist — even a valid Google sign-in must match an admin email
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    console.warn("[set-session] email not on allowlist", { userEmail, allowlist: ADMIN_EMAILS });
    return NextResponse.json(
      { error: `Account ${userEmail ?? "(unknown)"} is not on the admin allowlist. Allowed: ${ADMIN_EMAILS.join(", ")}` },
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
