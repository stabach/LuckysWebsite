"use client";

import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { contactCategories, type ContactCategory } from "@/lib/contact-schema";

type ContactFormState = {
  category: ContactCategory;
  name: string;
  email: string;
  orderNumber: string;
  product: string;
  subject: string;
  message: string;
  website: string;
};

export function ContactForm({
  initialCategory,
  products
}: {
  initialCategory: ContactCategory;
  products: Array<{ id: string; name: string }>;
}) {
  const [form, setForm] = useState<ContactFormState>({
    category: initialCategory,
    name: "",
    email: "",
    orderNumber: "",
    product: "",
    subject: "",
    message: "",
    website: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const needsOrder = form.category === "Existing Order";
  const needsProduct = ["Product Fit Question", "Custom Engraving"].includes(form.category);

  function updateField<Key extends keyof ContactFormState>(field: Key, value: ContactFormState[Key]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Message could not be sent.");
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Message could not be sent.");
    }
  }

  if (status === "success") {
    return (
      <div className="info-page">
        <section className="contact-success section-shell">
          <CheckCircle2 aria-hidden="true" size={48} />
          <p className="eyebrow">Message sent</p>
          <h1>Thanks for reaching out.</h1>
          <p>Your message was delivered to Lucky’s Loot with your email set as the reply address.</p>
          <div className="button-row">
            <Link className="button button-primary" href="/shop">
              Return to shop
            </Link>
            <button className="button button-secondary" type="button" onClick={() => setStatus("idle")}>
              Send another message
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="info-page contact-page">
      <header className="info-hero section-shell">
        <p className="eyebrow">Contact Lucky’s Loot</p>
        <h1>Send the details. We’ll route the question.</h1>
        <p>
          Use the closest category so product-fit, order, pickup, bulk, or engraving questions arrive
          with the context needed to help.
        </p>
      </header>

      <section className="contact-layout section-shell">
        <aside className="contact-aside">
          <Mail aria-hidden="true" size={22} />
          <h2>Before you send</h2>
          <ul>
            <li>Include measurements for specialty boxes or non-PSA slabs.</li>
            <li>Use the order number from your receipt for paid-order questions.</li>
            <li>Do not send payment card details through this form.</li>
          </ul>
          <p>No response-time promise is published until the owner confirms one.</p>
        </aside>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <ContactSelect
            label="Category"
            value={form.category}
            onChange={(value) => updateField("category", value as ContactCategory)}
            options={contactCategories.map((category) => ({ value: category, label: category }))}
            required
          />

          <div className="contact-field-row">
            <ContactInput
              label="Name"
              value={form.name}
              onChange={(value) => updateField("name", value)}
              autoComplete="name"
              required
            />
            <ContactInput
              label="Email"
              value={form.email}
              onChange={(value) => updateField("email", value)}
              autoComplete="email"
              type="email"
              required
            />
          </div>

          {needsOrder ? (
            <ContactInput
              label="Order number"
              value={form.orderNumber}
              onChange={(value) => updateField("orderNumber", value)}
              autoComplete="off"
              required
            />
          ) : null}

          {needsProduct ? (
            <ContactSelect
              label="Product"
              value={form.product}
              onChange={(value) => updateField("product", value)}
              options={[
                { value: "", label: "Choose a product" },
                ...products.map((product) => ({ value: product.name, label: product.name })),
                { value: "Not sure", label: "I’m not sure" }
              ]}
              required
            />
          ) : null}

          <ContactInput
            label="Subject"
            value={form.subject}
            onChange={(value) => updateField("subject", value)}
            required
          />

          <label className="contact-field">
            <span>Message</span>
            <textarea
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              minLength={10}
              maxLength={4000}
              required
            />
          </label>

          <label className="contact-honeypot" aria-hidden="true">
            Website
            <input
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
              autoComplete="off"
              tabIndex={-1}
            />
          </label>

          {status === "error" ? <p className="contact-error" role="alert">{error}</p> : null}

          <button className="button button-primary contact-submit" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? (
              <Loader2 className="spin" aria-hidden="true" size={17} />
            ) : (
              <Send aria-hidden="true" size={17} />
            )}
            Send message
          </button>
        </form>
      </section>
    </div>
  );
}

function ContactInput({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="contact-field">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        autoComplete={autoComplete}
        required={required}
      />
    </label>
  );
}

function ContactSelect({
  label,
  value,
  onChange,
  options,
  required
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}) {
  return (
    <label className="contact-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} required={required}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
