"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";

export function FeaturedProductMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
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

  function scrub(value: number) {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.pause();
    setPlaying(false);
    video.currentTime = value;
    setProgress(value);
  }

  function reset() {
    scrub(0);
  }

  return (
    <div className="featured-media-shell">
      <div className="featured-video-window">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          poster="/media/crystal-slab-interactive-poster.webp"
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
          onEnded={() => setPlaying(false)}
          aria-label="Rotating product view of the PSA Graded Guard Fit Acrylic Case"
        >
          <source src="/media/crystal-slab-interactive.mp4" type="video/mp4" />
        </video>
        <span className="hotspot hotspot-panel">Clear panels</span>
      </div>
      <div className="featured-media-controls">
        <button type="button" className="icon-button" onClick={togglePlayback} aria-label={playing ? "Pause product view" : "Play product view"}>
          {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
        </button>
        <label>
          <span className="sr-only">Rotate product view</span>
          <input
            type="range"
            min="0"
            max={duration || 10.084}
            step="0.04"
            value={progress}
            onChange={(event) => scrub(Number(event.target.value))}
          />
        </label>
        <button type="button" className="icon-button" onClick={reset} aria-label="Reset product view">
          <RotateCcw size={18} aria-hidden="true" />
        </button>
      </div>
      <p>Drag the control or use arrow keys to inspect the view.</p>
    </div>
  );
}
