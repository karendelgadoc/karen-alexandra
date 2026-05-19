import { NextRequest, NextResponse } from "next/server";

/**
 * Shared admin guard for `/api/admin/*` routes.
 *
 * Checks:
 * 1. `admin_session` cookie is present (set-session verified the underlying
 *    token + admin email allowlist when it was issued).
 * 2. For state-changing methods (POST/PUT/PATCH/DELETE), the request `Origin`
 *    or `Referer` header matches the request URL's origin — a defense-in-depth
 *    CSRF check on top of SameSite=Lax.
 *
 * Returns a NextResponse to short-circuit, or `null` if the request is allowed.
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const cookie = request.cookies.get("admin_session");
  if (!cookie?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
    const reqUrl = new URL(request.url);
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");

    // Prefer Origin (modern browsers send it on state-changing requests).
    if (origin) {
      try {
        if (new URL(origin).origin !== reqUrl.origin) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else if (referer) {
      // Fall back to Referer.
      try {
        if (new URL(referer).origin !== reqUrl.origin) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      // No Origin and no Referer on a state-changing request is suspicious.
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return null;
}
