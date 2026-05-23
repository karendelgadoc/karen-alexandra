import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About — Karen Alexandra",
  description:
    "Peruvian by birth, Spanish by choice, Californian in summer. Luxury fashion e-commerce lead and lifestyle correspondent based in Madrid.",
};

export default function AboutPage() {
  return <AboutContent />;
}
