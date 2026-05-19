import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ImageProtection } from "@/components/ProtectedImage";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ImageProtection />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
