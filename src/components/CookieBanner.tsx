"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner only if user hasn't dismissed it yet
    if (!localStorage.getItem("cookie_notice_dismissed")) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("cookie_notice_dismissed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--charcoal)] text-white px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <p className="text-xs leading-relaxed text-stone-300 max-w-2xl">
        Este sitio usa únicamente cookies esenciales para el inicio de sesión.
        No se utilizan cookies de rastreo ni publicidad.{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 text-white hover:text-stone-300 transition-colors"
        >
          Política de privacidad
        </Link>
      </p>
      <button
        onClick={dismiss}
        className="flex-none text-xs tracking-[0.15em] uppercase border border-stone-500 hover:border-white px-4 py-2 transition-colors whitespace-nowrap"
      >
        Entendido
      </button>
    </div>
  );
}
