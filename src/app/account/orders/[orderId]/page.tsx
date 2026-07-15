import type { Metadata } from "next";
import Link from "next/link";
import {
  AccountHero,
  AccountPageShell,
  AccountTabs,
  AddressBlock,
  AuthSetupNotice,
  DetailLine,
  DetailPanel,
  OrderItemRows,
  OrderTotals,
  formatDate
} from "@/components/account/account-ui";
import { SignOutButton } from "@/components/account/sign-out-button";
import { storeEvents } from "@/data/events";
import { getCustomerOrderById, getRequiredAccountSession } from "@/lib/account";
import { formatCurrency } from "@/lib/catalog";
import { getEventById } from "@/lib/events";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View a Lucky's Loot order."
};

export const dynamic = "force-dynamic";

type OrderDetailPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function AccountOrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;
  const session = await getRequiredAccountSession(`/account/orders/${orderId}`);

  if (session.missingEnv) {
    return <AuthSetupNotice />;
  }

  const order = await getCustomerOrderById(session.supabase, session.user.id, orderId);

  if (!order) {
    return (
      <AccountPageShell>
        <AccountHero
          profile={session.profile}
          eyebrow="Order details"
          title="Order not found."
          description="That order is unavailable for this customer account."
        />
        <div className="mt-6">
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-[8px] border border-[#d4af37] bg-[#d4af37] px-6 py-3 font-pixel text-[0.62rem] uppercase text-black transition hover:bg-[#fff4bd] focus-ring"
            href="/account/orders"
          >
            Back to orders
          </Link>
        </div>
      </AccountPageShell>
    );
  }

  const pickupEvent = order.pickupEventId
    ? getEventById(storeEvents, order.pickupEventId)
    : undefined;

  return (
    <AccountPageShell>
      <AccountHero
        profile={session.profile}
        eyebrow="Order details"
        title={order.orderNumber}
        description={`Placed ${formatDate(order.createdAt)} with a total of ${formatCurrency(
          order.totalCents
        )}.`}
      >
        <SignOutButton />
      </AccountHero>
      <AccountTabs current="orders" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[8px] border border-[#d4af37]/16 bg-[#111111] p-5">
          <h2 className="text-xl font-semibold text-white">Products ordered</h2>
          <div className="mt-5">
            {order.items.length > 0 ? (
              <OrderItemRows items={order.items} />
            ) : (
              <p className="rounded-[8px] border border-dashed border-[#d4af37]/18 p-6 text-sm text-[#b8b0a0]">
                Item details are not available for this order yet.
              </p>
            )}
          </div>
        </section>

        <div className="grid gap-5">
          <OrderTotals order={order} />
          <DetailPanel title="Status">
            <DetailLine label="Order" value={order.status.replaceAll("_", " ")} />
            <DetailLine label="Payment" value={order.paymentStatus?.replaceAll("_", " ")} />
            <DetailLine label="Fulfillment" value={order.fulfillmentStatus?.replaceAll("_", " ")} />
            <DetailLine
              label="Pickup"
              value={
                order.pickupMethod === "event"
                  ? pickupEvent?.title ?? "Verified event pickup"
                  : "Richmond / Houston area"
              }
            />
            {order.trackingUrl ? (
              <DetailLine
                label="Tracking"
                value={
                  <a className="text-[#d4af37] transition hover:text-[#fff4bd]" href={order.trackingUrl}>
                    {order.trackingNumber || "Track shipment"}
                  </a>
                }
              />
            ) : (
              <DetailLine label="Tracking" value={order.trackingNumber} />
            )}
          </DetailPanel>
          <DetailPanel title="Contact">
            <DetailLine label="Name" value={order.customerName} />
            <DetailLine label="Email" value={order.email} />
          </DetailPanel>
          <DetailPanel title="Pickup notes">
            <DetailLine label="Method" value={order.pickupMethod} />
            <DetailLine label="Notes" value={order.pickupNotes} />
          </DetailPanel>
          <DetailPanel title="Billing address">
            <AddressBlock address={order.billingAddress} />
          </DetailPanel>
        </div>
      </div>
    </AccountPageShell>
  );
}
