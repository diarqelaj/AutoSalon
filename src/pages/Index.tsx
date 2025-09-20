import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServiceSelector from "@/components/ServiceSelector";
import Fleet from "@/components/Fleet";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import StickyActions from "@/components/StickyActions";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      <main>
        <Hero />
        <ServiceSelector />
        <Fleet />
        <Testimonials />
        <Contact />
      </main>
      <StickyActions />
      
      {/* Footer */}
      <footer className="bg-brand-dark border-t border-brand-charcoal">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-serif font-bold bg-gradient-luxury bg-clip-text text-transparent mb-4">
                LuxeRide
              </h3>
              <p className="text-brand-gray mb-4 max-w-md">
                Premium luxury car rental service offering the finest vehicles 
                with professional chauffeur services across major cities.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-brand-gray hover:text-brand-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-brand-gray hover:text-brand-white transition-colors">
                  Privacy Policy
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-brand-gray">
                <div><a href="#" className="hover:text-brand-white transition-colors">Self-Drive Rental</a></div>
                <div><a href="#" className="hover:text-brand-white transition-colors">Chauffeur Service</a></div>
                <div><a href="#" className="hover:text-brand-white transition-colors">Airport Transfers</a></div>
                <div><a href="#" className="hover:text-brand-white transition-colors">Event Transportation</a></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-brand-gray">
                <div>+1 (555) 123-4567</div>
                <div>reservations@luxeride.com</div>
                <div>24/7 Support Available</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-brand-charcoal mt-8 pt-8 text-center text-brand-gray">
            <p>&copy; 2024 LuxeRide. All rights reserved. Premium luxury transportation services.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
