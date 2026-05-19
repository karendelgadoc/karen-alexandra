import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO_ADDRESS = "delgado.alexandra.karen@gmail.com";
const FROM_ADDRESS = "Karen Alexandra <studio@karenalexandra.com>";

// ── Lightweight in-memory rate limiter ────────────────────────────────────────
// Per-IP, 1-minute sliding window, 3 messages max. Resets on cold start.
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;
const ipHits = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_REQUESTS_PER_WINDOW) {
    ipHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  if (ipHits.size > 1000) {
    for (const [k, v] of ipHits) {
      const fresh = v.filter((t) => now - t < WINDOW_MS);
      if (fresh.length === 0) ipHits.delete(k);
      else ipHits.set(k, fresh);
    }
  }
  return true;
}

// HTML entity escape — used to build the email body safely
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Same-origin redirect helper. Without this an attacker can craft a Referer
// header pointing at evil.com and use this endpoint as a phishing redirect.
function safeRedirectUrl(req: NextRequest, fallbackPath = "/contact"): URL {
  const base = new URL(req.url);
  const refererRaw = req.headers.get("referer");
  if (!refererRaw) return new URL(fallbackPath, base);
  try {
    const ref = new URL(refererRaw);
    if (ref.origin !== base.origin) return new URL(fallbackPath, base);
    return ref;
  } catch {
    return new URL(fallbackPath, base);
  }
}

export async function POST(req: NextRequest) {
  // ── Rate limit ─────────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body: Record<string, string>;
  const contentType = req.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = Object.fromEntries(
        [...formData.entries()].map(([k, v]) => [k, String(v)])
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot — silent success
  if (body._honeypot) return NextResponse.json({ ok: true });

  const { name, email, message, type, brand } = body;

  // ── Validation ────────────────────────────────────────────────────────────
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }
  if (name.length > 200 || email.length > 320 || message.length > 10_000 ||
      (brand?.length ?? 0) > 200 || (type?.length ?? 0) > 100) {
    return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }
  // Prevent CRLF in name/email — protects against any downstream header injection
  if (/[\r\n]/.test(email) || /[\r\n]/.test(name)) {
    return NextResponse.json({ error: "Invalid characters in name or email." }, { status: 400 });
  }

  const subject = type
    ? `[${type.slice(0, 60)}] Inquiry from ${name.slice(0, 80)}`
    : `Inquiry from ${name.slice(0, 80)}`;

  // ── Build HTML email — ALL user input is HTML-escaped ────────────────────
  const html = `
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    ${brand ? `<p><strong>Brand / Publication:</strong> ${escapeHtml(brand)}</p>` : ""}
    ${type ? `<p><strong>Inquiry type:</strong> ${escapeHtml(type)}</p>` : ""}
    <hr/>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject,
      html,
    });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json(
      { error: "Failed to send. Please try again or email directly." },
      { status: 500 }
    );
  }

  const url = safeRedirectUrl(req, "/contact");
  url.searchParams.set("sent", "1");
  return NextResponse.redirect(url.toString(), { status: 303 });
}
