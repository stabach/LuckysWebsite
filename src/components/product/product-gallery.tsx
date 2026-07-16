"use client";

import { Maximize2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { SpinViewer } from "@/components/media/spin-viewer";
import type { ProductMedia } from "@/lib/catalog-schema";

export function ProductGallery({ media, productName }: { media: ReadonlyArray<ProductMedia>; productName: string }) {
  const [selectedId, setSelectedId] = useState(media[0]?.id ?? "");
  const selected = media.find((item) => item.id === selectedId) ?? media[0];
  if (!selected) return null;
  const isLoopingPreview = selected.type === "video" && selected.autoplayPreview === true;
  const isBinderImage =
    (selected.type === "image" || selected.type === "diagram") && selected.src.startsWith("/products/binders/");

  return (
    <div className="product-gallery">
      <div className={`product-gallery-main product-gallery-${selected.type}${isLoopingPreview ? " is-looping-preview" : ""}${isBinderImage ? " product-gallery-binder" : ""}`}>
        {selected.type === "image" || selected.type === "diagram" ? (
          <Image
            src={selected.src}
            alt={selected.alt}
            fill
            priority={selected.id === media[0]?.id}
            sizes="(max-width: 900px) 94vw, 56vw"
          />
        ) : selected.type === "spin" ? (
          <SpinViewer media={selected} />
        ) : (
          <video
            muted
            playsInline
            controls={!selected.autoplayPreview}
            autoPlay={selected.autoplayPreview}
            loop={selected.autoplayPreview}
            preload={selected.autoplayPreview ? "auto" : "metadata"}
            poster={selected.poster}
            aria-label={selected.alt}
          >
            {selected.webm ? <source src={selected.webm} type="video/webm" /> : null}
            <source src={selected.mp4} type="video/mp4" />
          </video>
        )}
        {selected.type === "image" ? <span className="media-type-label"><Maximize2 size={14} aria-hidden="true" /> Product image</span> : null}
      </div>
      {media.length > 1 ? (
        <div className="product-gallery-thumbs" aria-label={`${productName} media`}>
          {media.map((item) => {
            const src = item.type === "image" || item.type === "diagram" ? item.src : item.poster;
            return (
              <button
                type="button"
                key={item.id}
                className={item.id === selected.id ? "is-selected" : undefined}
                onClick={() => setSelectedId(item.id)}
                aria-label={item.type === "spin" ? "Show interactive product view" : `Show ${item.alt}`}
                aria-pressed={item.id === selected.id}
              >
                <Image src={src} alt="" fill sizes="80px" />
                {item.type === "spin" ? <span>View</span> : null}
                {item.type === "video" && item.autoplayPreview ? <span>Loop</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
