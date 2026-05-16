import { createClient } from "@insforge/sdk";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL!;

// Server-only client — never import this in client components
// INSFORGE_API_KEY is the full-access admin key, used as anonKey for service-role DB operations
export function getServerClient() {
  return createClient({
    baseUrl,
    anonKey: process.env.INSFORGE_API_KEY,
  });
}

// Browser client — for auth operations in client components
export function getBrowserClient() {
  return createClient({ baseUrl });
}
