import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Car, Shield, Clock, Award } from "lucide-react";
import heroImage from "@/assets/hero-luxury-car.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl">
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mb-8">
            {["Mercedes", "BMW", "Audi", "Porsche", "Rolls Royce"].map((brand) => (
              <div key={brand} className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                <span className="text-sm text-luxury-gray">{brand}</span>
              </div>
            ))}
          </div>

          {/* Headlines - Mobile Optimized */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif font-bold mb-4 md:mb-6 leading-tight">
            Luxury Car <br />
            <span className="bg-gradient-luxury bg-clip-text text-transparent">Rental</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-brand-gray mb-6 md:mb-8 max-w-2xl">
            Chauffeured & self-drive luxury cars in major cities, delivered to your door. Experience premium mobility redefined.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-4 sm:gap-6 mb-8 md:mb-12">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand-white" />
              <span className="text-xs sm:text-sm">Fully Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brand-white" />
              <span className="text-xs sm:text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-brand-white" />
              <span className="text-xs sm:text-sm">Premium Fleet</span>
            </div>
          </div>

          {/* Booking Widget - Mobile Optimized */}
          <div className="bg-card/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl border border-brand-charcoal shadow-card max-w-4xl">
            <h3 className="text-lg sm:text-xl font-serif font-semibold mb-4 sm:mb-6">Check Availability & Get Instant Quote</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-brand-gray" />
                  <Input 
                    placeholder="City or Address" 
                    className="pl-10 bg-background border-brand-charcoal focus:border-brand-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-brand-gray" />
                  <Input 
                    type="date" 
                    className="pl-10 bg-background border-brand-charcoal focus:border-brand-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Return Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-brand-gray" />
                  <Input 
                    type="date" 
                    className="pl-10 bg-background border-brand-charcoal focus:border-brand-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Class</label>
                <Select>
                  <SelectTrigger className="bg-background border-brand-charcoal focus:border-brand-white">
                    <Car className="w-4 h-4 mr-2 text-brand-gray" />
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">Luxury Sedan</SelectItem>
                    <SelectItem value="premium">Premium SUV</SelectItem>
                    <SelectItem value="exotic">Exotic Sports</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button size="lg" className="flex-1 bg-gradient-luxury text-brand-dark font-semibold hover:shadow-glow transition-all">
                Search Available Cars
              </Button>
              <Button variant="outline" size="lg" className="border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark">
                Get Custom Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;