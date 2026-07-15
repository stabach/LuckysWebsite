"use client";

import { RotateCcw } from "lucide-react";
import Image from "next/image";
import type { KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { InteractiveMediaViewer } from "@/components/product/interactive-media-viewer";
import type { ProductMedia } from "@/lib/catalog-schema";
import { getSequenceFrameUrl } from "@/lib/media";

type SpinMedia = Extract<ProductMedia, { type: "spin" }>;

export function SpinViewer({ media }: { media: SpinMedia }) {
  return media.mode === "image-sequence" ? (
    <ImageSequenceViewer media={media} />
  ) : (
    <InteractiveMediaViewer media={media} />
  );
}

function ImageSequenceViewer({ media }: { media: SpinMedia }) {
  const frameCount = media.frameCount ?? 1;
  const framePattern = media.framePattern ?? "";
  const dragRef = useRef<{ x: number; frame: number } | null>(null);
  const [frame, setFrame] = useState(0);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const order = Array.from({ length: frameCount }, (_, offset) =>
      (Math.ceil(offset / 2) * (offset % 2 ? 1 : -1) + frameCount) % frameCount
    );

    async function preloadFrames() {
      for (const frameIndex of order) {
        if (cancelled) return;
        await new Promise<void>((resolve) => {
          const image = new window.Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = getSequenceFrameUrl(framePattern, frameIndex);
        });
        if (cancelled) return;
        loaded += 1;
        setLoadedFrames(loaded);
        await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
      }
    }

    void preloadFrames();

    return () => {
      cancelled = true;
    };
  }, [frameCount, framePattern]);

  function resolveFrame(nextFrame: number) {
    if (media.isFullRotation) {
      return ((nextFrame % frameCount) + frameCount) % frameCount;
    }
    return Math.min(Math.max(nextFrame, 0), frameCount - 1);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = { x: event.clientX, frame };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const delta = event.clientX - drag.x;
    if (Math.abs(delta) < 6) return;
    const frameDelta = Math.round((delta / Math.max(event.currentTarget.clientWidth, 280)) * frameCount);
    setFrame(resolveFrame(drag.frame + frameDelta));
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 5 : 1;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      setFrame(resolveFrame(frame + (event.key === "ArrowRight" ? step : -step)));
    } else if (event.key === "Home") {
      event.preventDefault();
      setFrame(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setFrame(frameCount - 1);
    }
  }

  return (
    <div className="interactive-viewer">
      <div
        className="interactive-viewer-stage"
        role="slider"
        tabIndex={0}
        aria-label={media.alt}
        aria-valuemin={1}
        aria-valuemax={frameCount}
        aria-valuenow={frame + 1}
        aria-valuetext={`Frame ${frame + 1} of ${frameCount}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        <Image
          className="interactive-sequence-frame"
          src={failed ? media.poster : getSequenceFrameUrl(framePattern, frame)}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 900px) 94vw, 56vw"
          onError={() => setFailed(true)}
        />
        <span className="interactive-viewer-badge">Interactive View</span>
        <span className="interactive-viewer-progress">
          {failed ? "Static preview" : `${loadedFrames}/${frameCount}`}
        </span>
      </div>
      <div className="interactive-viewer-controls">
        <span aria-hidden="true" />
        <label>
          <span className="sr-only">Choose product-view frame</span>
          <input
            type="range"
            min="0"
            max={frameCount - 1}
            value={frame}
            onChange={(event) => setFrame(Number(event.target.value))}
          />
        </label>
        <button
          className="icon-button"
          type="button"
          onClick={() => {
            setFailed(false);
            setFrame(0);
          }}
          aria-label={failed ? "Retry interactive view" : "Reset interactive view"}
        >
          <RotateCcw size={18} aria-hidden="true" />
        </button>
      </div>
      <p className="interactive-viewer-help">
        {failed
          ? "The static product preview remains available."
          : "Drag across the product or use the arrow keys to inspect each frame."}
      </p>
    </div>
  );
}
