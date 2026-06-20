import Image from "next/image";
import type { CSSProperties } from "react";
import type { CategoryId, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductVisualProps = {
  product: Product;
  size?: "sm" | "md" | "lg";
  activeDemo?: number;
};

const caseShape: Record<CategoryId, string> = {
  "acrylic-etb-cases": "h-[78%] w-[64%]",
  "acrylic-booster-box-cases": "h-[62%] w-[76%]",
  "acrylic-booster-bundle-cases": "h-[58%] w-[58%]",
  "phantom-display-psa-cases": "h-[82%] w-[46%]",
  "psa-slab-guards": "h-[82%] w-[48%]",
  "topload-binders": "h-[82%] w-[64%]"
};

const imagePadding: Record<CategoryId, string> = {
  "acrylic-etb-cases": "p-4",
  "acrylic-booster-box-cases": "p-3",
  "acrylic-booster-bundle-cases": "p-3",
  "phantom-display-psa-cases": "p-1.5",
  "psa-slab-guards": "p-1.5",
  "topload-binders": "p-0"
};

export function ProductVisual({ product, size = "md", activeDemo = 0 }: ProductVisualProps) {
  const isBinder = product.categoryId === "topload-binders";
  const isGuard = product.categoryId === "psa-slab-guards";
  const acrylicFrame = !isBinder && !isGuard;
  const accentStyle = { "--accent": product.accent } as CSSProperties & {
    "--accent": string;
  };

  return (
    <figure
      className={cn(
        "relative mx-auto grid place-items-center",
        size === "sm" && "h-40 w-40",
        size === "md" && "h-60 w-60",
        size === "lg" && "h-80 w-full max-w-md"
      )}
      style={accentStyle}
    >
      <div className="absolute inset-x-7 bottom-5 h-6 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(47,143,91,0.28),transparent_68%)] blur-md" />
      <div
        className={cn(
          "case-edge relative grid place-items-center overflow-hidden rounded-[8px] border border-white/36 bg-white/[0.09] shadow-glass backdrop-blur-xl transition duration-500",
          size === "sm" && "h-28 w-28",
          size === "md" && "h-44 w-44",
          size === "lg" && "h-64 w-64",
          isBinder && "bg-[#102118]",
          isGuard && "bg-white/[0.18]"
        )}
        style={{
          transform:
            activeDemo === 0
              ? "translateY(0) rotateY(-9deg)"
              : activeDemo === 1
                ? "translateY(-8px) rotateY(10deg)"
                : "translateY(6px) rotateY(-3deg)"
        }}
      >
        <div
          className={cn(
            "relative z-10 overflow-hidden rounded-[7px] bg-white/72 shadow-2xl",
            caseShape[product.categoryId],
            isBinder && "bg-transparent shadow-none"
          )}
        >
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            className={cn("object-contain", imagePadding[product.categoryId])}
            sizes={
              size === "lg"
                ? "(max-width: 768px) 260px, 320px"
                : "(max-width: 768px) 180px, 240px"
            }
          />
          {isGuard ? (
            <div className="absolute inset-0 rounded-[7px] ring-2 ring-[color:var(--accent)]/70" />
          ) : null}
        </div>

        {acrylicFrame ? (
          <>
            <div className="absolute inset-3 rounded-[8px] border border-[color:var(--accent)]/42" />
            <div className="absolute inset-0 rounded-[8px] bg-case-glint opacity-40" />
            <div className="absolute right-3 top-3 h-8 w-1.5 rounded-full bg-white/42 blur-[1px]" />
          </>
        ) : null}
      </div>

      <figcaption className="sr-only">
        {product.productInsideLabel ?? product.name}
      </figcaption>

      <div
        className={cn(
          "absolute rounded-[8px] border border-[color:var(--accent)]/50 bg-[color:var(--accent)]/14 transition duration-500",
          size === "sm" && "bottom-10 h-5 w-20",
          size === "md" && "bottom-11 h-7 w-28",
          size === "lg" && "bottom-10 h-8 w-36",
          activeDemo === 0 && "translate-y-0 opacity-80",
          activeDemo === 1 && "-translate-y-8 opacity-100",
          activeDemo === 2 && "translate-y-1 opacity-55"
        )}
      />
    </figure>
  );
}
