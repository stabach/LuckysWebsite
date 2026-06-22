import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  Package,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { AccountAddress, AccountOrder, AccountOrderItem, AccountProfile } from "@/lib/account";
import { getProfileDisplayName } from "@/lib/account";
import { formatStorefrontCurrency } from "@/lib/storefront-products";
import { cn } from "@/lib/utils";

const accountLinks = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/profile", label: "Profile" }
];

export function AccountPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 pb-16 pt-28 text-[#e7e0cf] sm:px-6">
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  );
}

export function AuthSetupNotice() {
  return (
    <AccountPageShell>
      <section className="rounded-[8px] border border-[#d4af37]/24 bg-[#111111] p-6 text-center shadow-[0_18px_60px_rgba(0,0,0,0.42)] sm:p-10">
        <ShieldCheck className="mx-auto text-[#d4af37]" size={34} />
        <h1 className="mt-5 text-3xl font-bold text-[#d4af37]">Account setup needed</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#b8b0a0]">
          Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable customer
          login, profiles, and protected order history.
        </p>
      </section>
    </AccountPageShell>
  );
}

export function AccountHero({
  profile,
  eyebrow,
  title,
  description,
  children
}: {
  profile: AccountProfile;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-[#d4af37]/24 bg-[#111111] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.42)] sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-pixel text-[0.68rem] uppercase leading-6 text-[#d4af37]">{eyebrow}</p>
          <h1 className="gold-glow mt-4 text-3xl font-bold text-[#d4af37] sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b8b0a0]">{description}</p>
          <p className="mt-4 text-sm text-white">
            {getProfileDisplayName(profile)} <span className="text-[#8d866f]">/</span>{" "}
            <span className="text-[#b8b0a0]">{profile.email}</span>
          </p>
        </div>
        {children ? <div className="flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}

export function AccountTabs({ current }: { current: "overview" | "orders" | "profile" }) {
  return (
    <nav className="mt-5 grid gap-2 sm:grid-cols-3" aria-label="Customer account">
      {accountLinks.map((link) => {
        const active =
          (current === "overview" && link.href === "/account") ||
          (current === "orders" && link.href === "/account/orders") ||
          (current === "profile" && link.href === "/account/profile");

        return (
          <Link
            key={link.href}
            className={cn(
              "rounded-[8px] border px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] transition focus-ring",
              active
                ? "border-[#d4af37] bg-[#d4af37] text-black"
                : "border-[#d4af37]/18 bg-[#111111] text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10"
            )}
            href={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AccountMetricGrid({ orders }: { orders: AccountOrder[] }) {
  const latestOrder = orders[0];
  const paidTotal = orders.reduce((total, order) => total + order.totalCents, 0);

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <MetricCard icon={ReceiptText} label="Orders" value={`${orders.length}`} />
      <MetricCard icon={CreditCard} label="Lifetime total" value={formatStorefrontCurrency(paidTotal)} />
      <MetricCard icon={Truck} label="Latest status" value={latestOrder?.fulfillmentStatus || latestOrder?.status || "No orders"} />
    </div>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  value
}: {
  icon: typeof ReceiptText;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-[8px] border border-[#d4af37]/16 bg-[#111111] p-5">
      <Icon className="text-[#d4af37]" size={20} />
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#8d866f]">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </article>
  );
}

export function ActionCard({
  href,
  icon: Icon,
  title,
  description
}: {
  href: string;
  icon: typeof ReceiptText;
  title: string;
  description: string;
}) {
  return (
    <Link
      className="group rounded-[8px] border border-[#d4af37]/16 bg-[#111111] p-5 transition hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 focus-ring"
      href={href}
    >
      <div className="flex items-start justify-between gap-4">
        <Icon className="text-[#d4af37]" size={20} />
        <ArrowRight className="text-[#8d866f] transition group-hover:text-[#d4af37]" size={17} />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#b8b0a0]">{description}</p>
    </Link>
  );
}

export function OrderCard({ order }: { order: AccountOrder }) {
  return (
    <article className="rounded-[8px] border border-[#d4af37]/16 bg-[#111111] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-pixel text-[0.62rem] uppercase leading-5 text-[#d4af37]">
            {order.orderNumber}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge label={order.status} />
            {order.paymentStatus ? <StatusBadge label={order.paymentStatus} subtle /> : null}
            {order.fulfillmentStatus ? <StatusBadge label={order.fulfillmentStatus} subtle /> : null}
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-lg font-semibold text-white">{formatStorefrontCurrency(order.totalCents)}</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-[#8d866f] sm:justify-end">
            <CalendarDays size={15} />
            {formatDate(order.createdAt)}
          </p>
        </div>
      </div>
      <OrderItemStrip items={order.items} />
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#b8b0a0]">
          {order.items.length} item{order.items.length === 1 ? "" : "s"} purchased
        </p>
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-[#d4af37]/32 px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
          href={`/account/orders/${order.id}`}
        >
          View details
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

export function EmptyOrders() {
  return (
    <section className="grid min-h-80 place-items-center rounded-[8px] border border-dashed border-[#d4af37]/24 bg-[#111111] p-8 text-center">
      <div>
        <ShoppingBag className="mx-auto text-[#d4af37]" size={34} />
        <h2 className="mt-5 text-2xl font-semibold text-white">You don&apos;t have any orders yet.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#b8b0a0]">
          Your paid Lucky&apos;s Loot orders will appear here after checkout.
        </p>
        <Link
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-[8px] border border-[#d4af37] bg-[#d4af37] px-6 py-3 font-pixel text-[0.62rem] uppercase text-black transition hover:bg-[#fff4bd] focus-ring"
          href="/products"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

export function OrderItemRows({ items }: { items: AccountOrderItem[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <article
          className="grid gap-4 rounded-[8px] border border-[#d4af37]/16 bg-black/24 p-4 sm:grid-cols-[82px_1fr_auto]"
          key={item.id}
        >
          <div className="relative h-[82px] w-[82px] overflow-hidden rounded-[8px] border border-[#d4af37]/18 bg-black">
            <Image src={item.productImage} alt="" fill className="object-contain p-2" sizes="82px" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{item.productName}</h3>
            {item.variantName ? <p className="mt-1 text-sm text-[#b8b0a0]">{item.variantName}</p> : null}
            <p className="mt-2 text-sm text-[#8d866f]">Quantity {item.quantity}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-[#b8b0a0]">{formatStorefrontCurrency(item.unitPriceCents)} each</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {formatStorefrontCurrency(item.totalPriceCents)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function OrderTotals({ order }: { order: AccountOrder }) {
  return (
    <div className="rounded-[8px] border border-[#d4af37]/16 bg-[#111111] p-5">
      <h2 className="text-lg font-semibold text-white">Order totals</h2>
      <div className="mt-5 grid gap-3">
        <TotalLine label="Subtotal" value={order.subtotalCents} />
        {order.discountCents > 0 ? <TotalLine label="Discounts" value={-order.discountCents} /> : null}
        <TotalLine label="Shipping" value={order.shippingCents} />
        <TotalLine label="Taxes" value={order.taxCents} />
        <div className="mt-2 flex items-center justify-between border-t border-[#d4af37]/16 pt-4">
          <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d4af37]">Total</span>
          <strong className="text-xl text-white">{formatStorefrontCurrency(order.totalCents)}</strong>
        </div>
      </div>
    </div>
  );
}

export function DetailPanel({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-[#d4af37]/16 bg-[#111111] p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4 grid gap-3 text-sm leading-6 text-[#b8b0a0]">{children}</div>
    </section>
  );
}

export function AddressBlock({ address }: { address: AccountAddress | null }) {
  if (!address) {
    return <p className="text-[#8d866f]">Not available yet.</p>;
  }

  const lines = [
    address.line1,
    address.line2,
    [address.city, address.state, address.postal_code].filter(Boolean).join(", "),
    address.country
  ].filter(Boolean);

  return (
    <address className="not-italic">
      {lines.map((line) => (
        <span className="block" key={line}>
          {line}
        </span>
      ))}
    </address>
  );
}

export function DetailLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#d4af37]/10 pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs uppercase tracking-[0.16em] text-[#8d866f]">{label}</span>
      <span className="max-w-[15rem] text-right text-white break-words">{value || "Not available"}</span>
    </div>
  );
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function StatusBadge({ label, subtle = false }: { label: string; subtle?: boolean }) {
  const normalized = label.replaceAll("_", " ");

  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
        subtle
          ? "border-[#d4af37]/16 bg-white/[0.03] text-[#b8b0a0]"
          : "border-[#d4af37]/36 bg-[#d4af37]/12 text-[#f4df91]"
      )}
    >
      {normalized}
    </span>
  );
}

function OrderItemStrip({ items }: { items: AccountOrderItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 flex -space-x-3 overflow-hidden">
      {items.slice(0, 5).map((item) => (
        <div
          className="relative h-12 w-12 overflow-hidden rounded-full border border-[#d4af37]/24 bg-black"
          key={item.id}
          title={item.productName}
        >
          <Image src={item.productImage} alt="" fill className="object-contain p-1.5" sizes="48px" />
        </div>
      ))}
      {items.length > 5 ? (
        <span className="grid h-12 w-12 place-items-center rounded-full border border-[#d4af37]/24 bg-[#111111] text-xs font-semibold text-[#d4af37]">
          +{items.length - 5}
        </span>
      ) : null}
    </div>
  );
}

function TotalLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[#b8b0a0]">{label}</span>
      <span className="text-sm font-semibold text-white">{formatStorefrontCurrency(value)}</span>
    </div>
  );
}

export const accountActionIcons = {
  orders: ReceiptText,
  profile: UserRound,
  package: Package
};
