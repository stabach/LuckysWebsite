import type { StoreEvent } from "@/data/events";

export type EventTiming = "upcoming" | "today" | "past";

export function getPublishedEvents(events: ReadonlyArray<StoreEvent>) {
  return events
    .filter((event) => event.status === "published")
    .sort((left, right) => Date.parse(left.startAt) - Date.parse(right.startAt));
}

export function getEventTiming(event: StoreEvent, now = new Date()): EventTiming {
  const nowTime = now.getTime();
  const startTime = Date.parse(event.startAt);
  const endTime = Date.parse(event.endAt);

  if (nowTime > endTime) return "past";
  if (nowTime >= startTime && nowTime <= endTime) return "today";
  return "upcoming";
}

export function isEventPickupEligible(event: StoreEvent, now = new Date()) {
  if (event.status !== "published" || !event.pickupEnabled) return false;
  if (getEventTiming(event, now) === "past") return false;

  return event.pickupCutoffAt ? now.getTime() <= Date.parse(event.pickupCutoffAt) : true;
}

export function getEligiblePickupEvents(events: ReadonlyArray<StoreEvent>, now = new Date()) {
  return getPublishedEvents(events).filter((event) => isEventPickupEligible(event, now));
}

export function getEventById(events: ReadonlyArray<StoreEvent>, eventId: string) {
  return events.find((event) => event.id === eventId);
}

export function getEventBySlug(events: ReadonlyArray<StoreEvent>, slug: string) {
  return events.find((event) => event.slug === slug);
}

export function createEventCalendar(event: StoreEvent) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lucky's Loot//Store Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeCalendarText(`${event.id}@luckys-loot`)}`,
    `DTSTAMP:${toCalendarUtc(new Date())}`,
    `DTSTART:${toCalendarUtc(new Date(event.startAt))}`,
    `DTEND:${toCalendarUtc(new Date(event.endAt))}`,
    `SUMMARY:${escapeCalendarText(event.title)}`,
    `LOCATION:${escapeCalendarText(`${event.venue}, ${event.address}`)}`,
    `DESCRIPTION:${escapeCalendarText("Lucky's Loot event details and pickup availability are listed on the storefront.")}`,
    `URL:${escapeCalendarText(event.detailsUrl ?? event.mapUrl)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    ""
  ];

  return lines.join("\r\n");
}

export function getGoogleCalendarUrl(event: StoreEvent) {
  const parameters = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCalendarUtc(new Date(event.startAt))}/${toCalendarUtc(new Date(event.endAt))}`,
    location: `${event.venue}, ${event.address}`,
    details: event.detailsUrl ?? event.mapUrl
  });

  return `https://calendar.google.com/calendar/render?${parameters.toString()}`;
}

export function formatEventDateRange(event: StoreEvent) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: event.timezone,
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const start = new Date(event.startAt);
  const end = new Date(event.endAt);

  return formatter.formatRange(start, end);
}

export function formatEventTimeRange(event: StoreEvent) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: event.timezone,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  });

  return formatter.formatRange(new Date(event.startAt), new Date(event.endAt));
}

function toCalendarUtc(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeCalendarText(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}
