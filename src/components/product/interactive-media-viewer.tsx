"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import type { KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { ProductMedia } from "@/lib/catalog-schema";
import { clampScrubTime, getScrubTimeFromDrag } from "@/lib/media";

type SpinMedia = Extract<ProductMedia, { type: "spin" }>;

export function InteractiveMediaViewer({ media }: { media: SpinMedia }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dragRef = useRef<{ x: number; time: number } | null>(null);
  const pendingTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = shellRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    },
    []
  );

  function setVideoTime(nextTime: number) {
    const video = videoRef.current;
    const next = clampScrubTime(nextTime, duration);
    if (video) video.currentTime = next;
    setTime(next);
  }

  function scheduleVideoTime(nextTime: number) {
    pendingTimeRef.current = nextTime;
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(() => {
      if (pendingTimeRef.current !== null) setVideoTime(pendingTimeRef.current);
      pendingTimeRef.current = null;
      animationFrameRef.current = null;
    });
  }

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video || failed) return;
    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!duration || failed) return;
    videoRef.current?.pause();
    setPlaying(false);
    dragRef.current = { x: event.clientX, time };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || !duration) return;
    scheduleVideoTime(
      getScrubTimeFromDrag({
        startTime: drag.time,
        deltaX: event.clientX - drag.x,
        duration,
        pixelsForFullDuration: Math.max(280, event.currentTarget.clientWidth * 0.72)
      })
    );
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!duration) return;
    const step = Math.max(duration / 40, 0.1) * (event.shiftKey ? 4 : 1);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setVideoTime(time + step);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setVideoTime(time - step);
    } else if (event.key === "Home") {
      event.preventDefault();
      setVideoTime(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setVideoTime(duration);
    } else if (event.key === " ") {
      event.preventDefault();
      void togglePlayback();
    }
  }

  const percent = duration ? Math.round((time / duration) * 100) : 0;

  function retry() {
    const video = videoRef.current;
    if (!video) return;
    setFailed(false);
    setActive(true);
    video.load();
  }

  return (
    <div ref={shellRef} className="interactive-viewer">
      <div
        className={`interactive-viewer-stage${dragging ? " is-dragging" : ""}`}
        role="slider"
        tabIndex={0}
        aria-label="Inspect interactive product view"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}% through the product view`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          poster={media.poster}
          aria-label={media.alt}
          onLoadedMetadata={(event) => {
            setDuration(event.currentTarget.duration);
            setTime(event.currentTarget.currentTime);
          }}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => setFailed(true)}
        >
          {active && media.webm ? <source src={media.webm} type="video/webm" /> : null}
          {active && media.mp4 ? <source src={media.mp4} type="video/mp4" /> : null}
        </video>
        <span className="interactive-viewer-progress">{failed ? "Static preview" : `${percent}%`}</span>
      </div>
      <div className="interactive-viewer-controls">
        <button className="icon-button" type="button" onClick={failed ? retry : togglePlayback} aria-label={failed ? "Retry interactive view" : playing ? "Pause interactive view" : "Play interactive view"}>
          {failed ? <RotateCcw size={18} aria-hidden="true" /> : playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
        </button>
        <label>
          <span className="sr-only">Scrub interactive product view</span>
          <input
            type="range"
            min="0"
            max={duration || 10.084}
            step="0.04"
            value={time}
            disabled={failed}
            onChange={(event) => {
              videoRef.current?.pause();
              setPlaying(false);
              setVideoTime(Number(event.target.value));
            }}
          />
        </label>
        <button className="icon-button" type="button" onClick={() => setVideoTime(0)} disabled={failed} aria-label="Reset interactive view">
          <RotateCcw size={18} aria-hidden="true" />
        </button>
      </div>
      <p className="interactive-viewer-help">
        {failed ? "The static product preview remains available." : "Drag across the product, use the slider, or press the arrow keys to inspect the view."}
      </p>
    </div>
  );
}
