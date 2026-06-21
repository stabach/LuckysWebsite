import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Lucky's Loot for product support, order help, and collector display questions."
};

export default function ContactPage() {
  return <ContactForm />;
}
