import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Karen Alexandra",
  description: "Brand Marketing Director for Tech and Travel Companies",
  openGraph: {
    title: "Karen Alexandra",
    description: "Brand Marketing Director for Tech and Travel Companies",
    url: "https://karenalexandra.com",
    siteName: "Karen Alexandra",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col font-[family-name:var(--font-archivo)] bg-[var(--cream)] text-[var(--charcoal)]"
      >
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
