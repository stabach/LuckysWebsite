import { NextResponse } from "next/server";
import { ContactPayloadSchema } from "@/lib/contact-schema";
import { consumeRateLimit, getRequestClientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contactEmail = "LuckysLootSupplies@gmail.com";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

export async function POST(request: Request) {
  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid contact form payload." }, { status: 400 });
  }

  const parsed = ContactPayloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Check the highlighted contact details." },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const clientKey = getRequestClientKey(request);
  if (!consumeRateLimit("contact", clientKey, Date.now(), {
    maximum: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS
  })) {
    return NextResponse.json(
      { error: "Too many messages were sent. Please wait before trying again." },
      { status: 429 }
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Message delivery is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const payload = parsed.data;
  const safeSubject = stripControlCharacters(payload.subject);
  const emailSubject = `[${payload.category}] ${safeSubject}`;
  const text = [
    `Category: ${payload.category}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Order Number: ${payload.orderNumber || "N/A"}`,
    `Product: ${payload.product || "N/A"}`,
    `Subject: ${safeSubject}`,
    "",
    "Message:",
    payload.message
  ].join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.55;">
      <h2>Lucky's Loot Contact Form</h2>
      <p><strong>Category:</strong> ${escapeHtml(payload.category)}</p>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p><strong>Order Number:</strong> ${escapeHtml(payload.orderNumber || "N/A")}</p>
      <p><strong>Product:</strong> ${escapeHtml(payload.product || "N/A")}</p>
      <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
      <hr />
      <p>${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Lucky's Loot Contact <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL || contactEmail],
        reply_to: payload.email,
        subject: emailSubject,
        text,
        html
      })
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Message could not be delivered. Please try again later." },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Message could not be delivered. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

function stripControlCharacters(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
