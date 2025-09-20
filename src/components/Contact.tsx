import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MessageCircle, Mail, MapPin, Clock, Shield, Award } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Get In <span className="text-brand-white">Touch</span>
          </h2>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto">
            Ready to experience luxury? Contact us for immediate assistance or 
            request a custom quote for your specific needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
         
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-serif font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-white/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-brand-white" />
                  </div>
                  <div>
                    <p className="font-medium">Call Us Now</p>
                    <p className="text-brand-gray">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-white/10 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-brand-white" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-brand-gray">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-white/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-brand-white" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-brand-gray">reservations@luxeride.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-white/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-brand-white" />
                  </div>
                  <div>
                    <p className="font-medium">Service Areas</p>
                    <p className="text-brand-gray">New York, LA, Miami, Chicago</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Operating Hours</h4>
              <div className="space-y-2 text-brand-gray">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>6:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span>7:00 AM - 10:00 PM</span>
                </div>
                <div className="flex items-center gap-2 text-brand-white text-sm mt-2">
                  <Clock className="w-4 h-4" />
                  <span>24/7 Emergency Support Available</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1 bg-gradient-luxury text-brand-dark font-semibold hover:shadow-glow">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button variant="outline" size="lg" className="flex-1 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-brand-charcoal bg-gradient-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-semibold mb-6">Request Custom Quote</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <Input 
                      placeholder="Your name" 
                      className="bg-background border-brand-charcoal focus:border-brand-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone Number</label>
                    <Input 
                      placeholder="Your phone" 
                      className="bg-background border-brand-charcoal focus:border-brand-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    className="bg-background border-brand-charcoal focus:border-brand-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Service Type</label>
                    <Select>
                      <SelectTrigger className="bg-background border-brand-charcoal focus:border-brand-white">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self-drive">Self-Drive Rental</SelectItem>
                        <SelectItem value="chauffeur">Chauffeur Service</SelectItem>
                        <SelectItem value="event">Event Transportation</SelectItem>
                        <SelectItem value="airport">Airport Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Vehicle</label>
                    <Select>
                      <SelectTrigger className="bg-background border-brand-charcoal focus:border-brand-white">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="executive">Executive Sedan</SelectItem>
                        <SelectItem value="luxury-suv">Luxury SUV</SelectItem>
                        <SelectItem value="sports">Sports Car</SelectItem>
                        <SelectItem value="ultra-luxury">Ultra Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Additional Details</label>
                  <Textarea 
                    placeholder="Tell us about your specific requirements, dates, locations, special requests..."
                    className="bg-background border-brand-charcoal focus:border-brand-white min-h-[120px]"
                  />
                </div>

                <Button size="lg" className="w-full bg-gradient-luxury text-brand-dark font-semibold hover:shadow-glow">
                  Send Request
                </Button>

                <p className="text-xs text-brand-gray text-center">
                  We'll respond within 15 minutes during business hours
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-brand-white" />
            </div>
            <h4 className="font-semibold mb-2">Fully Licensed & Insured</h4>
            <p className="text-brand-gray text-sm">All vehicles and chauffeurs are fully licensed and comprehensively insured for your peace of mind.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-brand-white" />
            </div>
            <h4 className="font-semibold mb-2">Award-Winning Service</h4>
            <p className="text-brand-gray text-sm">Recognized for excellence in luxury transportation with multiple industry awards and certifications.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-brand-white" />
            </div>
            <h4 className="font-semibold mb-2">24/7 Availability</h4>
            <p className="text-brand-gray text-sm">Round-the-clock support and emergency assistance whenever and wherever you need us.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;