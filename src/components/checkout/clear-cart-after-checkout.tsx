"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart-provider";
import {
  CART_STORAGE_KEY,
  LEGACY_CART_STORAGE_KEY,
  serializeCart
} from "@/lib/cart";

export function ClearCartAfterCheckout() {
  const { clearCart } = useCart();

  useEffect(() => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      serializeCart({ items: [], pickupMethod: "richmond", pickupEventId: null })
    );
    window.localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    clearCart();
  }, [clearCart]);

  return null;
}
