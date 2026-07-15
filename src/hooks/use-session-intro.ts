"use client";

import { useCallback, useEffect, useState } from "react";

export const NEON_INTRO_SESSION_KEY = "luckys-neon-intro-v2";

export const neonIntroTiming = {
  standardDurationMs: 1700,
  reducedMotionDurationMs: 250,
  skipDelayMs: 250,
  exitLeadMs: 380
} as const;

export function getNeonIntroDuration(reducedMotion: boolean) {
  return reducedMotion
    ? neonIntroTiming.reducedMotionDurationMs
    : neonIntroTiming.standardDurationMs;
}

type IntroPhase = "checking" | "playing" | "ending" | "complete";

export function useSessionIntro() {
  const [phase, setPhase] = useState<IntroPhase>("checking");
  const [canSkip, setCanSkip] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const complete = useCallback(() => {
    setPhase("complete");
    document.documentElement.dataset.intro = "complete";
    window.dispatchEvent(new CustomEvent("luckys:intro-complete"));
  }, []);

  useEffect(() => {
    let hasPlayed = false;
    try {
      hasPlayed = window.sessionStorage.getItem(NEON_INTRO_SESSION_KEY) === "seen";
    } catch {
      hasPlayed = false;
    }

    if (hasPlayed) {
      complete();
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = motionQuery.matches;
    const duration = getNeonIntroDuration(prefersReducedMotion);
    setReducedMotion(prefersReducedMotion);
    setPhase("playing");
    document.documentElement.dataset.intro = "active";

    try {
      window.sessionStorage.setItem(NEON_INTRO_SESSION_KEY, "seen");
    } catch {
      // The opener still completes when session storage is unavailable.
    }

    const skipTimer = window.setTimeout(() => setCanSkip(true), neonIntroTiming.skipDelayMs);
    const exitTimer = window.setTimeout(
      () => {
        setPhase("ending");
        document.documentElement.dataset.intro = "ending";
      },
      Math.max(0, duration - neonIntroTiming.exitLeadMs)
    );
    const completeTimer = window.setTimeout(complete, duration);

    return () => {
      window.clearTimeout(skipTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [complete]);

  return {
    phase,
    canSkip,
    reducedMotion,
    isVisible: phase !== "complete",
    skip: complete
  };
}
