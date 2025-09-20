import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-serif font-bold bg-gradient-luxury bg-clip-text text-transparent">
            LuxeRide
          </h1>
          <div className="hidden md:flex space-x-6">
            <a href="/fleet" className="text-foreground hover:text-brand-white transition-colors">Fleet</a>
            <a href="/chauffeur" className="text-foreground hover:text-brand-white transition-colors">Chauffeur</a>
            <a href="/pricing" className="text-foreground hover:text-brand-white transition-colors">Pricing</a>
            <a href="#contact" className="text-foreground hover:text-brand-white transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-foreground hover:text-brand-white">
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-brand-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
          <Button className="bg-gradient-luxury text-brand-dark font-medium hover:shadow-glow transition-all">
            Check Availability
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
