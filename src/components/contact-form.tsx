"use client";

import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ContactCategory = "General Inquiry" | "Order Problem" | "Other";

type ContactFormState = {
  category: ContactCategory;
  name: string;
  email: string;
  orderNumber: string;
  subject: string;
  message: string;
};

const initialFormState: ContactFormState = {
  category: "General Inquiry",
  name: "",
  email: "",
  orderNumber: "",
  subject: "",
  message: ""
};

const contactCategories: ContactCategory[] = ["General Inquiry", "Order Problem", "Other"];

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Message could not be sent.");
      }

      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Message could not be sent.");
    }
  }

  if (status === "success") {
    return (
      <section className="min-h-screen bg-[#050505] px-4 pb-16 pt-28 text-[#e7e0cf] sm:px-6 sm:pt-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] category-star-fade opacity-60" />
        <div className="relative mx-auto grid max-w-3xl justify-items-center rounded-[8px] border border-[#d4af37]/24 bg-[#111111]/88 p-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.36)] sm:p-12">
          <CheckCircle2 className="text-[#d4af37]" size={54} />
          <p className="mt-6 font-pixel text-[0.72rem] uppercase leading-6 text-[#d4af37]">
            Message Sent
          </p>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
            Thanks for reaching out.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#b8b0a0] sm:text-base">
            Your message was sent to Lucky&apos;s Loot. We&apos;ll review it and get back to you as soon as possible.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[8px] border border-[#d4af37] bg-[#d4af37] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-[#f3d65c] focus-ring"
          >
            Back Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] px-4 pb-16 pt-28 text-[#e7e0cf] sm:px-6 sm:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] category-star-fade opacity-70" />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div>
          <p className="font-pixel text-[0.7rem] uppercase leading-6 text-[#d4af37]">
            Contact Lucky&apos;s Loot
          </p>
          <h1 className="gold-glow mt-5 text-4xl font-bold leading-tight text-[#d4af37] sm:text-6xl">
            Send us a message.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#b8b0a0]">
            Choose the closest category and include the details we&apos;ll need to help with products, orders, or pickup questions.
          </p>
          <div className="mt-8 rounded-[8px] border border-[#d4af37]/18 bg-black/42 p-5">
            <Mail className="text-[#d4af37]" size={21} />
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Messages send to
            </p>
            <p className="mt-2 text-sm text-[#b8b0a0]">LuckysLootSupplies@gmail.com</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-[8px] border border-[#d4af37]/24 bg-[#111111]/88 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.34)] sm:p-7"
        >
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-white">Category</span>
            <select
              className="h-12 rounded-[8px] border border-[#d4af37]/22 bg-black px-3 text-[#e7e0cf] outline-none transition focus:border-[#d4af37]"
              value={form.category}
              onChange={(event) => updateField("category", event.target.value as ContactCategory)}
              required
            >
              {contactCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white">Name</span>
              <input
                className="h-12 rounded-[8px] border border-[#d4af37]/22 bg-black px-3 text-[#e7e0cf] outline-none transition focus:border-[#d4af37]"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white">Email</span>
              <input
                className="h-12 rounded-[8px] border border-[#d4af37]/22 bg-black px-3 text-[#e7e0cf] outline-none transition focus:border-[#d4af37]"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
                type="email"
                required
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white">Order Number <span className="text-[#8d866f]">(If applicable)</span></span>
              <input
                className="h-12 rounded-[8px] border border-[#d4af37]/22 bg-black px-3 text-[#e7e0cf] outline-none transition focus:border-[#d4af37]"
                value={form.orderNumber}
                onChange={(event) => updateField("orderNumber", event.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white">Subject</span>
              <input
                className="h-12 rounded-[8px] border border-[#d4af37]/22 bg-black px-3 text-[#e7e0cf] outline-none transition focus:border-[#d4af37]"
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                required
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-white">Message</span>
            <textarea
              className="min-h-40 rounded-[8px] border border-[#d4af37]/22 bg-black px-3 py-3 text-[#e7e0cf] outline-none transition focus:border-[#d4af37]"
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              required
            />
          </label>

          {status === "error" ? (
            <p className="rounded-[8px] border border-red-400/30 bg-red-950/30 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#d4af37] bg-[#d4af37] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-[#f3d65c] disabled:cursor-not-allowed disabled:opacity-60 focus-ring"
            type="submit"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
