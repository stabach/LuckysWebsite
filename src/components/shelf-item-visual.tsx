import Image from "next/image";
import type { CSSProperties } from "react";
import type { ShelfItem, ShelfItemKind } from "@/lib/types";
import { cn } from "@/lib/utils";

type ShelfVisualSize = "mini" | "builder" | "shelf" | "large";

type ShelfItemVisualProps = {
  item: Pick<ShelfItem, "kind" | "label" | "image" | "protectedBy" | "colorway">;
  protectedMode?: boolean;
  size?: ShelfVisualSize;
  showLabel?: boolean;
  className?: string;
};

const imageSizing: Record<ShelfItemKind, Record<ShelfVisualSize, string>> = {
  etb: {
    mini: "h-16 w-12",
    builder: "h-20 w-16",
    shelf: "h-24 w-20",
    large: "h-36 w-28"
  },
  boosterBox: {
    mini: "h-12 w-16",
    builder: "h-16 w-20",
    shelf: "h-20 w-24",
    large: "h-28 w-36"
  },
  boosterBundle: {
    mini: "h-12 w-12",
    builder: "h-16 w-16",
    shelf: "h-20 w-20",
    large: "h-28 w-28"
  },
  slab: {
    mini: "h-16 w-10",
    builder: "h-20 w-12",
    shelf: "h-24 w-14",
    large: "h-36 w-20"
  },
  binder: {
    mini: "h-16 w-12",
    builder: "h-20 w-16",
    shelf: "h-24 w-20",
    large: "h-36 w-28"
  },
  accessory: {
    mini: "h-8 w-16",
    builder: "h-12 w-24",
    shelf: "h-14 w-28",
    large: "h-20 w-40"
  }
};

const framePadding: Record<ShelfItemKind, string> = {
  etb: "-inset-2",
  boosterBox: "-inset-2",
  boosterBundle: "-inset-1.5",
  slab: "-inset-1.5",
  binder: "-inset-1",
  accessory: "-inset-1"
};

const colorwayAccents: Record<string, string> = {
  Ruby: "#e65068",
  Emerald: "#26a566",
  Frosted: "#d9f3ff",
  Sapphire: "#2d8cff",
  Amethyst: "#8d5cf6"
};

export function ShelfItemVisual({
  item,
  protectedMode = true,
  size = "shelf",
  showLabel = false,
  className
}: ShelfItemVisualProps) {
  const accent = colorwayAccents[item.colorway ?? ""] ?? "#ffd65a";
  const acrylicCase = protectedMode && item.kind !== "binder";
  const style = { "--case-accent": accent } as CSSProperties & { "--case-accent": string };

  return (
    <span className={cn("relative inline-grid place-items-center", className)} style={style}>
      <span
        className={cn(
          "relative z-10 block overflow-hidden rounded-[7px] bg-white/70 shadow-[0_10px_22px_rgba(18,50,35,0.18)] transition duration-300",
          imageSizing[item.kind][size],
          item.kind === "slab" && "rounded-[5px] bg-white",
          item.kind === "binder" && "bg-[#101915]",
          acrylicCase && "translate-y-[-2px]"
        )}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.label}
            fill
            className={cn(
              "object-contain",
              item.kind === "binder" ? "p-0" : "p-1",
              item.kind === "slab" && "p-0.5"
            )}
            sizes="(max-width: 768px) 90px, 160px"
          />
        ) : (
          <span className="absolute inset-2 rounded-[5px] bg-[color:var(--case-accent)]/20" />
        )}
        {item.kind === "slab" ? (
          <span className="absolute inset-0 rounded-[5px] ring-2 ring-[color:var(--case-accent)]/70" />
        ) : null}
      </span>

      {acrylicCase ? (
        <span
          className={cn(
            "pointer-events-none absolute rounded-[8px] border border-white/70 bg-white/[0.12] shadow-[0_18px_38px_rgba(21,88,55,0.16)] backdrop-blur-[1px]",
            framePadding[item.kind]
          )}
        >
          <span className="absolute inset-[4px] rounded-[6px] border border-[color:var(--case-accent)]/34" />
          <span className="absolute inset-0 rounded-[8px] bg-case-glint opacity-45" />
        </span>
      ) : null}

      {showLabel ? (
        <span className="mt-2 max-w-28 truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-[#28533a]/70">
          {item.label}
        </span>
      ) : null}
    </span>
  );
}
