import type { Metadata } from "next";
import type { ComponentType } from "react";
import { Mail, MapPin, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Lucky's Loot for product support, fitment questions, and collector display planning."
};

export default function ContactPage() {
  const contactMethods: Array<{
    icon: ComponentType<{ size?: number; className?: string }>;
    title: string;
    label: string;
  }> = [
    { icon: Mail, title: "support@luckysloot.example", label: "Product support" },
    { icon: MessageSquare, title: "Display planning", label: "Collection Builder help" },
    { icon: MapPin, title: "United States", label: "Online showroom" }
  ];

  return (
    <div className="bg-obsidian pt-16">
      <section className="border-b border-white/10 bg-black py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-champagne">
            Contact
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold text-white text-balance sm:text-6xl">
            Fitment questions, shelf planning, and product support.
          </h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="grid gap-4">
          {contactMethods.map(({ icon: Icon, title, label }) => (
            <div key={title} className="border border-white/12 bg-white/[0.035] p-5">
              <Icon className="text-champagne" size={20} />
              <p className="mt-4 text-lg font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-white/50">{label}</p>
            </div>
          ))}
        </div>
        <form className="grid gap-4 border border-white/12 bg-white/[0.035] p-5 sm:p-6">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-white">Name</span>
            <input className="h-12 border border-white/12 bg-black px-3 text-white outline-none focus:border-champagne" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-white">Email</span>
            <input className="h-12 border border-white/12 bg-black px-3 text-white outline-none focus:border-champagne" type="email" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-white">Message</span>
            <textarea className="min-h-36 border border-white/12 bg-black px-3 py-3 text-white outline-none focus:border-champagne" />
          </label>
          <button
            className="inline-flex h-12 items-center justify-center border border-champagne bg-champagne px-5 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-linen focus-ring"
            type="button"
          >
            Send message
          </button>
        </form>
      </section>
    </div>
  );
}
