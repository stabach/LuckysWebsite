"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, Download, GripVertical, RefreshCw, Save, Share2 } from "lucide-react";
import { ShelfItemVisual } from "@/components/shelf-item-visual";
import { buildCollectionPlan } from "@/lib/collection";
import type { CollectionCounts, ShelfItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const initialCounts: CollectionCounts = {
  etbs: 12,
  boosterBoxes: 8,
  boosterBundles: 6,
  gradedCards: 30,
  binders: 3
};

const fields: Array<{
  key: keyof CollectionCounts;
  label: string;
  suffix: string;
}> = [
  { key: "etbs", label: "Pokemon ETBs", suffix: "Elite Trainer Boxes" },
  { key: "boosterBoxes", label: "Booster boxes", suffix: "sealed displays" },
  { key: "boosterBundles", label: "Booster bundles", suffix: "front-row sealed" },
  { key: "gradedCards", label: "PSA slabs", suffix: "gradient guards" },
  { key: "binders", label: "Topload binders", suffix: "9-pocket and 4-pocket" }
];

export function CollectionBuilderExperience({ compact = false }: { compact?: boolean }) {
  const [counts, setCounts] = useState<CollectionCounts>(initialCounts);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [manualRows, setManualRows] = useState<ShelfItem[][] | null>(null);
  const plan = useMemo(() => buildCollectionPlan(counts), [counts]);
  const rows = manualRows ?? plan.shelfRows;

  function updateCount(key: keyof CollectionCounts, value: number) {
    setCounts((current) => ({ ...current, [key]: Math.max(0, Math.min(999, value)) }));
    setManualRows(null);
  }

  function resetLayout() {
    setManualRows(null);
  }

  function moveItem(targetItemId: string) {
    if (!draggedItemId || draggedItemId === targetItemId) {
      return;
    }

    const flat = rows.flat();
    const from = flat.findIndex((item) => item.id === draggedItemId);
    const to = flat.findIndex((item) => item.id === targetItemId);

    if (from < 0 || to < 0) {
      return;
    }

    const reordered = [...flat];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    const nextRows: ShelfItem[][] = [];
    let current: ShelfItem[] = [];
    let span = 0;

    for (const item of reordered) {
      if (span + item.span > 8) {
        nextRows.push(current);
        current = [];
        span = 0;
      }

      current.push(item);
      span += item.span;
    }

    if (current.length) {
      nextRows.push(current);
    }

    setManualRows(nextRows);
    setDraggedItemId(null);
  }

  function saveBuild() {
    window.localStorage.setItem("luckys-loot-collection-build", JSON.stringify({ counts, rows, plan }));
  }

  async function shareBuild() {
    const params = new URLSearchParams(
      Object.entries(counts).map(([key, value]) => [key, String(value)])
    );
    await navigator.clipboard?.writeText(`${window.location.origin}/collection-builder?${params}`);
  }

  function exportImage() {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1000;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.fillStyle = "#fff8df";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#143a29";
    context.font = "700 54px Arial";
    context.fillText("Lucky's Loot Shelf Build", 90, 110);
    context.fillStyle = "#2f8f5b";
    context.font = "28px Arial";
    context.fillText(
      `${plan.estimatedShelfRows} shelf rows | ${plan.estimatedWidthInches} in estimated width`,
      90,
      160
    );

    const shelfTop = 260;
    rows.slice(0, 4).forEach((row, rowIndex) => {
      const y = shelfTop + rowIndex * 170;
      context.fillStyle = "#9a7a43";
      context.fillRect(90, y + 112, 1420, 18);
      let x = 130;
      row.forEach((item) => {
        const width = item.span * 92;
        const height = item.kind === "slab" ? 112 : item.kind === "binder" ? 124 : 100;
        context.fillStyle = item.kind === "binder" ? "#143a29" : "#ffffff";
        context.fillRect(x, y + 110 - height, width, height);
        context.strokeStyle = "#ffd65a";
        context.lineWidth = 4;
        context.strokeRect(x - 8, y + 102 - height, width + 16, height + 16);
        context.fillStyle = "#143a29";
        context.font = "18px Arial";
        context.fillText(item.label.slice(0, 18), x, y + 142);
        x += width + 28;
      });
    });

    const link = document.createElement("a");
    link.download = "luckys-loot-collection-build.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <section className={cn("bg-[#fff8df] text-[#143a29]", compact ? "py-12" : "py-20 sm:py-28")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[0.42fr_0.58fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f8f5b]">
              Collection Builder
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[#143a29] text-balance sm:text-5xl">
              Build the case list from your Pokemon shelf.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#28533a]/78">
              Enter the sealed product and slabs you own. The builder turns that into a shelf layout
              using Lucky&apos;s Loot ETB, booster box, booster bundle, PSA, and topload binder products.
            </p>

            <div className="mt-8 grid gap-4">
              {fields.map((field) => (
                <label
                  key={field.key}
                  className="grid gap-2 rounded-[8px] border border-[#1e5f3f]/15 bg-white/78 p-4 shadow-[0_14px_38px_rgba(31,95,63,0.08)]"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-[#143a29]">{field.label}</span>
                    <span className="text-xs uppercase tracking-[0.16em] text-[#28533a]/54">
                      {field.suffix}
                    </span>
                  </span>
                  <input
                    className="h-11 rounded-[7px] border border-[#1e5f3f]/20 bg-[#fffdf3] px-3 text-base text-[#143a29] outline-none transition focus:border-[#2f8f5b]"
                    min={0}
                    max={999}
                    type="number"
                    value={counts[field.key]}
                    onChange={(event) => updateCount(field.key, Number(event.target.value))}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[8px] border border-[#1e5f3f]/18 bg-[#163f2c] p-4 shadow-[0_24px_60px_rgba(20,58,41,0.2)] sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#ffd65a]/72">Generated layout</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {plan.estimatedShelfRows} rows, {plan.estimatedWidthInches} inches
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ToolButton label="Reset" onClick={resetLayout}>
                    <RefreshCw size={16} />
                  </ToolButton>
                  <ToolButton label="Save" onClick={saveBuild}>
                    <Save size={16} />
                  </ToolButton>
                  <ToolButton label="Share" onClick={shareBuild}>
                    <Share2 size={16} />
                  </ToolButton>
                  <ToolButton label="Export" onClick={exportImage}>
                    <Download size={16} />
                  </ToolButton>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="relative min-h-32 rounded-[6px] border-b-[10px] border-[#9a7a43] bg-white/[0.045] px-2 pb-4"
                  >
                    <div className="flex min-h-28 items-end gap-3 overflow-x-auto py-2">
                      {row.map((item) => (
                        <button
                          key={item.id}
                          className={cn(
                            "group relative grid place-items-center rounded-[8px] border border-white/12 bg-[#fff8df] p-2 text-[#143a29] transition hover:border-[#ffd65a] focus-ring",
                            item.span === 2 ? "min-w-36" : "min-w-24"
                          )}
                          type="button"
                          draggable
                          onDragStart={() => setDraggedItemId(item.id)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() => moveItem(item.id)}
                          title={`Drag to rearrange ${item.label}`}
                        >
                          <GripVertical size={13} className="absolute left-1 top-1 text-[#28533a]/35" />
                          <ShelfItemVisual item={item} protectedMode size="builder" showLabel />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[8px] border border-[#1e5f3f]/15 bg-white/78 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#2f8f5b]">Recommended products</p>
                <div className="mt-5 grid gap-3">
                  {plan.recommendations.map((recommendation) => (
                    <div
                      key={recommendation.productName}
                      className="grid grid-cols-[3rem_1fr] gap-3 rounded-[8px] border border-[#1e5f3f]/12 bg-[#fffdf3] p-3"
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-[8px] border border-[#ffd65a] bg-[#ffd65a]/22 text-sm font-semibold text-[#143a29]">
                        {recommendation.quantity}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#143a29]">{recommendation.productName}</p>
                        <p className="mt-1 text-xs leading-5 text-[#28533a]/66">{recommendation.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[8px] border border-[#1e5f3f]/15 bg-white/78 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#2f8f5b]">Display upgrades</p>
                <div className="mt-5 grid gap-3">
                  {plan.upgradeNotes.map((note) => (
                    <div key={note} className="flex gap-3 rounded-[8px] border border-[#1e5f3f]/12 bg-[#fffdf3] p-3">
                      <ArrowRight size={16} className="mt-1 shrink-0 text-[#2f8f5b]" />
                      <p className="text-sm leading-6 text-[#28533a]/72">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolButton({
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
      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-white/16 bg-white/[0.08] px-3 text-sm text-white/78 transition hover:border-[#ffd65a]/70 hover:text-white focus-ring"
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
