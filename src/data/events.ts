import { z } from "zod";

export const StoreEventSchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().min(1),
    status: z.enum(["draft", "published", "cancelled"]),
    title: z.string().min(1),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    timezone: z.literal("America/Chicago"),
    venue: z.string().min(1),
    address: z.string().min(1),
    image: z.string().min(1),
    mapUrl: z.string().url(),
    detailsUrl: z.string().url().optional(),
    pickupEnabled: z.boolean(),
    pickupCutoffAt: z.string().datetime().optional()
  })
  .superRefine((event, context) => {
    if (Date.parse(event.endAt) <= Date.parse(event.startAt)) {
      context.addIssue({ code: "custom", path: ["endAt"], message: "Event end must follow start." });
    }
    if (event.pickupCutoffAt && Date.parse(event.pickupCutoffAt) > Date.parse(event.endAt)) {
      context.addIssue({
        code: "custom",
        path: ["pickupCutoffAt"],
        message: "Pickup cutoff cannot follow the event end."
      });
    }
  });

export type StoreEvent = z.infer<typeof StoreEventSchema>;

// No event currently has a verified year, machine-readable schedule, and pickup cutoff.
// Add only owner-confirmed events here; stale legacy flyer dates are intentionally omitted.
const verifiedStoreEvents: ReadonlyArray<StoreEvent> = [];

const e2ePickupFixture: StoreEvent = {
  id: "e2e-pickup-fixture",
  slug: "e2e-pickup-fixture",
  status: "published",
  title: "Playwright Pickup Fixture",
  startAt: "2099-07-20T15:00:00.000Z",
  endAt: "2099-07-20T21:00:00.000Z",
  timezone: "America/Chicago",
  venue: "Automated QA Venue",
  address: "Richmond, Texas",
  image: "/brand/luckys-loot-neon-poster.webp",
  mapUrl: "https://maps.google.com/?q=Richmond%2C+Texas",
  pickupEnabled: true,
  pickupCutoffAt: "2099-07-19T22:00:00.000Z"
};

export const storeEvents: ReadonlyArray<StoreEvent> = z.array(StoreEventSchema).parse(
  process.env.NEXT_PUBLIC_E2E_FIXTURES === "true"
    ? [...verifiedStoreEvents, e2ePickupFixture]
    : verifiedStoreEvents
);
