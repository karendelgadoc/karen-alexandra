import type { Metadata } from "next";
import { getContactContent, CONTACT_DEFAULTS } from "@/lib/page-content-db";
import { buildContactSectionMap } from "@/components/sections/contact";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Karen Alexandra",
  description: "Begin a correspondence — brand partnerships, press, e-commerce consulting, and speaking inquiries.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const [{ sent }, content] = await Promise.all([
    searchParams,
    getContactContent().catch(() => null),
  ]);
  const c = content ?? CONTACT_DEFAULTS;
  const sectionMap = buildContactSectionMap(c);
  const order = c.sectionOrder ?? CONTACT_DEFAULTS.sectionOrder;
  const hidden = new Set(c.hiddenSections ?? []);

  return (
    <>
      {sent === "1" && (
        <div style={{ background: "var(--ka-accent-deep)", color: "var(--ka-bg)", padding: "20px 64px", fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 18, textAlign: "center" }}>
          Your letter has been received — expect a considered reply within five business days.
        </div>
      )}
      {order.filter(id => !hidden.has(id)).map(id => (
        <div key={id} data-section-id={id}>{sectionMap[id] ?? null}</div>
      ))}
    </>
  );
}
