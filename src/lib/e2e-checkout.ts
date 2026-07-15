import "server-only";

export type E2ECheckoutSession = {
  id: string;
  amount_total: number;
  payment_status: "paid";
  customer_details: { email: string };
  metadata: Record<string, string>;
};

const globalCheckoutStore = globalThis as typeof globalThis & {
  __luckysE2ECheckoutSessions?: Map<string, E2ECheckoutSession>;
};

export function isE2ECheckoutEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.E2E_MOCK_CHECKOUT === "true";
}

export function createE2ECheckoutSession(
  amountTotal: number,
  metadata: Record<string, string>
) {
  if (!isE2ECheckoutEnabled()) return null;

  const sessions =
    globalCheckoutStore.__luckysE2ECheckoutSessions ??
    (globalCheckoutStore.__luckysE2ECheckoutSessions = new Map());
  const id = `cs_test_verified_${Date.now().toString(36)}`;
  const session: E2ECheckoutSession = {
    id,
    amount_total: amountTotal,
    payment_status: "paid",
    customer_details: { email: "collector@example.test" },
    metadata
  };
  sessions.set(id, session);
  return session;
}

export function getE2ECheckoutSession(sessionId: string) {
  if (!isE2ECheckoutEnabled()) return null;
  return globalCheckoutStore.__luckysE2ECheckoutSessions?.get(sessionId) ?? null;
}
