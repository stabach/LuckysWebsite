import { describe, expect, it } from "vitest";
import { ContactPayloadSchema, getContactCategoryFromTopic } from "@/lib/contact-schema";

const validPayload = {
  category: "General Question",
  name: "Lucky Collector",
  email: "collector@example.com",
  orderNumber: "",
  product: "",
  subject: "Product question",
  message: "Could you help me choose a product?",
  website: ""
};

describe("contact validation", () => {
  it("accepts a valid general question and trims fields", () => {
    const result = ContactPayloadSchema.safeParse({ ...validPayload, name: "  Lucky Collector  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Lucky Collector");
  });

  it("requires order and product context only for the relevant categories", () => {
    expect(
      ContactPayloadSchema.safeParse({ ...validPayload, category: "Existing Order" }).success
    ).toBe(false);
    expect(
      ContactPayloadSchema.safeParse({ ...validPayload, category: "Product Fit Question" }).success
    ).toBe(false);
    expect(
      ContactPayloadSchema.safeParse({
        ...validPayload,
        category: "Product Fit Question",
        product: "ETB Acrylic Case"
      }).success
    ).toBe(true);
  });

  it("maps URL topics without accepting arbitrary category strings", () => {
    expect(getContactCategoryFromTopic("product-fit")).toBe("Product Fit Question");
    expect(getContactCategoryFromTopic("unknown")).toBe("General Question");
  });
});
