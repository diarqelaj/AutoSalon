import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Users, Clock, Shield } from "lucide-react";

const ServiceSelector = () => {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-brand-charcoal/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Choose Your <span className="text-brand-white">Experience</span>
          </h2>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto">
            Whether you prefer to drive yourself or be chauffeured in style, 
            we offer premium experiences tailored to your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Self-Drive Option */}
          <Card className="group hover:shadow-luxury transition-all duration-500 border-brand-charcoal hover:border-brand-white/50 bg-gradient-card">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-brand-white/10 rounded-lg">
                  <Car className="w-8 h-8 text-brand-white" />
                </div>
                <span className="text-sm bg-brand-white/20 text-brand-white px-3 py-1 rounded-full">
                  From €199/day
                </span>
              </div>

              <h3 className="text-2xl font-serif font-semibold mb-4">Self-Drive Luxury</h3>
              <p className="text-brand-gray mb-6">
                Take the wheel of premium vehicles from our curated fleet. 
                Perfect for those who love the driving experience.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-brand-white" />
                  <span className="text-sm">Comprehensive insurance included</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-brand-white" />
                  <span className="text-sm">24/7 roadside assistance</span>
                </div>
                <div className="flex items-center gap-3">
                  <Car className="w-4 h-4 text-brand-white" />
                  <span className="text-sm">Door-to-door delivery</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-luxury text-brand-dark font-semibold hover:shadow-glow group-hover:scale-105 transition-all"
                size="lg"
              >
                Browse Fleet
              </Button>
            </CardContent>
          </Card>

          {/* Chauffeur Option */}
          <Card className="group hover:shadow-luxury transition-all duration-500 border-brand-charcoal hover:border-brand-white/50 bg-gradient-card">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-brand-white/10 rounded-lg">
                  <Users className="w-8 h-8 text-brand-white" />
                </div>
                <span className="text-sm bg-brand-white/20 text-brand-white px-3 py-1 rounded-full">
                  From €299/day
                </span>
              </div>

              <h3 className="text-2xl font-serif font-semibold mb-4">Chauffeur Service</h3>
              <p className="text-brand-gray mb-6">
                Relax in luxury while our professional chauffeurs handle the driving. 
                Ideal for business, events, and special occasions.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-brand-white" />
                  <span className="text-sm">Professional chauffeurs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-brand-white" />
                  <span className="text-sm">Flexible hourly or daily rates</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-brand-white" />
                  <span className="text-sm">Airport & event transfers</span>
                </div>
              </div>

              <Button 
                variant="outline"
                className="w-full border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark group-hover:scale-105 transition-all"
                size="lg"
              >
                Request Quote
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mt-20">
          <h3 className="text-3xl font-serif font-bold text-center mb-12">
            How It <span className="text-brand-white">Works</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Select Dates", desc: "Choose your pickup and return dates" },
              { step: "02", title: "Pick Vehicle", desc: "Browse our premium fleet and select your car" },
              { step: "03", title: "Confirm Booking", desc: "Secure your reservation with instant confirmation" },
              { step: "04", title: "Enjoy the Ride", desc: "We deliver your luxury vehicle to your location" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center text-brand-dark font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-brand-gray text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSelector;