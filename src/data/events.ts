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
export const storeEvents: ReadonlyArray<StoreEvent> = z.array(StoreEventSchema).parse([]);
