import { describe, expect, it } from "vitest";
import {
  getNeonIntroDuration,
  neonIntroTiming,
  NEON_INTRO_SESSION_KEY
} from "@/hooks/use-session-intro";

describe("neon intro behavior", () => {
  it("uses the full timeline for standard motion", () => {
    expect(getNeonIntroDuration(false)).toBe(1700);
  });

  it("reduces the opener to a short static transition", () => {
    expect(getNeonIntroDuration(true)).toBe(250);
  });

  it("keeps the skip threshold and session key stable", () => {
    expect(neonIntroTiming.skipDelayMs).toBe(250);
    expect(NEON_INTRO_SESSION_KEY).toBe("luckys-neon-intro-v2");
  });
});
