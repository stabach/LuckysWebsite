import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contactCategories = ["General Inquiry", "Order Problem", "Other"] as const;
const contactEmail = "LuckysLootSupplies@gmail.com";

type ContactCategory = (typeof contactCategories)[number];

type ContactPayload = {
  category?: unknown;
  name?: unknown;
  email?: unknown;
  orderNumber?: unknown;
  subject?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid contact form payload." }, { status: 400 });
  }

  const category = sanitize(payload.category);
  const name = sanitize(payload.name);
  const email = sanitize(payload.email);
  const orderNumber = sanitize(payload.orderNumber);
  const subject = sanitize(payload.subject);
  const message = sanitize(payload.message);

  if (!isContactCategory(category)) {
    return NextResponse.json({ error: "Please choose a valid category." }, { status: 400 });
  }

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Please fill out every required field." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Email is not configured yet. Add RESEND_API_KEY to .env.local before using the contact form."
      },
      { status: 503 }
    );
  }

  const emailSubject = `[${category}] ${subject}`;
  const text = [
    `Category: ${category}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Order Number: ${orderNumber || "N/A"}`,
    "",
    "Message:",
    message
  ].join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.55;">
      <h2>Lucky's Loot Contact Form</h2>
      <p><strong>Category:</strong> ${escapeHtml(category)}</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Order Number:</strong> ${escapeHtml(orderNumber || "N/A")}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <hr />
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Lucky's Loot Contact <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || contactEmail],
      reply_to: email,
      subject: emailSubject,
      text,
      html
    })
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Message could not be sent. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

function sanitize(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 4000) : "";
}

function isContactCategory(value: string): value is ContactCategory {
  return contactCategories.includes(value as ContactCategory);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
