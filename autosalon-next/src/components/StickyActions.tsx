"use client";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const StickyActions = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="bg-card/95 backdrop-blur-sm border border-brand-charcoal rounded-2xl p-4 shadow-luxury">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="bg-gradient-luxury text-brand-dark font-semibold hover:shadow-glow"
            size="sm"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </Button>
          <Button 
            variant="outline"
            className="border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark"
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyActions;
