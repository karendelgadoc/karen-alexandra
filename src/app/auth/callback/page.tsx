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

      const oauthError = params.get("error") ?? params.get("error_description");
      if (oauthError) {
        setError(`Google sign-in was cancelled or failed: ${oauthError}`);
        return;
      }

      if (!code) {
        setError("No authorization code received from Google. Try signing in again.");
        return;
      }

      if (!codeVerifier) {
        setError("Login session expired (no PKCE verifier cookie). Please try signing in again.");
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
        setError(
          exchangeError?.message
            ? `OAuth code exchange failed: ${exchangeError.message}`
            : "OAuth code exchange returned no access token. The code may have expired — try again."
        );
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
        let serverMsg = `HTTP ${res.status}`;
        try {
          const body = await res.json();
          if (body?.error) serverMsg = String(body.error);
        } catch {
          // ignore — keep status-code message
        }
        if (res.status === 403) {
          setError(`Not authorized: ${serverMsg}. Your Google account email isn't on the admin allowlist.`);
        } else if (res.status === 401) {
          setError(`Token rejected by server: ${serverMsg}. The access token may have expired.`);
        } else {
          setError(`Failed to establish session (${res.status}): ${serverMsg}`);
        }
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
