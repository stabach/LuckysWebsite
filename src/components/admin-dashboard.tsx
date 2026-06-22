import { BarChart3, CreditCard, Image, Lock, Package, ReceiptText, ShieldCheck, Users } from "lucide-react";
import { hasSupabaseServerEnv, hasSupabaseServiceEnv } from "@/lib/supabase/server";

const adminModules = [
  {
    icon: Package,
    title: "Product management",
    description: "Create products, edit fitment, manage specs, and curate featured products."
  },
  {
    icon: CreditCard,
    title: "Checkout",
    description: "Stripe Checkout powers payments, customer contact collection, taxes when enabled, and receipts."
  },
  {
    icon: ReceiptText,
    title: "Orders",
    description: "Stripe webhooks can save paid orders, checkout items, pickup notes, and payment status to Supabase."
  },
  {
    icon: Users,
    title: "Customers",
    description: "Review customer profiles, saved builds, wishlists, and order history."
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Monitor product interest, builder conversion, shelf shares, and cart activity."
  },
  {
    icon: Image,
    title: "Gallery",
    description: "Manage inspiration setups, product media, and display room imagery."
  },
  {
    icon: ShieldCheck,
    title: "Access control",
    description: "Admin users are separated from customers and enforced through Supabase RLS."
  }
];

export function AdminDashboard() {
  const supabaseConfigured = hasSupabaseServerEnv();
  const serviceConfigured = hasSupabaseServiceEnv();
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
  const webhookConfigured = Boolean(process.env.STRIPE_WEBHOOK_SECRET);

  return (
    <div className="bg-obsidian pt-16">
      <section className="border-b border-white/10 bg-black py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-champagne">
            Admin architecture
          </p>
          <div className="mt-5 grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <h1 className="text-4xl font-semibold text-white text-balance sm:text-6xl">
              Secure management for the showroom.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/62">
              This route is designed to sit behind Supabase Auth and admin-user RLS policies.
              Public product browsing remains open while private customer, payment, and pickup data
              stays protected.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3 border border-white/12 bg-white/[0.035] p-4">
          <Lock className="shrink-0 text-champagne" size={20} />
          <p className="text-sm leading-6 text-white/62">
            Supabase browser environment is {supabaseConfigured ? "configured" : "not configured yet"}.
            Service role order recording is {serviceConfigured ? "configured" : "not configured yet"}.
            Stripe checkout is {stripeConfigured ? "configured" : "not configured yet"} and webhooks are{" "}
            {webhookConfigured ? "configured" : "not configured yet"}. Run
            `supabase/checkout_migration.sql` and `supabase/account_migration.sql` if your database
            already exists.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {adminModules.map(({ icon: Icon, title, description }) => (
            <article key={title} className="border border-white/12 bg-white/[0.035] p-6">
              <Icon className="text-champagne" size={22} />
              <h2 className="mt-5 text-xl font-semibold text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/58">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
