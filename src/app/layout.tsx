
import "./globals.css";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/auth/AuthModal";
import { AuthModalProvider } from "@/providers/auth-modal";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "AutoSalon RIO -Luxury & Performance Cars",
  description:
    "Curated luxury and performance cars. Transparent pricing, fast test drives, flexible financing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
     
      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        <AuthModalProvider>
          <AuthModal />
          <Navigation />
          <main className="flex-1 pt-[72px] scroll-mt-[72px]">
            {children}
          </main>
          <Footer />
        </AuthModalProvider>
      </body>
    </html>
  );
}
