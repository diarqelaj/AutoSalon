// src/app/layout.tsx
import "./globals.css";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/auth/AuthModal";
import { AuthModalProvider } from "@/providers/auth-modal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LuxeRide - Luxury Car Rentals",
  description: "Chauffeured & self-drive luxury cars in major cities, delivered to your door.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthModalProvider>
          <AuthModal />
          <Navigation />
          <main className="pt-20">{children}</main>
        </AuthModalProvider>
      </body>
    </html>
  );
}
