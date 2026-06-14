import type { Metadata } from "next";
import { getAboutContent } from "@/lib/page-content-db";
import AboutContent from "./AboutContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — Karen Alexandra",
  description:
    "Peruvian by birth, Spanish by choice, Californian in summer. Luxury fashion e-commerce lead and lifestyle correspondent based in Madrid.",
};

export default async function AboutPage() {
  const content = await getAboutContent();
  return <AboutContent content={content} />;
}
