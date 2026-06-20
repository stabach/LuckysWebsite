import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout Cancelled",
  description: "Return to Lucky's Loot checkout."
};

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 pb-16 pt-28 text-[#e7e0cf] sm:px-6">
      <section className="mx-auto max-w-2xl rounded-[8px] border border-[#d4af37]/24 bg-[#111111] p-6 text-center shadow-[0_18px_60px_rgba(0,0,0,0.42)] sm:p-10">
        <p className="font-pixel text-[0.7rem] uppercase leading-6 text-[#d4af37]">Checkout paused</p>
        <h1 className="gold-glow mt-5 text-4xl font-bold text-[#d4af37] sm:text-5xl">
          No worries. Your cart is still here.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#b8b0a0] sm:text-base">
          You can return to the storefront, adjust quantities, or send an inquiry if you want to
          confirm pickup details first.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex min-h-12 items-center justify-center rounded-[8px] border border-[#d4af37] bg-[#d4af37] px-6 py-3 font-pixel text-[0.62rem] uppercase text-black transition hover:bg-[#fff4bd] focus-ring"
          >
            Back to Products
          </Link>
          <a
            href="mailto:LuckysLootSupplies@gmail.com?subject=Cart%20Question"
            className="inline-flex min-h-12 items-center justify-center rounded-[8px] border border-[#d4af37]/40 px-6 py-3 font-pixel text-[0.62rem] uppercase text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
          >
            Ask a Question
          </a>
        </div>
      </section>
    </div>
  );
}
