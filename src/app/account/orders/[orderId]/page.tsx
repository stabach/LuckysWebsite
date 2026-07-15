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
  description: "View a Lucky's Loot order.",
  robots: { index: false, follow: false }
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
            className="button button-primary"
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
        <section className="rounded-[16px] border border-[rgba(255,244,215,0.13)] bg-[#0d1712] p-5">
          <h2 className="text-xl font-semibold text-white">Products ordered</h2>
          <div className="mt-5">
            {order.items.length > 0 ? (
              <OrderItemRows items={order.items} />
            ) : (
              <p className="rounded-[10px] border border-dashed border-[#f4c451]/18 p-6 text-sm text-[#a9b2aa]">
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
                  <a className="text-[#f4c451] transition hover:text-[#fff3d6]" href={order.trackingUrl}>
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
