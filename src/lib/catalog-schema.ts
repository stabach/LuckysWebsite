import { z } from "zod";

export const ProductStatusSchema = z.enum(["active", "draft", "archived"]);
export const StockStatusSchema = z.enum([
  "in_stock",
  "low_stock",
  "out_of_stock",
  "made_to_order"
]);

const ImageMediaSchema = z.object({
  id: z.string().min(1),
  type: z.literal("image"),
  src: z.string().startsWith("/"),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive()
});

const VideoMediaSchema = z.object({
  id: z.string().min(1),
  type: z.literal("video"),
  mp4: z.string().startsWith("/"),
  webm: z.string().startsWith("/").optional(),
  poster: z.string().startsWith("/"),
  alt: z.string().min(1),
  autoplayPreview: z.boolean().optional()
});

const SpinMediaSchema = z
  .object({
    id: z.string().min(1),
    type: z.literal("spin"),
    mode: z.enum(["video-scrub", "image-sequence"]),
    poster: z.string().startsWith("/"),
    alt: z.string().min(1),
    mp4: z.string().startsWith("/").optional(),
    webm: z.string().startsWith("/").optional(),
    framePattern: z.string().optional(),
    frameCount: z.number().int().positive().optional(),
    frameWidth: z.number().int().positive().optional(),
    frameHeight: z.number().int().positive().optional(),
    isFullRotation: z.boolean()
  })
  .superRefine((media, context) => {
    if (media.mode === "video-scrub" && !media.mp4) {
      context.addIssue({
        code: "custom",
        message: "Video-scrub media requires an MP4 source.",
        path: ["mp4"]
      });
    }

    if (
      media.mode === "image-sequence" &&
      (!media.framePattern || !media.frameCount || !media.frameWidth || !media.frameHeight)
    ) {
      context.addIssue({
        code: "custom",
        message: "Image-sequence media requires a pattern, count, width, and height."
      });
    }
  });

const DiagramMediaSchema = z.object({
  id: z.string().min(1),
  type: z.literal("diagram"),
  src: z.string().startsWith("/"),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive()
});

export const ProductMediaSchema = z.union([
  ImageMediaSchema,
  VideoMediaSchema,
  SpinMediaSchema,
  DiagramMediaSchema
]);

export const BulkPricingTierSchema = z.object({
  minimumQuantity: z.number().int().positive(),
  unitPriceCents: z.number().int().nonnegative(),
  label: z.string().min(1)
});

export const ProductVariantSchema = z.object({
  id: z.string().min(1),
  sku: z.string().min(1),
  label: z.string().min(1),
  color: z.string().min(1).optional(),
  colorHex: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
  image: z.string().startsWith("/").optional(),
  priceCents: z.number().int().nonnegative().optional(),
  stockQuantity: z.number().int().nonnegative().nullable().optional(),
  status: StockStatusSchema,
  active: z.boolean()
});

export const ProductSpecificationSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  verified: z.boolean()
});

export const ProductFeatureSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  verified: z.boolean()
});

export const ProductSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sku: z.string().min(1),
  status: ProductStatusSchema,
  categoryId: z.string().min(1),
  collectionIds: z.array(z.string().min(1)).min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  eyebrow: z.string().min(1).optional(),
  summary: z.string().min(1),
  description: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  compareAtPriceCents: z.number().int().positive().optional(),
  stockStatus: StockStatusSchema,
  stockQuantity: z.number().int().nonnegative().nullable().optional(),
  maxPerOrder: z.number().int().positive().default(20),
  images: z.array(ProductMediaSchema).min(1),
  variants: z.array(ProductVariantSchema).min(1),
  bulkPricing: z.array(BulkPricingTierSchema).optional(),
  fitment: z.array(z.string().min(1)),
  fitmentWarnings: z.array(z.string().min(1)).optional(),
  specifications: z.array(ProductSpecificationSchema),
  features: z.array(ProductFeatureSchema),
  faq: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1)
    })
  ),
  relatedProductIds: z.array(z.string().min(1)),
  badges: z.array(z.string().min(1)).optional(),
  keywords: z.array(z.string().min(1)),
  requiresPickupNotes: z.boolean().optional(),
  requiresQuote: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative()
});

export const CategorySchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().startsWith("/"),
  alt: z.string().min(1),
  sortOrder: z.number().int().nonnegative()
});

export const CollectionSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  description: z.string().min(1),
  intent: z.string().min(1),
  sortOrder: z.number().int().nonnegative()
});

export type ProductStatus = z.infer<typeof ProductStatusSchema>;
export type StockStatus = z.infer<typeof StockStatusSchema>;
export type ProductMedia = z.infer<typeof ProductMediaSchema>;
export type BulkPricingTier = z.infer<typeof BulkPricingTierSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type ProductSpecification = z.infer<typeof ProductSpecificationSchema>;
export type ProductFeature = z.infer<typeof ProductFeatureSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Collection = z.infer<typeof CollectionSchema>;
