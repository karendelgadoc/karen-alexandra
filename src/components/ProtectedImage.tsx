"use client";

import { useEffect } from "react";

/**
 * Mount once in the public layout.
 * Prevents right-click save and drag-to-desktop on every image on the page.
 * Does not affect admin pages.
 */
export function ImageProtection() {
  useEffect(() => {
    const block = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === "IMG") e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);

  return null;
}
