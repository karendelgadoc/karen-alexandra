"use client";

import { getBrowserClient } from "@/lib/insforge";

export default function LoginPage() {
  async function handleGoogleSignIn() {
    const insforge = getBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { data, error } = await insforge.auth.signInWithOAuth({
      provider: "google",
      redirectTo,
      skipBrowserRedirect: true,
    });

    if (error || !data?.url) return;

    // Store the verifier in a cookie so it survives the multi-hop redirect
    document.cookie = `pkce_verifier=${data.codeVerifier}; path=/; SameSite=Lax; max-age=300`;

    window.location.href = data.url;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
      <div className="w-full max-w-sm px-8 py-10 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-2">
          Karen Alexandra
        </p>
        <h1 className="text-2xl font-light text-[var(--charcoal)] mb-10">
          Admin
        </h1>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 border border-stone-300 rounded px-4 py-3 text-sm text-[var(--charcoal)] bg-white hover:bg-stone-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>
      </div>
    </div>
  );
}
