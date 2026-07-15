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
import { formatCurrency } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const accountLinks = [
  { href: "/account", label: "Overview", key: "overview" },
  { href: "/account/orders", label: "Orders", key: "orders" },
  { href: "/account/profile", label: "Profile", key: "profile" }
] as const;

export function AccountPageShell({ children }: { children: ReactNode }) {
  return <div className="account-page section-shell">{children}</div>;
}

export function AuthSetupNotice() {
  const isDevelopment = process.env.NODE_ENV !== "production";

  return (
    <AccountPageShell>
      <section className="account-setup-notice">
        <ShieldCheck aria-hidden="true" size={34} />
        <p className="eyebrow">Customer account</p>
        <h1>{isDevelopment ? "Account setup is incomplete." : "Account access is temporarily unavailable."}</h1>
        {isDevelopment ? (
          <p>
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            to enable customer login and protected order history in this environment.
          </p>
        ) : (
          <p>
            Shopping and secure guest checkout remain available. Contact Lucky’s Loot if you need
            help locating an existing paid order.
          </p>
        )}
        <div className="button-row">
          <Link className="button button-primary" href="/shop">
            Shop supplies
          </Link>
          <Link className="button button-secondary" href="/contact?topic=account">
            Ask for account help
          </Link>
        </div>
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
    <section className="account-hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="account-identity">
          <strong>{getProfileDisplayName(profile)}</strong>
          <span aria-hidden="true">/</span>
          <span>{profile.email}</span>
        </div>
      </div>
      {children ? <div className="account-hero-actions">{children}</div> : null}
    </section>
  );
}

export function AccountTabs({ current }: { current: "overview" | "orders" | "profile" }) {
  return (
    <nav className="account-tabs" aria-label="Customer account">
      {accountLinks.map((link) => (
        <Link
          key={link.href}
          className={cn("account-tab", current === link.key && "is-active")}
          href={link.href}
          aria-current={current === link.key ? "page" : undefined}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function AccountMetricGrid({ orders }: { orders: AccountOrder[] }) {
  const latestOrder = orders[0];
  const recentTotal = orders.reduce((total, order) => total + order.totalCents, 0);

  return (
    <div className="account-metric-grid">
      <MetricCard icon={ReceiptText} label="Recent orders" value={`${orders.length}`} />
      <MetricCard icon={CreditCard} label="Recent total" value={formatCurrency(recentTotal)} />
      <MetricCard
        icon={Truck}
        label="Latest status"
        value={latestOrder?.fulfillmentStatus || latestOrder?.status || "No orders"}
      />
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
    <article className="account-metric-card">
      <Icon aria-hidden="true" size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
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
    <Link className="account-action-card" href={href}>
      <div>
        <Icon aria-hidden="true" size={20} />
        <ArrowRight aria-hidden="true" size={17} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </Link>
  );
}

export function OrderCard({ order }: { order: AccountOrder }) {
  return (
    <article className="account-order-card">
      <div className="account-order-head">
        <div>
          <p>{order.orderNumber}</p>
          <div className="account-statuses">
            <StatusBadge label={order.status} />
            {order.paymentStatus ? <StatusBadge label={order.paymentStatus} subtle /> : null}
            {order.fulfillmentStatus ? <StatusBadge label={order.fulfillmentStatus} subtle /> : null}
          </div>
        </div>
        <div>
          <strong>{formatCurrency(order.totalCents)}</strong>
          <span>
            <CalendarDays aria-hidden="true" size={15} />
            {formatDate(order.createdAt)}
          </span>
        </div>
      </div>
      <OrderItemStrip items={order.items} />
      <div className="account-order-foot">
        <p>
          {order.items.length} line item{order.items.length === 1 ? "" : "s"}
        </p>
        <Link className="button button-secondary" href={`/account/orders/${order.id}`}>
          View details <ArrowRight aria-hidden="true" size={15} />
        </Link>
      </div>
    </article>
  );
}

export function EmptyOrders() {
  return (
    <section className="account-empty-orders">
      <ShoppingBag aria-hidden="true" size={34} />
      <h2>No orders yet.</h2>
      <p>Paid orders connected to your customer account will appear here.</p>
      <Link className="button button-primary" href="/shop">
        Shop supplies
      </Link>
    </section>
  );
}

export function OrderItemRows({ items }: { items: AccountOrderItem[] }) {
  return (
    <div className="account-order-items">
      {items.map((item) => (
        <article key={item.id}>
          <div className="account-item-image">
            <Image src={item.productImage} alt="" fill sizes="82px" />
          </div>
          <div>
            <h3>{item.productName}</h3>
            {item.variantName ? <p>{item.variantName}</p> : null}
            <span>Quantity {item.quantity}</span>
          </div>
          <div className="account-item-price">
            <span>{formatCurrency(item.unitPriceCents)} each</span>
            <strong>{formatCurrency(item.totalPriceCents)}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

export function OrderTotals({ order }: { order: AccountOrder }) {
  return (
    <DetailPanel title="Order totals">
      <TotalLine label="Subtotal" value={order.subtotalCents} />
      {order.discountCents > 0 ? <TotalLine label="Discounts" value={-order.discountCents} /> : null}
      {order.shippingCents > 0 ? <TotalLine label="Shipping" value={order.shippingCents} /> : null}
      <TotalLine label="Taxes" value={order.taxCents} />
      <div className="account-total-final">
        <span>Total</span>
        <strong>{formatCurrency(order.totalCents)}</strong>
      </div>
    </DetailPanel>
  );
}

export function DetailPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="account-panel">
      <h2>{title}</h2>
      <div className="account-detail-list">{children}</div>
    </section>
  );
}

export function AddressBlock({ address }: { address: AccountAddress | null }) {
  if (!address) return <p className="account-unavailable">Not available.</p>;

  const lines = [
    address.line1,
    address.line2,
    [address.city, address.state, address.postal_code].filter(Boolean).join(", "),
    address.country
  ].filter(Boolean);

  return (
    <address>
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </address>
  );
}

export function DetailLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="account-detail-line">
      <span>{label}</span>
      <strong>{value || "Not available"}</strong>
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
  return (
    <span className={cn("account-status", subtle && "is-subtle")}>
      {label.replaceAll("_", " ")}
    </span>
  );
}

function OrderItemStrip({ items }: { items: AccountOrderItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="account-item-strip" aria-label="Products in this order">
      {items.slice(0, 5).map((item) => (
        <div key={item.id} title={item.productName}>
          <Image src={item.productImage} alt="" fill sizes="48px" />
        </div>
      ))}
      {items.length > 5 ? <span>+{items.length - 5}</span> : null}
    </div>
  );
}

function TotalLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="account-total-line">
      <span>{label}</span>
      <strong>{formatCurrency(value)}</strong>
    </div>
  );
}

export const accountActionIcons = {
  orders: ReceiptText,
  profile: UserRound,
  package: Package
};
