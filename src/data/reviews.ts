import { z } from "zod";

export const StoreReviewSchema = z.object({
  id: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1),
  body: z.string().min(1),
  productId: z.string().min(1),
  customerDisplayImage: z.string().min(1).optional(),
  verifiedPurchase: z.boolean(),
  createdAt: z.string().datetime(),
  moderationStatus: z.enum(["pending", "published", "rejected"])
});

export type StoreReview = z.infer<typeof StoreReviewSchema>;

// No customer review or display-photo publication permission is verified yet.
export const storeReviews: ReadonlyArray<StoreReview> = z.array(StoreReviewSchema).parse([]);
