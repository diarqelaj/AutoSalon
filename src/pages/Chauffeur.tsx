import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Award, Star, MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-luxury-car.jpg";

const Chauffeur = () => {
  const services = [
    {
      title: "Airport Transfers",
      description: "Professional airport pickup and drop-off services with flight monitoring",
      icon: MapPin,
      price: "From $99"
    },
    {
      title: "Corporate Events", 
      description: "Executive transportation for business meetings and corporate functions",
      icon: Award,
      price: "From $149/hour"
    },
    {
      title: "Special Occasions",
      description: "Luxury transportation for weddings, galas, and special celebrations",
      icon: Star,
      price: "From $199/hour"
    },
    {
      title: "City Tours",
      description: "Guided luxury tours with knowledgeable local chauffeurs",
      icon: Users,
      price: "From $129/hour"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 py-20">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 leading-tight">
                Professional <br />
                <span className="bg-gradient-luxury bg-clip-text text-transparent">Chauffeur</span> Service
              </h1>
              
              <p className="text-lg md:text-xl text-brand-gray mb-8 max-w-2xl">
                Experience luxury transportation with our professional chauffeurs. Available 24/7 for all your premium mobility needs.
              </p>

              <div className="flex flex-wrap gap-6 mb-12">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-white" />
                  <span className="text-sm">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-white" />
                  <span className="text-sm">24/7 Availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-white" />
                  <span className="text-sm">Professional Drivers</span>
                </div>
              </div>

              {/* Booking Form */}
              <div className="bg-card/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-brand-charcoal shadow-card max-w-2xl">
                <h3 className="text-xl font-serif font-semibold mb-6">Request Chauffeur Service</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Service Type</label>
                    <Select>
                      <SelectTrigger className="bg-background border-brand-charcoal">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="airport">Airport Transfer</SelectItem>
                        <SelectItem value="corporate">Corporate Events</SelectItem>
                        <SelectItem value="special">Special Occasions</SelectItem>
                        <SelectItem value="hourly">Hourly Service</SelectItem>
                        <SelectItem value="tour">City Tour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date & Time</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-brand-gray" />
                      <Input 
                        type="datetime-local" 
                        className="pl-10 bg-background border-brand-charcoal"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-brand-gray" />
                      <Input 
                        placeholder="Enter pickup address" 
                        className="pl-10 bg-background border-brand-charcoal"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Drop-off Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-brand-gray" />
                      <Input 
                        placeholder="Enter destination" 
                        className="pl-10 bg-background border-brand-charcoal"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium">Special Requirements</label>
                  <Textarea 
                    placeholder="Any special requests or requirements..."
                    className="bg-background border-brand-charcoal"
                  />
                </div>

                <Button size="lg" className="w-full bg-gradient-luxury text-brand-dark font-semibold hover:shadow-glow">
                  Request Quote
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-brand-charcoal/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold mb-4">Our Services</h2>
              <p className="text-brand-gray max-w-2xl mx-auto">
                Choose from our range of professional chauffeur services, each tailored to meet your specific needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.title} className="bg-card border-brand-charcoal hover:shadow-luxury transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-luxury rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-brand-dark" />
                      </div>
                      <h3 className="text-lg font-serif font-semibold mb-2">{service.title}</h3>
                      <p className="text-brand-gray text-sm mb-4">{service.description}</p>
                      <div className="text-brand-white font-semibold">{service.price}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Chauffeur;