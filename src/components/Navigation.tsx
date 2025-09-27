"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, User, Menu, X } from "lucide-react";
import Link from "next/link";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo + Links */}
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="text-2xl font-serif font-bold bg-gradient-luxury bg-clip-text text-transparent"
          >
            LuxeRide
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link
              href="/fleet"
              className="text-foreground hover:text-brand-white transition-colors"
            >
              Fleet
            </Link>
            <Link
              href="/pricing"
              className="text-foreground hover:text-brand-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-foreground hover:text-brand-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground hover:text-brand-white"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground hover:text-brand-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark"
          >
            <User className="w-4 h-4" />
            Login
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-foreground hover:text-brand-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 py-6 space-y-4">
          <Link href="/fleet" className="block text-foreground hover:text-brand-white">
            Fleet
          </Link>
          <Link href="/pricing" className="block text-foreground hover:text-brand-white">
            Pricing
          </Link>
          <Link href="#contact" className="block text-foreground hover:text-brand-white">
            Contact
          </Link>
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <Button variant="ghost" className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button variant="ghost" className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button variant="outline" className="flex items-center justify-center gap-2 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark">
              <User className="w-4 h-4" />
              Login
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
