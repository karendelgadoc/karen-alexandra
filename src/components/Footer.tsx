import Link from "next/link";
import Image from "next/image";
import { getFooterContent } from "@/lib/page-content-db";

export default async function Footer() {
  const fc = await getFooterContent();
  const year = new Date().getFullYear();

  return (
    <footer className="ka-footer ka-rp">
      <div className="ka-footer-grid">
        {/* Brand */}
        <div>
          <div className="ka-footer-mark">
            <Image
              src="/logo-monogram.png"
              alt="KA"
              width={56}
              height={56}
              style={{ height: "auto" }}
            />
          </div>
          <p className="ka-footer-tag">{fc.tagline}</p>
        </div>

        {/* Dynamic columns */}
        {fc.columns.map((col) => (
          <div key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link.href + link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="ka-footer-meta">
        <span>© {year} Karen Alexandra. All rights reserved.</span>
        <div style={{ display: "flex", gap: "32px" }}>
          {fc.bottomLinks.map((link) => (
            <Link key={link.href + link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
