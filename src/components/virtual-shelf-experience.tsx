"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Trash2,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { ShelfItemVisual } from "@/components/shelf-item-visual";
import { featuredShelfItems, productImages } from "@/lib/catalog";
import type { CategoryId, ShelfItem, ShelfItemKind, ShelfLayoutPreset } from "@/lib/types";
import { cn } from "@/lib/utils";

const layoutLabels: Record<ShelfLayoutPreset, string> = {
  gallery: "Gallery",
  vault: "Case Wall",
  compact: "Desk Shelf"
};

const layoutDescriptions: Record<ShelfLayoutPreset, string> = {
  gallery: "Balanced rows for ETBs, booster boxes, and front-row bundles.",
  vault: "A denser wall for sealed product cases and PSA display accents.",
  compact: "A smaller shelf plan for desks, cubbies, and starter collections."
};

const buildOptions: Array<{
  label: string;
  description: string;
  kind: ShelfItemKind;
  protectedBy: CategoryId;
  image: string;
  span: number;
  colorway?: string;
}> = [
  {
    label: "Pokemon ETB",
    description: "Inside ETB acrylic case",
    kind: "etb",
    protectedBy: "acrylic-etb-cases",
    image: productImages.etb,
    span: 2
  },
  {
    label: "Booster Box",
    description: "Inside booster box case",
    kind: "boosterBox",
    protectedBy: "acrylic-booster-box-cases",
    image: productImages.boosterBox,
    span: 2
  },
  {
    label: "Booster Bundle",
    description: "Inside bundle case",
    kind: "boosterBundle",
    protectedBy: "acrylic-booster-bundle-cases",
    image: productImages.boosterBundle,
    span: 1
  },
  {
    label: "PSA Guard",
    description: "Gradient slab guard",
    kind: "slab",
    protectedBy: "psa-slab-guards",
    image: productImages.phantomEmerald,
    span: 1,
    colorway: "Emerald"
  },
  {
    label: "Phantom PSA",
    description: "Guard in acrylic display",
    kind: "slab",
    protectedBy: "phantom-display-psa-cases",
    image: productImages.phantomRuby,
    span: 1,
    colorway: "Ruby"
  },
  {
    label: "Topload Binder",
    description: "9-pocket binder",
    kind: "binder",
    protectedBy: "topload-binders",
    image: productImages.binder9,
    span: 2
  }
];

export function VirtualShelfExperience({ compact = false }: { compact?: boolean }) {
  const [shelfItems, setShelfItems] = useState<ShelfItem[]>(featuredShelfItems);
  const [protectedMode, setProtectedMode] = useState(true);
  const [comparisonMode, setComparisonMode] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [preset, setPreset] = useState<ShelfLayoutPreset>("gallery");
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const rowCount = preset === "compact" ? 2 : 3;
  const rows = useMemo(
    () =>
      Array.from({ length: rowCount }, (_, shelf) =>
        shelfItems.filter((item) => item.shelf % rowCount === shelf)
      ),
    [rowCount, shelfItems]
  );

  function addItem(option: (typeof buildOptions)[number]) {
    setShelfItems((current) => {
      const rowLoads = Array.from({ length: rowCount }, (_, shelf) =>
        current
          .filter((item) => item.shelf % rowCount === shelf)
          .reduce((total, item) => total + item.span, 0)
      );
      const shelf = rowLoads.indexOf(Math.min(...rowLoads));

      return [
        ...current,
        {
          id: `${option.kind}-${Date.now()}-${current.length}`,
          kind: option.kind,
          label: option.label,
          protectedBy: option.protectedBy,
          image: option.image,
          colorway: option.colorway,
          shelf,
          span: option.span
        }
      ];
    });
  }

  function removeItem(itemId: string) {
    setShelfItems((current) => current.filter((item) => item.id !== itemId));
  }

  function resetShelf() {
    setShelfItems(featuredShelfItems);
  }

  function saveLayout() {
    window.localStorage.setItem(
      "luckys-loot-shelf-layout",
      JSON.stringify({ protectedMode, comparisonMode, zoom, preset, shelfItems })
    );
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  async function shareLayout() {
    const url = `${window.location.origin}/virtual-shelf?layout=${preset}&protected=${protectedMode}&items=${shelfItems.length}`;
    await navigator.clipboard?.writeText(url);
    setShared(true);
    window.setTimeout(() => setShared(false), 1600);
  }

  return (
    <section className={cn("bg-[#fff8df] text-[#143a29]", compact ? "py-12" : "py-20 sm:py-28")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] border border-[#1e5f3f]/18 bg-white shadow-[0_12px_30px_rgba(31,95,63,0.12)]">
                <Image
                  src={productImages.logo}
                  alt="Lucky's Loot mascot"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f8f5b]">
                  Shelf Builder
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-[#143a29] text-balance sm:text-5xl">
                  Case your Pokemon shelf before you buy.
                </h2>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#28533a]/78">
              Add sealed products, PSA guards, Phantom displays, and topload binders. The preview shows
              how your collection looks inside Lucky&apos;s Loot acrylic ETB, booster box, and booster bundle cases.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {buildOptions.map((option) => (
                <button
                  key={`${option.kind}-${option.label}`}
                  className="group grid min-h-36 gap-2 rounded-[8px] border border-[#1e5f3f]/14 bg-white/80 p-3 text-left shadow-[0_12px_30px_rgba(31,95,63,0.08)] transition hover:-translate-y-0.5 hover:border-[#2f8f5b]/40 focus-ring"
                  type="button"
                  onClick={() => addItem(option)}
                >
                  <span className="flex items-start justify-between gap-2">
                    <ShelfItemVisual item={option} protectedMode size="mini" />
                    <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#ffd65a] text-[#143a29] transition group-hover:scale-105">
                      <Plus size={16} />
                    </span>
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#143a29]">{option.label}</span>
                    <span className="mt-1 block text-xs leading-4 text-[#28533a]/62">{option.description}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-3">
              <ControlButton active={protectedMode} onClick={() => setProtectedMode((value) => !value)}>
                {protectedMode ? <Eye size={17} /> : <EyeOff size={17} />}
                Acrylic protection
              </ControlButton>
              <ControlButton active={comparisonMode} onClick={() => setComparisonMode((value) => !value)}>
                <SlidersHorizontal size={17} />
                Uncased comparison
              </ControlButton>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {(Object.keys(layoutLabels) as ShelfLayoutPreset[]).map((layout) => (
                <button
                  key={layout}
                  className={cn(
                    "rounded-[8px] border px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition focus-ring",
                    preset === layout
                      ? "border-[#2f8f5b] bg-[#2f8f5b] text-white"
                      : "border-[#1e5f3f]/14 bg-white/70 text-[#28533a]/68 hover:text-[#143a29]"
                  )}
                  type="button"
                  onClick={() => setPreset(layout)}
                >
                  {layoutLabels[layout]}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-[#28533a]/58">{layoutDescriptions[preset]}</p>

            <div className="mt-7 flex flex-wrap gap-2">
              <IconAction label="Zoom out" onClick={() => setZoom((value) => Math.max(0.76, value - 0.08))}>
                <ZoomOut size={17} />
              </IconAction>
              <IconAction label="Zoom in" onClick={() => setZoom((value) => Math.min(1.24, value + 0.08))}>
                <ZoomIn size={17} />
              </IconAction>
              <IconAction label="Reset" onClick={resetShelf}>
                <RotateCcw size={17} />
              </IconAction>
              <IconAction label={saved ? "Saved" : "Save layout"} onClick={saveLayout}>
                {saved ? <Check size={17} /> : <Save size={17} />}
              </IconAction>
              <IconAction label={shared ? "Copied" : "Share layout"} onClick={shareLayout}>
                {shared ? <Check size={17} /> : <Copy size={17} />}
              </IconAction>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[8px] border border-[#1e5f3f]/18 bg-[#163f2c] p-4 shadow-[0_28px_70px_rgba(20,58,41,0.24)] sm:p-6">
            <div className="absolute right-4 top-4 hidden h-28 w-28 overflow-hidden rounded-[8px] border border-white/16 bg-[#fff8df] sm:block">
              <Image
                src={productImages.mascotGuide}
                alt="Lucky's Loot mascot shelf guide"
                fill
                className="object-cover object-top"
                sizes="112px"
              />
            </div>
            <div className="relative overflow-hidden rounded-[8px] border border-white/12 bg-[#fff4c9] p-3 sm:p-5">
              <div
                className={cn(
                  "origin-center transition duration-500",
                  preset === "vault" && "scale-[0.98]",
                  preset === "compact" && "scale-[0.94]"
                )}
                style={{ transform: `scale(${zoom})` }}
              >
                <ShelfPreview
                  rows={rows}
                  protectedMode={protectedMode}
                  comparisonMode={comparisonMode}
                  preset={preset}
                  onRemove={removeItem}
                />
              </div>
            </div>
            <div className="relative mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ["Items", String(shelfItems.length)],
                ["Layout", layoutLabels[preset]],
                ["Zoom", `${Math.round(zoom * 100)}%`]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[8px] border border-white/12 bg-white/[0.08] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#ffd65a]/70">{label}</p>
                  <p className="mt-1 text-sm text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShelfPreview({
  rows,
  protectedMode,
  comparisonMode,
  preset,
  onRemove
}: {
  rows: ShelfItem[][];
  protectedMode: boolean;
  comparisonMode: boolean;
  preset: ShelfLayoutPreset;
  onRemove: (itemId: string) => void;
}) {
  const hasItems = rows.some((row) => row.length > 0);

  return (
    <div
      className={cn(
        "relative mx-auto flex aspect-[4/3] min-h-[360px] max-w-3xl flex-col justify-end overflow-hidden rounded-[8px] bg-[#fff8df]",
        preset === "vault" && "bg-[#f5efcf]",
        preset === "compact" && "aspect-[3/4] max-w-lg"
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(255,214,90,0.34),transparent_28%),linear-gradient(180deg,rgba(47,143,91,0.12),transparent_55%)]" />
      {comparisonMode ? (
        <div className="absolute bottom-0 left-0 top-0 z-20 w-[42%] border-r border-[#2f8f5b]/35 bg-[#143a29]/10 backdrop-saturate-50">
          <span className="absolute left-4 top-4 rounded-[8px] border border-[#143a29]/12 bg-[#fff8df]/88 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#28533a]/70">
            Uncased
          </span>
        </div>
      ) : null}
      <div className="relative z-10 flex h-full flex-col justify-end gap-5 p-5 sm:p-6">
        {hasItems ? (
          rows.map((row, index) => (
            <div key={index} className="relative min-h-28 rounded-[6px] border-b-[10px] border-[#9a7a43]">
              <div className="absolute inset-x-0 bottom-0 h-px bg-[#ffd65a]/60" />
              <div className="absolute bottom-3 left-0 right-0 flex items-end justify-center gap-3 px-3">
                {row.map((item) => (
                  <ShelfObject
                    key={item.id}
                    item={item}
                    protectedMode={protectedMode}
                    comparisonMode={comparisonMode}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="grid h-full place-items-center text-center">
            <p className="max-w-xs text-sm leading-6 text-[#28533a]/70">
              Add an ETB, booster box, bundle, PSA guard, or binder to start the shelf.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ShelfObject({
  item,
  protectedMode,
  comparisonMode,
  onRemove
}: {
  item: ShelfItem;
  protectedMode: boolean;
  comparisonMode: boolean;
  onRemove: (itemId: string) => void;
}) {
  return (
    <div className={cn("group relative grid place-items-center", comparisonMode && "mx-1")}>
      {comparisonMode ? (
        <div className="absolute -left-7 bottom-0 opacity-35 grayscale">
          <ShelfItemVisual item={item} protectedMode={false} size="shelf" />
        </div>
      ) : null}
      <ShelfItemVisual item={item} protectedMode={protectedMode} size="shelf" showLabel />
      <button
        className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-[8px] border border-[#143a29]/12 bg-[#fff8df] text-[#28533a]/72 opacity-0 shadow-md transition hover:text-[#143a29] group-hover:opacity-100 focus-ring"
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.label}`}
        title={`Remove ${item.label}`}
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function ControlButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-between gap-3 rounded-[8px] border px-4 py-3 text-sm font-semibold transition focus-ring",
        active
          ? "border-[#2f8f5b] bg-[#2f8f5b] text-white"
          : "border-[#1e5f3f]/14 bg-white/70 text-[#28533a]/70 hover:text-[#143a29]"
      )}
      type="button"
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-2">{children}</span>
      <span className="text-xs uppercase tracking-[0.16em]">{active ? "On" : "Off"}</span>
    </button>
  );
}

function IconAction({
  children,
  label,
  onClick
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#1e5f3f]/14 bg-white/78 px-4 text-sm text-[#28533a]/76 transition hover:border-[#2f8f5b]/40 hover:text-[#143a29] focus-ring"
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}
