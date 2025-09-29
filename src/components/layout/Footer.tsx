// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { Phone, MessageCircle, MapPin, Mail } from "lucide-react";

const TEL_E164 = "15551234567";
const WA_E164 = "15551234567";

export default function Footer() {
  const telHref = `tel:+${TEL_E164}`;
  const waHref = `https://wa.me/${WA_E164}?text=${encodeURIComponent(
    "Hi! I'm interested in a vehicle. Could you help me?"
  )}`;

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        {/* Kolona 1 – brand */}
        <div>
          {/* kom: logo ose tekst i shkurter */}
          <Link href="/" className="text-2xl font-serif font-bold bg-gradient-luxury bg-clip-text text-transparent">
            LuxeRide
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Curated luxury & performance cars. Transparent pricing, fast test drives, easy financing.
          </p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-foreground/70" />
              <span>Main St 123, New York, NY</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-foreground/70" />
              <a className="hover:underline" href="mailto:sales@autosaIon.com">sales@autosaIon.com</a>
            </div>
          </div>

          {/* CTA shpejt: call/whatsapp */}
          <div className="mt-5 flex gap-3">
            <a
              href={telHref}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>

        {/* Kolona 2 – Company */}
        <div>
          <div className="text-sm font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-foreground" href="/about">About Us</Link></li>
            <li><Link className="hover:text-foreground" href="/careers">Careers</Link></li>
            <li><Link className="hover:text-foreground" href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Kolona 3 – Buying */}
        <div>
          <div className="text-sm font-semibold mb-3">Buying</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-foreground" href="/test-drive">Book Test Drive</Link></li>
            <li><Link className="hover:text-foreground" href="/financing">Financing</Link></li>
        
        
            <li><Link className="hover:text-foreground" href="/warranty">Warranty</Link></li>
          </ul>
        </div>

        {/* Kolona 4 – Legal */}
        <div>
          <div className="text-sm font-semibold mb-3">Legal</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-foreground" href="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:text-foreground" href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} LuxeRide. All rights reserved.</span>
          <span>Designed for speed & clarity • 🚗</span>
        </div>
      </div>
    </footer>
  );
}
