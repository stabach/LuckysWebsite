"use client";

import { NeonSign } from "@/components/brand/neon-sign";
import { useSessionIntro } from "@/hooks/use-session-intro";

export function NeonOpener() {
  const { phase, canSkip, reducedMotion, isVisible, skip } = useSessionIntro();

  if (!isVisible) return null;

  return (
    <div className={`neon-opener neon-opener-${phase}`} data-testid="neon-opener">
      <div className="neon-opener-wall" aria-hidden="true" />
      <NeonSign eager reducedMotion={reducedMotion} />
      {canSkip ? (
        <button className="neon-skip" type="button" onClick={skip}>
          Skip intro
        </button>
      ) : null}
    </div>
  );
}
