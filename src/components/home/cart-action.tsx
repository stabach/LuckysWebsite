"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { cn } from "@/lib/utils";

export function HomeCartAction({
  variantId,
  label = "Add to Loot",
  className
}: {
  variantId: string;
  label?: string;
  className?: string;
}) {
  const { addItem } = useCart();

  return (
    <button className={cn("button button-primary", className)} type="button" onClick={() => addItem(variantId)}>
      {label} <ShoppingBag size={16} aria-hidden="true" />
    </button>
  );
}
