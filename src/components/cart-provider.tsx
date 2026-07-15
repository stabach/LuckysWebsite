"use client";

import {
  ArrowRight,
  Check,
  Loader2,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { storeEvents, type StoreEvent } from "@/data/events";
import { useDialogFocus } from "@/hooks/use-dialog-focus";
import {
  CART_STORAGE_KEY,
  LEGACY_CART_STORAGE_KEY,
  mergeCartItems,
  parsePersistedCart,
  removeCartItem,
  sanitizeCartItems,
  serializeCart,
  updateCartQuantity,
  type CartItem,
  type PickupMethod
} from "@/lib/cart";
import { formatCurrency } from "@/lib/catalog";
import { getEligiblePickupEvents } from "@/lib/events";
import {
  calculateCartPricing,
  getGuardPricingMessage,
  type CartPricing
} from "@/lib/pricing";
import { cn } from "@/lib/utils";

export type { CartItem, PickupMethod } from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  pricing: CartPricing;
  detailedItems: CartPricing["lines"];
  itemCount: number;
  psaGuardCount: number;
  subtotalCents: number;
  pickupMethod: PickupMethod;
  pickupEventId: string | null;
  eligiblePickupEvents: StoreEvent[];
  setPickupMethod: (method: PickupMethod) => void;
  setPickupEventId: (eventId: string | null) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => void;
  addItems: (items: ReadonlyArray<CartItem>) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const emptyPricing = calculateCartPricing([]);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>("richmond");
  const [pickupEventId, setPickupEventId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const eligiblePickupEvents = useMemo(() => getEligiblePickupEvents(storeEvents), []);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = parsePersistedCart(saved, eligiblePickupEvents.map((event) => event.id));
        setItems(parsed.items);
        setPickupMethod(parsed.pickupMethod);
        setPickupEventId(parsed.pickupEventId);
        return;
      }

      const legacy = window.localStorage.getItem(LEGACY_CART_STORAGE_KEY);
      if (legacy) setItems(sanitizeCartItems(JSON.parse(legacy) as CartItem[]));
    } catch {
      setItems([]);
    }
  }, [eligiblePickupEvents]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      serializeCart({ items, pickupMethod, pickupEventId })
    );
  }, [items, mounted, pickupEventId, pickupMethod]);

  useEffect(() => {
    if (pickupMethod === "event" && !eligiblePickupEvents.some((event) => event.id === pickupEventId)) {
      setPickupMethod("richmond");
      setPickupEventId(null);
    }
  }, [eligiblePickupEvents, pickupEventId, pickupMethod]);

  const pricing = useMemo(() => {
    try {
      return calculateCartPricing(items);
    } catch {
      return emptyPricing;
    }
  }, [items]);

  const addItems = useCallback((incoming: ReadonlyArray<CartItem>) => {
    setItems((current) => mergeCartItems(current, incoming));
    setOpen(true);
  }, []);

  const addItem = useCallback(
    (variantId: string, quantity = 1) => addItems([{ variantId, quantity }]),
    [addItems]
  );

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((current) => updateCartQuantity(current, variantId, quantity));
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((current) => removeCartItem(current, variantId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      pricing,
      detailedItems: pricing.lines,
      itemCount: pricing.itemCount,
      psaGuardCount: pricing.guardQuantity,
      subtotalCents: pricing.subtotalCents,
      pickupMethod,
      pickupEventId,
      eligiblePickupEvents,
      setPickupMethod,
      setPickupEventId,
      openCart,
      closeCart,
      addItem,
      addItems,
      updateQuantity,
      removeItem,
      clearCart
    }),
    [addItem, addItems, clearCart, closeCart, eligiblePickupEvents, items, openCart, pickupEventId, pickupMethod, pricing, removeItem, updateQuantity]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {open ? <CartDrawer onClose={closeCart} /> : null}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider.");
  return context;
}

export function CartButton({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { itemCount, openCart } = useCart();
  return (
    <button type="button" onClick={openCart} className={cn("button button-secondary cart-provider-button", className)} aria-label={`Open cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}>
      <ShoppingBag size={17} aria-hidden="true" /> {compact ? "Your Loot" : null}
      {itemCount ? <span>{itemCount}</span> : null}
    </button>
  );
}

export function AddToCartButton({ variantId, label = "Add to Loot", className }: { variantId: string; label?: string; className?: string }) {
  const { addItem } = useCart();
  return <button type="button" className={cn("button button-primary", className)} onClick={() => addItem(variantId)}>{label}<ShoppingBag size={16} aria-hidden="true" /></button>;
}

function CartDrawer({ onClose }: { onClose: () => void }) {
  const {
    detailedItems,
    pricing,
    pickupMethod,
    pickupEventId,
    eligiblePickupEvents,
    setPickupMethod,
    setPickupEventId,
    updateQuantity,
    removeItem,
    clearCart
  } = useCart();
  const drawerRef = useRef<HTMLElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useDialogFocus(true, drawerRef, close);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    if (!detailedItems.length) return;
    setCheckingOut(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: detailedItems.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
          pickupMethod,
          pickupEventId
        })
      });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) throw new Error(payload.error ?? "Checkout could not be started.");
      window.location.href = payload.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout could not be started.");
    } finally {
      setCheckingOut(false);
    }
  }

  const tierProgress =
    pricing.guardQuantity >= 25
      ? 100
      : pricing.guardQuantity >= 10
        ? 40 + ((pricing.guardQuantity - 10) / 15) * 60
        : (pricing.guardQuantity / 10) * 40;

  return (
    <div className="cart-dialog-layer" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <aside ref={drawerRef} className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="cart-drawer-head">
          <div><p className="eyebrow">Collector cart</p><h2 id="cart-title">Your Loot</h2><span>{pricing.itemCount} item{pricing.itemCount === 1 ? "" : "s"}</span></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close Your Loot"><X size={20} aria-hidden="true" /></button>
        </header>

        <div className="cart-drawer-body">
          {detailedItems.length ? (
            <div className="cart-line-list">
              {detailedItems.map((item) => (
                <article className="cart-line" key={item.variantId}>
                  <Link className="cart-line-image" href={`/products/${item.productSlug}`} onClick={onClose}>
                    <Image src={item.productImage} alt="" fill sizes="84px" />
                  </Link>
                  <div className="cart-line-copy">
                    <div className="cart-line-title"><div><h3>{item.productName}</h3><p>{item.variantName}</p></div><button type="button" onClick={() => removeItem(item.variantId)} aria-label={`Remove ${item.productName} — ${item.variantName}`}><Trash2 size={16} aria-hidden="true" /></button></div>
                    <div className="cart-line-price"><span>{formatCurrency(item.unitPriceCents)} each{item.discountCents ? " · bulk price" : ""}</span><strong>{formatCurrency(item.lineTotalCents)}</strong></div>
                    <div className="quantity-control cart-line-quantity" aria-label={`${item.productName} quantity`}>
                      <button type="button" onClick={() => updateQuantity(item.variantId, item.quantity - 1)} aria-label={`Decrease ${item.productName} quantity`}><Minus size={14} aria-hidden="true" /></button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.variantId, item.quantity + 1)} aria-label={`Increase ${item.productName} quantity`}><Plus size={14} aria-hidden="true" /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="cart-empty-state"><ShoppingBag size={30} aria-hidden="true" /><h3>Your Loot is empty.</h3><p>Add a case, Guard mix, or binder to start.</p><Link className="button button-primary" href="/shop" onClick={onClose}>Shop supplies</Link></div>
          )}

          {pricing.guardQuantity > 0 ? (
            <div className="cart-tier-card">
              <div><strong>{pricing.guardQuantity} PSA Guard{pricing.guardQuantity === 1 ? "" : "s"}</strong><span>{formatCurrency(detailedItems.find((item) => item.productId === "psa-guards")?.unitPriceCents ?? 700)} each</span></div>
              <div className="tier-progress-track"><span style={{ width: `${tierProgress}%` }} /></div>
              <p>{getGuardPricingMessage(pricing.guardQuantity)}</p>
            </div>
          ) : null}

          <fieldset className="pickup-selector">
            <legend>Choose pickup</legend>
            <label><input type="radio" name="pickup-method" value="richmond" checked={pickupMethod === "richmond"} onChange={() => { setPickupMethod("richmond"); setPickupEventId(null); }} /><span><MapPin size={18} aria-hidden="true" /><strong>Richmond / Houston area</strong><small>Exact private details after payment.</small></span></label>
            <label className={eligiblePickupEvents.length ? "" : "is-disabled"}><input type="radio" name="pickup-method" value="event" disabled={!eligiblePickupEvents.length} checked={pickupMethod === "event"} onChange={() => { const firstEvent = eligiblePickupEvents[0]; if (firstEvent) { setPickupMethod("event"); setPickupEventId(firstEvent.id); } }} /><span><MapPin size={18} aria-hidden="true" /><strong>Event pickup</strong><small>{eligiblePickupEvents.length ? "Choose an eligible published event." : "Available only when a verified future event is eligible."}</small></span></label>
            {pickupMethod === "event" && eligiblePickupEvents.length ? (
              <label className="pickup-event-select">
                <span className="sr-only">Pickup event</span>
                <select value={pickupEventId ?? ""} onChange={(event) => setPickupEventId(event.target.value)}>
                  {eligiblePickupEvents.map((event) => <option value={event.id} key={event.id}>{event.title}</option>)}
                </select>
              </label>
            ) : null}
          </fieldset>
        </div>

        <footer className="cart-drawer-foot">
          {pricing.discountCents ? <div className="cart-discount-row"><span>Bulk savings</span><strong>−{formatCurrency(pricing.discountCents)}</strong></div> : null}
          <div className="cart-subtotal-row"><span>Subtotal</span><strong>{formatCurrency(pricing.subtotalCents)}</strong></div>
          <p>Tax handling is finalized in secure checkout. Pickup has no shipping charge.</p>
          {error ? <div className="cart-error" role="alert">{error}</div> : null}
          <button className="button button-primary cart-checkout" type="button" disabled={!detailedItems.length || checkingOut} onClick={checkout}>
            {checkingOut ? <Loader2 className="spin" size={17} aria-hidden="true" /> : <Check size={17} aria-hidden="true" />} Secure checkout
          </button>
          <Link className="cart-contact-link" href="/contact?topic=cart" onClick={onClose}>Ask about Your Loot <ArrowRight size={15} aria-hidden="true" /></Link>
          {detailedItems.length ? <button className="cart-clear" type="button" onClick={clearCart}>Clear Your Loot</button> : null}
        </footer>
      </aside>
    </div>
  );
}
