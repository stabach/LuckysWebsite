"use client";

import {
  Loader2,
  Mail,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X
} from "lucide-react";
import Image from "next/image";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  formatStorefrontCurrency,
  getStorefrontVariant,
  type StorefrontCartVariant
} from "@/lib/storefront-products";
import { cn } from "@/lib/utils";

type CartItem = {
  variantId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  detailedItems: Array<CartItem & { variant: StorefrontCartVariant }>;
  itemCount: number;
  subtotalCents: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "luckys-loot-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        setItems(sanitizeCartItems(parsed));
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, mounted]);

  const detailedItems = useMemo(
    () =>
      items
        .map((item) => {
          const variant = getStorefrontVariant(item.variantId);
          return variant ? { ...item, variant } : null;
        })
        .filter(Boolean) as Array<CartItem & { variant: StorefrontCartVariant }>,
    [items]
  );

  const itemCount = useMemo(
    () => detailedItems.reduce((total, item) => total + item.quantity, 0),
    [detailedItems]
  );

  const subtotalCents = useMemo(
    () => detailedItems.reduce((total, item) => total + item.variant.priceCents * item.quantity, 0),
    [detailedItems]
  );

  const addItem = useCallback((variantId: string, quantity = 1) => {
    const variant = getStorefrontVariant(variantId);
    if (!variant) {
      return;
    }

    setItems((current) => {
      const existing = current.find((item) => item.variantId === variantId);
      const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, variant.maxQuantity);

      if (existing) {
        return current.map((item) =>
          item.variantId === variantId ? { ...item, quantity: nextQuantity } : item
        );
      }

      return [...current, { variantId, quantity: Math.max(1, nextQuantity) }];
    });
    setOpen(true);
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    const variant = getStorefrontVariant(variantId);
    if (!variant) {
      return;
    }

    setItems((current) =>
      current
        .map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: Math.min(Math.max(quantity, 0), variant.maxQuantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((current) => current.filter((item) => item.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      detailedItems,
      itemCount,
      subtotalCents,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart
    }),
    [addItem, clearCart, detailedItems, itemCount, items, removeItem, subtotalCents, updateQuantity]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}

export function CartButton({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { itemCount, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className={cn(
        "relative inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] border border-[#d4af37]/28 px-3 text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring",
        compact ? "w-full" : "w-10",
        className
      )}
      aria-label={`Open cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
      title="Cart"
    >
      <ShoppingBag size={17} />
      {compact ? <span className="text-xs uppercase tracking-[0.14em]">Cart</span> : null}
      {itemCount > 0 ? (
        <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#d4af37] px-1 text-[10px] font-bold text-black">
          {itemCount}
        </span>
      ) : null}
    </button>
  );
}

export function AddToCartButton({
  variantId,
  label,
  className
}: {
  variantId: string;
  label?: string;
  className?: string;
}) {
  const { addItem } = useCart();
  const variant = getStorefrontVariant(variantId);

  if (!variant) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => addItem(variantId)}
      className={cn(
        "inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-[8px] border border-[#d4af37]/46 bg-[#d4af37] px-4 py-3 text-[0.78rem] font-black uppercase leading-5 tracking-[0.08em] text-black shadow-[0_8px_22px_rgba(212,175,55,0.18)] transition hover:-translate-y-0.5 hover:bg-[#fff4bd] focus-ring",
        className
      )}
    >
      <span className="text-left">{label ?? `Add ${variant.shortLabel}`}</span>
      <ShoppingBag size={16} />
    </button>
  );
}

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { detailedItems, subtotalCents, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inquiryHref = useMemo(() => {
    const subject = encodeURIComponent("Lucky's Loot Cart Inquiry");
    const cartSummary =
      detailedItems.length > 0
        ? detailedItems
            .map(
              (item) =>
                `${item.quantity} x ${item.variant.label} (${formatStorefrontCurrency(
                  item.variant.priceCents
                )} each)`
            )
            .join("\n")
        : "I would like to ask about Lucky's Loot products.";
    const body = encodeURIComponent(`${cartSummary}\n\nSubtotal: ${formatStorefrontCurrency(subtotalCents)}`);

    return `mailto:LuckysLootSupplies@gmail.com?subject=${subject}&body=${body}`;
  }, [detailedItems, subtotalCents]);

  async function checkout() {
    if (detailedItems.length === 0) {
      return;
    }

    setCheckingOut(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: detailedItems.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity
          }))
        })
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Checkout could not be started.");
      }

      window.location.href = payload.url;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout could not be started. Please send an inquiry instead."
      );
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[95] transition",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-label="Close cart overlay"
      />
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[#d4af37]/28 bg-[#0b0b0b] text-[#e7e0cf] shadow-[0_0_60px_rgba(0,0,0,0.72)] transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-[#d4af37]/18 px-5 py-4">
          <div>
            <p className="font-pixel text-[0.72rem] uppercase text-[#d4af37]">Your Loot</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8d866f]">
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-[8px] border border-[#d4af37]/24 text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-5 py-5">
          {detailedItems.length > 0 ? (
            <div className="grid gap-4">
              {detailedItems.map((item) => (
                <article
                  key={item.variantId}
                  className="grid grid-cols-[74px_1fr] gap-4 rounded-[8px] border border-[#d4af37]/16 bg-white/[0.035] p-3"
                >
                  <div className="relative h-[74px] overflow-hidden rounded-[8px] border border-[#d4af37]/18 bg-black">
                    <Image src={item.variant.image} alt="" fill className="object-cover" sizes="74px" />
                  </div>
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{item.variant.label}</h3>
                        <p className="mt-1 text-xs text-[#b8b0a0]">{item.variant.familyName}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-[6px] text-[#8d866f] transition hover:bg-white/5 hover:text-[#d4af37] focus-ring"
                        aria-label={`Remove ${item.variant.label}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-[8px] border border-[#d4af37]/18">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="grid h-9 w-9 place-items-center text-[#d4af37] focus-ring"
                          aria-label={`Decrease ${item.variant.label} quantity`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="grid h-9 min-w-10 place-items-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="grid h-9 w-9 place-items-center text-[#d4af37] focus-ring"
                          aria-label={`Increase ${item.variant.label} quantity`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {formatStorefrontCurrency(item.variant.priceCents * item.quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid min-h-80 place-items-center rounded-[8px] border border-dashed border-[#d4af37]/20 bg-white/[0.025] p-8 text-center">
              <div>
                <ShoppingBag className="mx-auto text-[#d4af37]" size={30} />
                <p className="mt-5 font-pixel text-[0.7rem] uppercase text-[#d4af37]">Cart is empty</p>
                <p className="mt-3 text-sm leading-6 text-[#b8b0a0]">
                  Add acrylic cases, PSA guards, or binders to start checkout.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#d4af37]/18 px-5 py-5">
          <div className="grid gap-2 text-xs text-[#b8b0a0]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-[#d4af37]" />
              Secure Stripe checkout
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-[#d4af37]" />
              Local pickup details confirmed after purchase
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="uppercase tracking-[0.18em] text-[#8d866f]">Subtotal</span>
            <strong className="text-lg text-white">{formatStorefrontCurrency(subtotalCents)}</strong>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#8d866f]">
            Taxes, pickup notes, and custom engraving details are handled during checkout or follow-up.
          </p>

          {error ? (
            <div className="mt-4 rounded-[8px] border border-[#d4af37]/24 bg-[#d4af37]/10 p-3 text-xs leading-5 text-[#f4df91]">
              {error}
            </div>
          ) : null}

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={checkout}
              disabled={checkingOut || detailedItems.length === 0}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] border border-[#d4af37] bg-[#d4af37] px-5 py-3 font-pixel text-[0.62rem] uppercase text-black shadow-[0_10px_26px_rgba(212,175,55,0.22)] transition hover:bg-[#fff4bd] disabled:cursor-not-allowed disabled:opacity-55 focus-ring"
            >
              {checkingOut ? <Loader2 className="animate-spin" size={17} /> : <ShoppingBag size={17} />}
              Checkout
            </button>
            <a
              href={inquiryHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-[#d4af37]/32 px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
            >
              <Mail size={16} />
              Send Cart Inquiry
            </a>
            {detailedItems.length > 0 ? (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs uppercase tracking-[0.16em] text-[#8d866f] transition hover:text-[#d4af37] focus-ring"
              >
                Clear cart
              </button>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}

function sanitizeCartItems(items: CartItem[]) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const variant = getStorefrontVariant(item.variantId);
      if (!variant) {
        return null;
      }

      return {
        variantId: item.variantId,
        quantity: Math.min(Math.max(Number(item.quantity) || 1, 1), variant.maxQuantity)
      };
    })
    .filter(Boolean) as CartItem[];
}
