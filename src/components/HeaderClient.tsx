"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavLink {
  label: string;
  href: string;
}

export default function HeaderClient({
  leftLinks,
  rightLinks,
}: {
  leftLinks: NavLink[];
  rightLinks: NavLink[];
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
  }

  return (
    <nav className="ka-nav">
      <div className="ka-nav-left">
        {leftLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`ka-nav-link${isActive(href) ? " active" : ""}`}
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
            className={`ka-nav-link${isActive(href) ? " active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
