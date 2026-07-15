import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/info/content-page";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility features and support for the Lucky's Loot storefront."
};

export default function AccessibilityPage() {
  return (
    <ContentPage
      eyebrow="Accessibility"
      title="A collector storefront that works beyond the mouse."
      intro="V2 is built with semantic landmarks, visible focus, keyboard-operable dialogs and media, reduced-motion behavior, and responsive text and controls."
    >
      <ContentSection title="Implemented support">
        <ul>
          <li>Skip navigation and semantic page landmarks</li>
          <li>Keyboard focus trapping and restoration for open dialogs and drawers</li>
          <li>Reduced-motion handling for the neon opener and other transitions</li>
          <li>Keyboard controls and a static fallback for interactive product media</li>
          <li>Persistent labels, status messages, and non-color-only selection states</li>
        </ul>
      </ContentSection>
      <ContentSection title="Need help or found a barrier?">
        <p>
          Send the page, device, browser, assistive technology, and the task you were trying to
          complete. Do not include passwords or payment information.
        </p>
        <Link className="button button-primary" href="/contact?topic=general">
          Report an accessibility issue
        </Link>
      </ContentSection>
    </ContentPage>
  );
}
