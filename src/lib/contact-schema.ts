import { z } from "zod";

export const contactCategories = [
  "Product Fit Question",
  "Existing Order",
  "Local Pickup",
  "Event Pickup",
  "Bulk Order",
  "Custom Engraving",
  "General Question"
] as const;

export type ContactCategory = (typeof contactCategories)[number];

export const ContactPayloadSchema = z
  .object({
    category: z.enum(contactCategories),
    name: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(254),
    orderNumber: z.string().trim().max(80).default(""),
    product: z.string().trim().max(160).default(""),
    subject: z.string().trim().min(2).max(150),
    message: z.string().trim().min(10).max(4000),
    website: z.string().trim().max(240).default("")
  })
  .superRefine((payload, context) => {
    if (payload.category === "Existing Order" && !payload.orderNumber) {
      context.addIssue({
        code: "custom",
        path: ["orderNumber"],
        message: "Enter the order number for order help."
      });
    }

    if (
      ["Product Fit Question", "Custom Engraving"].includes(payload.category) &&
      !payload.product
    ) {
      context.addIssue({
        code: "custom",
        path: ["product"],
        message: "Choose the product connected to this question."
      });
    }
  });

export type ContactPayload = z.infer<typeof ContactPayloadSchema>;

export function getContactCategoryFromTopic(topic: string | undefined): ContactCategory {
  const categoryByTopic: Record<string, ContactCategory> = {
    "product-fit": "Product Fit Question",
    fit: "Product Fit Question",
    order: "Existing Order",
    account: "Existing Order",
    pickup: "Local Pickup",
    "event-pickup": "Event Pickup",
    bulk: "Bulk Order",
    engraving: "Custom Engraving",
    cart: "General Question"
  };

  return (topic && categoryByTopic[topic]) || "General Question";
}
