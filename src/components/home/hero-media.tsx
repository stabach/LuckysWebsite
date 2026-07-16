"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterReady, setPosterReady] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);

  const playPreview = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.currentTime = 0;
      await video.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (!posterReady) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    if (reducedMotion || saveData) return;

    setVideoEnabled(true);
    const start = () => window.setTimeout(playPreview, 80);
    if (document.documentElement.dataset.intro === "complete") {
      const timer = start();
      return () => window.clearTimeout(timer);
    }

    window.addEventListener("luckys:intro-complete", start, { once: true });
    return () => window.removeEventListener("luckys:intro-complete", start);
  }, [playPreview, posterReady]);

  return (
    <div className="hero-media-card">
      <Image
        src="/media/crystal-slab-interactive-poster.webp"
        alt="Crystal Slab Acrylic Case shown in an interactive product preview"
        fill
        priority
        sizes="(max-width: 840px) 94vw, 48vw"
        className="hero-media-poster"
        onLoad={() => setPosterReady(true)}
      />
      {videoEnabled ? (
        <video
          ref={videoRef}
          className="hero-media-video"
          muted
          playsInline
          loop
          preload="metadata"
          poster="/media/crystal-slab-interactive-poster.webp"
          onPause={() => setPlaying(false)}
          aria-label="Muted interactive preview of the Crystal Slab Acrylic Case"
        >
          <source src="/media/crystal-slab-interactive.mp4" type="video/mp4" />
        </video>
      ) : null}
      <div className="hero-media-vignette" aria-hidden="true" />
      <div className="hero-media-label">
        <span className="micro-badge">Interactive view</span>
        <strong>Crystal Slab Acrylic Case</strong>
        <span>$13.00</span>
      </div>
      {videoEnabled && !playing ? (
        <button className="hero-replay" type="button" onClick={playPreview} aria-label="Replay product preview">
          <Play size={16} fill="currentColor" aria-hidden="true" /> Replay
        </button>
      ) : null}
    </div>
  );
}
