"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterReady, setPosterReady] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);

  const playPreview = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.currentTime = 0;
      await video.play();
    } catch {}
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
        src="/media/homepage-acrylic-poster.webp"
        alt="PSA Graded Guard Fit Acrylic Case shown in a rotating product preview"
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
          autoPlay
          loop
          preload="metadata"
          poster="/media/homepage-acrylic-poster.webp"
          aria-label="Muted rotating preview of the PSA Graded Guard Fit Acrylic Case"
        >
          <source src="/media/homepage-acrylic-boomerang.mp4" type="video/mp4" />
        </video>
      ) : null}
      <div className="hero-media-vignette" aria-hidden="true" />
      <div className="hero-media-label">
        <Link className="hero-media-product-link" href="/products/crystal-slab-acrylic-case">
          <strong>PSA Graded Guard Fit Acrylic Case</strong>
        </Link>
        <span>$13.00</span>
      </div>
    </div>
  );
}
