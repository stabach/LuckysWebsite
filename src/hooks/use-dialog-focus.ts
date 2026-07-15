"use client";

import type { RefObject } from "react";
import { useEffect } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");

export function useDialogFocus(
  open: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  returnFocusRef?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const returnFocusElement = returnFocusRef?.current ?? previousActiveElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(containerRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []).filter(
        (element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true"
      );

    requestAnimationFrame(() => {
      const preferred = containerRef.current?.querySelector<HTMLElement>("[data-dialog-initial-focus]");
      (preferred ?? focusables()[0])?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const elements = focusables();
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusElement?.focus();
    };
  }, [containerRef, onClose, open, returnFocusRef]);
}
