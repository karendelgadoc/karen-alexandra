import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import { JsonLd, personSchema, organizationSchema, websiteSchema } from "@/components/JsonLd";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://karenalexandra.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Karen Alexandra — Brand strategist for luxury fashion, travel & tech",
    template: "%s — Karen Alexandra",
  },
  description:
    "A correspondence on the quiet luxuries. Brand Marketing Director with 10+ years building luxury fashion, travel and tech brands. Editorial, e-commerce and digital growth.",
  keywords: [
    "Karen Alexandra",
    "brand marketing director",
    "luxury fashion strategist",
    "travel content creator",
    "e-commerce consultant",
    "fashion editor",
    "Shopify strategy",
    "digital merchandising",
  ],
  authors: [{ name: "Karen Alexandra", url: SITE_URL }],
  creator: "Karen Alexandra",
  publisher: "Karen Alexandra",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Karen Alexandra",
    title: "Karen Alexandra — Brand strategist for luxury fashion, travel & tech",
    description:
      "A correspondence on the quiet luxuries. Brand Marketing Director with 10+ years building luxury fashion, travel and tech brands.",
    images: [{ url: "/photos/portrait-lavender.jpg", width: 1200, height: 1500, alt: "Karen Alexandra" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karen Alexandra — Brand strategist for luxury fashion, travel & tech",
    description: "A correspondence on the quiet luxuries.",
    images: ["/photos/portrait-lavender.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "lifestyle",
  formatDetection: { email: false, address: false, telephone: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Karen Alexandra",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={personSchema()} />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
