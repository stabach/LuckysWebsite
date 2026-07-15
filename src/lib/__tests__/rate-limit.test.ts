import { describe, expect, it } from "vitest";
import { consumeRateLimit } from "@/lib/rate-limit";

describe("rate limiting", () => {
  it("limits a client within the window and allows it after expiry", () => {
    const namespace = `test-${Math.random()}`;
    const options = { maximum: 2, windowMs: 1_000 };
    expect(consumeRateLimit(namespace, "client", 0, options)).toBe(true);
    expect(consumeRateLimit(namespace, "client", 100, options)).toBe(true);
    expect(consumeRateLimit(namespace, "client", 200, options)).toBe(false);
    expect(consumeRateLimit(namespace, "client", 1_101, options)).toBe(true);
  });
});
