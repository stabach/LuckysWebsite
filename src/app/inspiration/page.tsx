import type { Metadata } from "next";
import { InspirationSection } from "@/components/inspiration-section";

export const metadata: Metadata = {
  title: "Display Your Collection",
  description: "Premium collector shelf, display room, and graded card inspiration from Lucky's Loot."
};

export default function InspirationPage() {
  return (
    <div className="pt-16">
      <InspirationSection full />
    </div>
  );
}
