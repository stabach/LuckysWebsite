import { describe, expect, it } from "vitest";
import { findFit } from "@/lib/fitment";

describe("Fit Finder", () => {
  it("matches a standard ETB to the ETB case", () => {
    const result = findFit({ item: "etb", format: "standard", goal: "display" });
    expect(result.confidence).toBe("exact");
    expect(result.product?.id).toBe("acrylic-etb-case");
  });

  it("matches an English booster box to the booster-box case", () => {
    const result = findFit({ item: "booster-box", format: "english", goal: "display" });
    expect(result.confidence).toBe("exact");
    expect(result.product?.id).toBe("acrylic-booster-box-case");
  });

  it("returns a measure-first warning for an unknown specialty size", () => {
    const result = findFit({ item: "booster-box", format: "japanese-specialty", goal: "display" });
    expect(result.confidence).toBe("measure-first");
    expect(result.warnings.join(" ")).toMatch(/Measure/i);
  });

  it("matches a guarded PSA-style slab to the Crystal Slab case", () => {
    const result = findFit({ item: "graded-slab", format: "guarded-psa", goal: "display" });
    expect(result.confidence).toBe("exact");
    expect(result.product?.id).toBe("acrylic-crystal-slab-case");
  });

  it("does not force a product for an unsupported slab", () => {
    const result = findFit({ item: "graded-slab", format: "other-grader", goal: "display" });
    expect(result.confidence).toBe("unsupported");
    expect(result.product).toBeNull();
  });
});
