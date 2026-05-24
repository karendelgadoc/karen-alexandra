"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/insforge";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const insforge = getBrowserClient();
    await insforge.auth.signOut();
    document.cookie = "admin_session=; max-age=0; path=/";
    router.push("/admin/login");
  }

  const linkClass = (path: string) =>
    `block px-3 py-2 rounded text-sm transition-colors ${
      pathname.startsWith(path)
        ? "bg-stone-900 text-white"
        : "text-stone-600 hover:bg-stone-100"
    }`;

  return (
    <nav className="w-52 shrink-0 border-r border-stone-200 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Admin</p>
        <p className="font-medium text-stone-800">Karen Alexandra</p>
      </div>

      <div className="space-y-1 flex-1">
        <Link href="/admin/pages" className={linkClass("/admin/pages")}>
          Pages
        </Link>
        <Link href="/admin/menus" className={linkClass("/admin/menus")}>
          Navigation
        </Link>
        <Link href="/admin/blog" className={linkClass("/admin/blog")}>
          Blog Posts
        </Link>
        <Link href="/admin/fashion-news" className={linkClass("/admin/fashion-news")}>
          Fashion News
        </Link>
        <Link href="/admin/posts" className={linkClass("/admin/posts")}>
          Case Studies
        </Link>
        <Link href="/admin/photos" className={linkClass("/admin/photos")}>
          Photo Library
        </Link>
        <Link href="/" className="block px-3 py-2 rounded text-sm text-stone-500 hover:bg-stone-100 transition-colors" target="_blank">
          Ver sitio →
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="mt-auto px-3 py-2 text-sm text-stone-500 hover:text-red-600 text-left transition-colors"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}
