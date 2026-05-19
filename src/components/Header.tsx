import Link from "next/link";
import Image from "next/image";
import { getMenuContent, MENU_DEFAULTS } from "@/lib/page-content-db";
import HeaderClient from "./HeaderClient";

export const revalidate = 60;

export default async function Header() {
  const menu = await getMenuContent().catch(() => MENU_DEFAULTS);

  return (
    <header>
      <HeaderClient leftLinks={menu.leftLinks} rightLinks={menu.rightLinks} />
    </header>
  );
}
