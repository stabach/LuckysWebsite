import type { Metadata } from "next";
import {
  AccountHero,
  AccountPageShell,
  AccountTabs,
  AuthSetupNotice,
  EmptyOrders,
  OrderCard
} from "@/components/account/account-ui";
import { SignOutButton } from "@/components/account/sign-out-button";
import { getCustomerOrders, getRequiredAccountSession, type AccountOrder } from "@/lib/account";

export const metadata: Metadata = {
  title: "Order History",
  description: "View your Lucky's Loot order history.",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const session = await getRequiredAccountSession("/account/orders");

  if (session.missingEnv) {
    return <AuthSetupNotice />;
  }

  let orders: AccountOrder[] = [];
  let orderError: string | null = null;

  try {
    orders = await getCustomerOrders(session.supabase, session.user.id);
  } catch (error) {
    orderError = error instanceof Error ? error.message : "Order history could not be loaded.";
  }

  return (
    <AccountPageShell>
      <AccountHero
        profile={session.profile}
        eyebrow="Order history"
        title="Every order in one place."
        description="Only paid orders linked to your customer account appear here."
      >
        <SignOutButton />
      </AccountHero>
      <AccountTabs current="orders" />

      <section className="mt-8">
        {orderError ? (
          <div className="rounded-[10px] border border-[#fa6873]/30 bg-[#de4e53]/10 p-4 text-sm leading-6 text-[#fee9c9]">
            {orderError}
          </div>
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
