import type { Metadata } from "next";
import Link from "next/link";
import {
  AccountHero,
  AccountMetricGrid,
  AccountPageShell,
  AccountTabs,
  ActionCard,
  AuthSetupNotice,
  EmptyOrders,
  OrderCard,
  accountActionIcons
} from "@/components/account/account-ui";
import { SignOutButton } from "@/components/account/sign-out-button";
import { getCustomerOrders, getRequiredAccountSession, type AccountOrder } from "@/lib/account";

export const metadata: Metadata = {
  title: "Account",
  description: "Lucky's Loot customer account dashboard.",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getRequiredAccountSession("/account");

  if (session.missingEnv) {
    return <AuthSetupNotice />;
  }

  let orders: AccountOrder[] = [];
  let orderError: string | null = null;

  try {
    orders = await getCustomerOrders(session.supabase, session.user.id, 3);
  } catch (error) {
    orderError = error instanceof Error ? error.message : "Order history could not be loaded.";
  }

  return (
    <AccountPageShell>
      <AccountHero
        profile={session.profile}
        eyebrow="Customer account"
        title="Your Lucky's Loot dashboard."
        description="Review recent orders, keep your profile current, and return to checkout with your account connected."
      >
        <SignOutButton />
      </AccountHero>
      <AccountTabs current="overview" />
      <AccountMetricGrid orders={orders} />

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <ActionCard
          href="/account/orders"
          icon={accountActionIcons.orders}
          title="Order history"
          description="Open every paid checkout tied to your customer account."
        />
        <ActionCard
          href="/account/profile"
          icon={accountActionIcons.profile}
          title="Profile details"
          description="Update your name and email settings for future orders."
        />
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.62rem] font-bold uppercase leading-5 tracking-[0.14em] text-[#f4c451]">Recent orders</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Latest activity</h2>
          </div>
          <Link className="text-sm font-semibold text-[#f4c451] transition hover:text-[#fff3d6] focus-ring" href="/account/orders">
            View full history
          </Link>
        </div>

        {orderError ? (
          <AccountError message={orderError} />
        ) : orders.length > 0 ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyOrders />
        )}
      </section>
    </AccountPageShell>
  );
}

function AccountError({ message }: { message: string }) {
  return (
    <div className="rounded-[10px] border border-[#fa6873]/30 bg-[#de4e53]/10 p-4 text-sm leading-6 text-[#fee9c9]">
      {message}
    </div>
  );
}
