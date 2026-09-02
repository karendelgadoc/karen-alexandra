/**
 * Flags for pages that stay in the codebase but are hidden from the public site.
 *
 * `/services` is currently hidden: the route 404s, it is filtered out of the
 * header, mobile menu and footer (including menus stored in the database), and
 * the in-page "work with me" CTAs point at /contact instead. The page content
 * is untouched and still editable at /admin/pages/services.
 *
 * To bring the page back, flip SERVICES_ENABLED to true — nothing else needs
 * to change.
 */
export const SERVICES_ENABLED = false;

/** Public routes hidden right now; used to filter database-driven menus. */
export const HIDDEN_ROUTES: readonly string[] = SERVICES_ENABLED ? [] : ["/services"];

/** True when `href` points at a page that is currently hidden. */
export function isHiddenRoute(href: string): boolean {
  return HIDDEN_ROUTES.some(
    (route) => href === route || href.startsWith(`${route}/`) || href.startsWith(`${route}?`),
  );
}

/** Drops links to hidden pages from a nav/footer link list. */
export function filterHiddenLinks<T extends { href: string }>(links: T[]): T[] {
  return links.filter((link) => !isHiddenRoute(link.href));
}

/** Where the editorial "work with me" CTAs send readers. */
export const STUDIO_CTA = SERVICES_ENABLED
  ? { href: "/services", label: "The studio" }
  : { href: "/contact", label: "Get in touch" };
