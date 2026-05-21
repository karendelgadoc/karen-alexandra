"use client";

import { useEffect } from "react";

const CALENDLY_URL = "https://calendly.com/karenalexandra/30-mins";

export default function CalendlyPopup({
  label = "Book a 30-min Call",
  variant = "filled",
}: {
  label?: string;
  variant?: "filled" | "outline";
}) {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  function open() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Calendly?.initPopupWidget({ url: CALENDLY_URL });
  }

  const base =
    "text-xs tracking-[0.2em] uppercase px-10 py-3 transition-colors cursor-pointer";
  const styles =
    variant === "outline"
      ? `${base} border border-[var(--charcoal)] hover:bg-[var(--charcoal)] hover:text-[var(--cream)]`
      : `${base} bg-[var(--charcoal)] text-[var(--cream)] hover:bg-[var(--taupe)]`;

  return (
    <button onClick={open} className={styles}>
      {label}
    </button>
  );
}
