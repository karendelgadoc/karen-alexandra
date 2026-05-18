"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const leftLinks = [
    { href: "/journal", label: "Journal" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/case-studies", label: "Case Studies" },
  ];

  const rightLinks = [
    { href: "/watch", label: "Watch" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header>
      <nav className="ka-nav">
        <div className="ka-nav-left">
          {leftLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`ka-nav-link${pathname === href || pathname.startsWith(href + "/") ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <Link href="/" className="ka-logo">
          <Image
            src="/logo-wordmark.png"
            alt="Karen Alexandra"
            width={180}
            height={36}
            style={{ height: "auto" }}
            priority
          />
        </Link>

        <div className="ka-nav-right">
          {rightLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`ka-nav-link${pathname === href ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
