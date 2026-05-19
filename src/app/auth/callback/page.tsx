"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/insforge";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function handleCallback() {
      // Read the code NOW — before getBrowserClient() whose constructor
      // auto-runs detectAuthCallback() which cleans the URL param.
      const params = new URLSearchParams(window.location.search);
      const code = params.get("insforge_code") ?? params.get("code");
      const codeVerifier = getCookie("pkce_verifier") ?? undefined;

      if (!code) {
        setError("No authorization code received.");
        return;
      }

      // Init client (triggers detectAuthCallback which will fail silently
      // because sessionStorage is empty — no HTTP call is made).
      const insforge = getBrowserClient();

      // Yield to the event loop so the SDK's detectAuthCallback settles first.
      await new Promise((r) => setTimeout(r, 0));

      // Exchange using our cookie-stored verifier.
      const { data, error: exchangeError } = await insforge.auth.exchangeOAuthCode(
        code,
        codeVerifier,
      );

      if (exchangeError || !data?.accessToken) {
        setError(exchangeError?.message ?? "Authentication failed.");
        return;
      }

      // Clear the verifier cookie.
      document.cookie = "pkce_verifier=; path=/; max-age=0";

      // Store session via server route so it gets HttpOnly + Secure flags (XSS protection).
      const res = await fetch("/api/auth/set-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.accessToken }),
      });
      if (!res.ok) {
        setError("Failed to establish session.");
        return;
      }

      router.replace("/admin/posts");
    }

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-center px-6">
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <a href="/login" className="text-xs tracking-[0.15em] uppercase text-[var(--taupe)] hover:text-[var(--charcoal)]">
            Volver al login →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
      <p className="text-sm text-[var(--muted)] tracking-wide">Iniciando sesión…</p>
    </div>
  );
}
