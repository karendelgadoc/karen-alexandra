import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO_ADDRESS = "delgado.alexandra.karen@gmail.com";

const FROM_ADDRESS = "Karen Alexandra <studio@karenalexandra.com>";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    body = await req.json();
  } else {
    const formData = await req.formData();
    body = Object.fromEntries(
      [...formData.entries()].map(([k, v]) => [k, String(v)])
    );
  }

  // Honeypot check
  if (body._honeypot) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, message, type, brand } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const to = TO_ADDRESS;
  const subject = type
    ? `[${type}] Inquiry from ${name}`
    : `Inquiry from ${name}`;

  const html = `
    <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
    ${brand ? `<p><strong>Brand / Publication:</strong> ${brand}</p>` : ""}
    ${type ? `<p><strong>Inquiry type:</strong> ${type}</p>` : ""}
    <hr/>
    <p style="white-space:pre-wrap">${message}</p>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
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

  // Redirect back with success indicator
  const referer = req.headers.get("referer") ?? "/contact";
  const url = new URL(referer);
  url.searchParams.set("sent", "1");
  return NextResponse.redirect(url.toString(), { status: 303 });
}
