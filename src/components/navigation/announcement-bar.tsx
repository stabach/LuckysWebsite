"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

const ANNOUNCEMENT_DISMISSED_KEY = "luckys-announcement-v3-dismissed";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY) !== "true");
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(ANNOUNCEMENT_DISMISSED_KEY, "true");
    } catch {
      // Dismiss for the current render when local storage is unavailable.
    }
  }

  if (!visible) return null;

  return (
    <aside className="announcement-bar" aria-label="Store announcement">
      <div className="section-shell announcement-inner">
        <p><strong>Next Local Event:</strong> Degen Society (Aug 1) <span aria-hidden="true">|</span> Gem Mint Trade Show (Aug 8-9)</p>
        <button type="button" onClick={dismiss} aria-label="Dismiss announcement">
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
