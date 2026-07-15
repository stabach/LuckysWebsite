import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import {
  createSupabaseServerClient,
  hasSupabaseServerEnv
} from "@/lib/supabase/server";
import {
  getVariantById
} from "@/lib/catalog";
import { getUnitPriceCents } from "@/lib/pricing";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export type AccountProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type AccountAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

export type AccountOrderItem = {
  id: string;
  variantId: string | null;
  productId: string | null;
  productName: string;
  productImage: string;
  variantName: string | null;
  options: Record<string, unknown> | null;
  quantity: number;
  unitPriceCents: number;
  totalPriceCents: number;
};

export type AccountOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string | null;
  fulfillmentStatus: string | null;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  discountCents: number;
  totalCents: number;
  email: string | null;
  customerName: string | null;
  pickupMethod: string | null;
  pickupNotes: string | null;
  shippingAddress: AccountAddress | null;
  billingAddress: AccountAddress | null;
  shippingMethod: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
  items: AccountOrderItem[];
};

export type RequiredAccountSession =
  | {
      missingEnv: true;
      supabase: null;
      user: null;
      profile: null;
    }
  | {
      missingEnv: false;
      supabase: SupabaseServerClient;
      user: User;
      profile: AccountProfile;
    };

export async function getCurrentUser() {
  if (!hasSupabaseServerEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function getRequiredAccountSession(currentPath: string): Promise<RequiredAccountSession> {
  if (!hasSupabaseServerEnv()) {
    return {
      missingEnv: true,
      supabase: null,
      user: null,
      profile: null
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
  }

  const profile = await getOrCreateCustomerProfile(supabase, user);

  return {
    missingEnv: false,
    supabase,
    user,
    profile
  };
}

export async function getCustomerOrders(
  supabase: SupabaseServerClient,
  customerId: string,
  limit?: number
) {
  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message || "Order history could not be loaded.");
  }

  return (data ?? []).map((order) => normalizeOrder(order));
}

export async function getCustomerOrderById(
  supabase: SupabaseServerClient,
  customerId: string,
  orderId: string
) {
  if (!isUuid(orderId)) {
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .eq("customer_id", customerId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Order details could not be loaded.");
  }

  return data ? normalizeOrder(data) : null;
}

export function getProfileDisplayName(profile: AccountProfile) {
  return profile.fullName || [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Collector";
}

export function getSafeRedirectTarget(value: string | null | undefined, fallback = "/account") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

async function getOrCreateCustomerProfile(supabase: SupabaseServerClient, user: User) {
  const { data } = await supabase.from("customers").select("*").eq("id", user.id).maybeSingle();

  if (data) {
    return normalizeProfile(data, user);
  }

  const metadata = getUserNameMetadata(user);
  const profilePayload = {
    id: user.id,
    email: user.email ?? "",
    first_name: metadata.firstName,
    last_name: metadata.lastName,
    full_name: buildFullName(metadata.firstName, metadata.lastName),
    updated_at: new Date().toISOString()
  };
  const { data: inserted } = await supabase
    .from("customers")
    .upsert(profilePayload, { onConflict: "id" })
    .select("*")
    .maybeSingle();

  return normalizeProfile(inserted ?? profilePayload, user);
}

function normalizeProfile(raw: Record<string, unknown>, user: User): AccountProfile {
  const metadata = getUserNameMetadata(user);
  const firstName = stringValue(raw.first_name) || metadata.firstName;
  const lastName = stringValue(raw.last_name) || metadata.lastName;
  const fullName = stringValue(raw.full_name) || buildFullName(firstName, lastName);

  return {
    id: stringValue(raw.id) || user.id,
    email: stringValue(raw.email) || user.email || "",
    firstName,
    lastName,
    fullName,
    createdAt: stringValue(raw.created_at),
    updatedAt: stringValue(raw.updated_at)
  };
}

function normalizeOrder(raw: Record<string, unknown>): AccountOrder {
  const id = stringValue(raw.id);
  const createdAt = stringValue(raw.created_at) || new Date().toISOString();
  const orderItems = Array.isArray(raw.order_items)
    ? normalizeOrderItems(raw.order_items as Array<Record<string, unknown>>)
    : [];
  const fallbackItems =
    orderItems.length > 0 ? orderItems : normalizeCheckoutItems(raw.checkout_items);

  return {
    id,
    orderNumber: stringValue(raw.order_number) || buildOrderNumber(id, createdAt),
    status: stringValue(raw.status) || "paid",
    paymentStatus: stringValue(raw.payment_status) || stringValue(raw.stripe_payment_status),
    fulfillmentStatus: stringValue(raw.fulfillment_status),
    subtotalCents: numberValue(raw.subtotal_cents),
    shippingCents: numberValue(raw.shipping_cents),
    taxCents: numberValue(raw.tax_cents),
    discountCents: numberValue(raw.discount_cents),
    totalCents: numberValue(raw.total_cents),
    email: stringValue(raw.customer_email),
    customerName: stringValue(raw.customer_name),
    pickupMethod: stringValue(raw.pickup_method),
    pickupNotes: stringValue(raw.pickup_notes),
    shippingAddress: addressValue(raw.shipping_address),
    billingAddress: addressValue(raw.billing_address),
    shippingMethod: stringValue(raw.shipping_method),
    trackingNumber: stringValue(raw.tracking_number),
    trackingUrl: stringValue(raw.tracking_url),
    createdAt,
    updatedAt: stringValue(raw.updated_at),
    items: fallbackItems
  };
}

function normalizeOrderItems(items: Array<Record<string, unknown>>) {
  const totalGuardQuantity = items.reduce((total, item) => {
    const resolved = getVariantById(stringValue(item.variant_id));
    return resolved?.product.id === "psa-guards"
      ? total + Math.max(1, numberValue(item.quantity))
      : total;
  }, 0);

  return items.map((item, index) => {
    const variantId = stringValue(item.variant_id);
    const resolved = variantId ? getVariantById(variantId) : undefined;
    const quantity = Math.max(1, numberValue(item.quantity));
    const unitPriceCents =
      numberValue(item.unit_price_cents) ||
      (resolved
        ? getUnitPriceCents(resolved.product, resolved.variant, totalGuardQuantity)
        : 0);
    const totalPriceCents = numberValue(item.total_price_cents) || unitPriceCents * quantity;
    const fallbackImage = resolved?.product.images.find((media) => media.type === "image")?.src;

    return {
      id: stringValue(item.id) || `${variantId || "item"}-${index}`,
      variantId,
      productId: stringValue(item.catalog_product_id) || stringValue(item.product_id),
      productName: stringValue(item.product_name) || resolved?.product.name || "Lucky's Loot item",
      productImage:
        stringValue(item.product_image) ||
        resolved?.variant.image ||
        fallbackImage ||
        "/brand/luckys-loot-logo.webp",
      variantName: stringValue(item.variant_name) || resolved?.variant.label || null,
      options: recordValue(item.options),
      quantity,
      unitPriceCents,
      totalPriceCents
    };
  });
}

function normalizeCheckoutItems(raw: unknown) {
  const items = Array.isArray(raw) ? raw : [];
  const totalGuardQuantity = items.reduce((total, item) => {
    const candidate = item as Record<string, unknown>;
    const resolved = getVariantById(stringValue(candidate.variantId));
    return resolved?.product.id === "psa-guards"
      ? total + Math.max(1, numberValue(candidate.quantity))
      : total;
  }, 0);

  return items
    .map((item, index) => {
      const candidate = item as Record<string, unknown>;
      const variantId = stringValue(candidate.variantId);
      const resolved = getVariantById(variantId);

      if (!resolved) {
        return null;
      }

      const quantity = Math.max(1, numberValue(candidate.quantity));
      const unitPriceCents =
        numberValue(candidate.unitPriceCents) ||
        getUnitPriceCents(resolved.product, resolved.variant, totalGuardQuantity);
      const fallbackImage = resolved.product.images.find((media) => media.type === "image")?.src;

      return {
        id: `${variantId}-${index}`,
        variantId,
        productId: resolved.product.id,
        productName: resolved.product.name,
        productImage:
          resolved.variant.image || fallbackImage || "/brand/luckys-loot-logo.webp",
        variantName: resolved.variant.label,
        options: resolved.variant.color ? { color: resolved.variant.color } : null,
        quantity,
        unitPriceCents,
        totalPriceCents: unitPriceCents * quantity
      };
    })
    .filter(Boolean) as AccountOrderItem[];
}

function getUserNameMetadata(user: User) {
  const metadata = user.user_metadata ?? {};

  return {
    firstName: stringValue(metadata.first_name),
    lastName: stringValue(metadata.last_name)
  };
}

function buildFullName(firstName: string, lastName: string) {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

function buildOrderNumber(id: string, createdAt: string) {
  const dateStamp = createdAt.slice(0, 10).replaceAll("-", "");
  const suffix = id ? id.slice(0, 8).toUpperCase() : "CONFIRMED";

  return `LL-${dateStamp}-${suffix}`;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function addressValue(value: unknown): AccountAddress | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as AccountAddress;
}

function recordValue(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}
