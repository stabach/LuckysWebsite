import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { activeProducts } from "@/lib/catalog";
import { getContactCategoryFromTopic } from "@/lib/contact-schema";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Lucky's Loot for product support, order help, and collector display questions.",
  alternates: { canonical: "/contact" }
};

type ContactPageProps = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { topic } = await searchParams;
  return (
    <ContactForm
      initialCategory={getContactCategoryFromTopic(topic)}
      products={activeProducts.map((product) => ({ id: product.id, name: product.name }))}
    />
  );
}
