import { describe, expect, it } from "vitest";
import { clampScrubTime, getScrubTimeFromDrag } from "@/lib/media";

describe("interactive media scrubbing", () => {
  it("clamps time to the video duration", () => {
    expect(clampScrubTime(-2, 10)).toBe(0);
    expect(clampScrubTime(12, 10)).toBe(10);
    expect(clampScrubTime(4.25, 10)).toBe(4.25);
  });

  it("maps horizontal drag distance to a bounded time", () => {
    expect(getScrubTimeFromDrag({ startTime: 2, deltaX: 210, duration: 10 })).toBe(7);
    expect(getScrubTimeFromDrag({ startTime: 2, deltaX: -420, duration: 10 })).toBe(0);
  });

  it("handles missing metadata safely", () => {
    expect(clampScrubTime(2, 0)).toBe(0);
  });
});
