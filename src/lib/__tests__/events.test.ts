import { describe, expect, it, vi } from "vitest";
import { StoreEventSchema, type StoreEvent } from "@/data/events";
import {
  createEventCalendar,
  getEligiblePickupEvents,
  getEventTiming,
  getPublishedEvents,
  isEventPickupEligible
} from "@/lib/events";

const futureEvent: StoreEvent = {
  id: "test-event",
  slug: "test-event",
  status: "published",
  title: "Collector Show",
  startAt: "2026-08-20T15:00:00.000Z",
  endAt: "2026-08-20T22:00:00.000Z",
  timezone: "America/Chicago",
  venue: "Test Hall",
  address: "100 Main Street, Houston, TX",
  image: "/test.webp",
  mapUrl: "https://maps.example.test",
  pickupEnabled: true,
  pickupCutoffAt: "2026-08-19T22:00:00.000Z"
};

describe("events", () => {
  it("rejects invalid machine-readable event ranges", () => {
    expect(
      StoreEventSchema.safeParse({
        ...futureEvent,
        endAt: "2026-08-20T14:00:00.000Z"
      }).success
    ).toBe(false);
  });

  it("derives upcoming, happening-today, and past timing from ISO dates", () => {
    expect(getEventTiming(futureEvent, new Date("2026-08-19T12:00:00.000Z"))).toBe("upcoming");
    expect(getEventTiming(futureEvent, new Date("2026-08-20T18:00:00.000Z"))).toBe("today");
    expect(getEventTiming(futureEvent, new Date("2026-08-21T12:00:00.000Z"))).toBe("past");
  });

  it("enforces publication, event end, and pickup cutoff", () => {
    expect(isEventPickupEligible(futureEvent, new Date("2026-08-19T12:00:00.000Z"))).toBe(true);
    expect(isEventPickupEligible(futureEvent, new Date("2026-08-20T12:00:00.000Z"))).toBe(false);
    expect(getEligiblePickupEvents([futureEvent], new Date("2026-08-19T12:00:00.000Z"))).toHaveLength(1);
    expect(getPublishedEvents([{ ...futureEvent, status: "draft" }])).toHaveLength(0);
  });

  it("creates a standards-based downloadable calendar payload", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-15T12:00:00.000Z"));
    const calendar = createEventCalendar(futureEvent);

    expect(calendar).toContain("BEGIN:VCALENDAR");
    expect(calendar).toContain("DTSTART:20260820T150000Z");
    expect(calendar).toContain("SUMMARY:Collector Show");
    expect(calendar).toContain("LOCATION:Test Hall\\, 100 Main Street\\, Houston\\, TX");
    expect(calendar).toContain("END:VCALENDAR");
    vi.useRealTimers();
  });
});
