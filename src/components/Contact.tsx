import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Shield,
  Award,
  CreditCard,
  MoveRight,
  Car,
} from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Get In <span className="text-brand-white">Touch</span>
          </h2>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto">
            Buying a car should be simple. Ask for pricing & availability, book a{" "}
            <span className="text-brand-white font-medium">test drive</span>,
            get a <span className="text-brand-white font-medium">trade-in appraisal</span>,
            or start a <span className="text-brand-white font-medium">financing pre-approval</span>.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Info column */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-serif font-semibold mb-6">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-white/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-brand-white" />
                  </div>
                  <div>
                    <p className="font-medium">Sales Hotline</p>
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
                    <p className="text-brand-gray">sales@autosaIon.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-white/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-brand-white" />
                  </div>
                  <div>
                    <p className="font-medium">Showroom</p>
                    <p className="text-brand-gray">Main St 123, New York, NY</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Showroom Hours</h4>
              <div className="space-y-2 text-brand-gray">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
                <div className="flex items-center gap-2 text-brand-white text-sm mt-2">
                  <Clock className="w-4 h-4" />
                  <span>Test drives by appointment available</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1 bg-gradient-luxury text-brand-dark font-semibold hover:shadow-glow">
                <Phone className="w-4 h-4 mr-2" />
                Call Sales
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Dealership Contact Form */}
          <Card className="border-brand-charcoal bg-gradient-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-semibold mb-6">Request Vehicle Info / Test Drive</h3>

              {/* Koment (shqip pak jo perfekt): ketu fokus eshte blerje, jo sherbime/transport */}
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <Input placeholder="Your name" className="bg-background border-brand-charcoal focus:border-brand-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone Number</label>
                    <Input placeholder="Your phone" className="bg-background border-brand-charcoal focus:border-brand-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-background border-brand-charcoal focus:border-brand-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Contact</label>
                    <Select>
                      <SelectTrigger className="bg-background border-brand-charcoal focus:border-brand-white">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Vehicle & intent */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Vehicle of Interest</label>
                    <Select>
                      <SelectTrigger className="bg-background border-brand-charcoal focus:border-brand-white">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Koment: mund t'i mbushesh dinamik nga /vehicles/fleet */}
                        <SelectItem value="bmw-3">BMW 3 Series</SelectItem>
                        <SelectItem value="audi-a4">Audi A4</SelectItem>
                        <SelectItem value="tesla-m3">Tesla Model 3</SelectItem>
                        <SelectItem value="kia-sportage">Kia Sportage</SelectItem>
                        <SelectItem value="kia-sorento">Kia Sorento</SelectItem>
                        <SelectItem value="vw-golf">Volkswagen Golf</SelectItem>
                        <SelectItem value="ferrari-296">Ferrari 296 GTB</SelectItem>
                        <SelectItem value="lamborghini-huracan">Lamborghini Huracán</SelectItem>
                        <SelectItem value="lamborghini-urus">Lamborghini Urus</SelectItem>
                        <SelectItem value="bmw-5">BMW 5 Series</SelectItem>
                        <SelectItem value="bmw-x5">BMW X5</SelectItem>
                        <SelectItem value="audi-q7">Audi Q7</SelectItem>
                        <SelectItem value="audi-etron">Audi e-tron</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">I’m Interested In</label>
                    <Select>
                      <SelectTrigger className="bg-background border-brand-charcoal focus:border-brand-white">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="best-price">Price & availability</SelectItem>
                        <SelectItem value="test-drive">Book a test drive</SelectItem>
                        <SelectItem value="trade-in">Trade-in appraisal</SelectItem>
                        <SelectItem value="finance">Financing pre-approval</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Test drive / budget / trade-in quick fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Date</label>
                    <Input type="date" className="bg-background border-brand-charcoal focus:border-brand-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Time</label>
                    <Input type="time" className="bg-background border-brand-charcoal focus:border-brand-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Budget (EUR)</label>
                    <Input placeholder="e.g. 35,000" className="bg-background border-brand-charcoal focus:border-brand-white" />
                  </div>
                </div>

                {/* Optional trade-in details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Trade-in Year</label>
                    <Input placeholder="YYYY" className="bg-background border-brand-charcoal focus:border-brand-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Make / Model</label>
                    <Input placeholder="e.g. BMW 320i" className="bg-background border-brand-charcoal focus:border-brand-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mileage (km)</label>
                    <Input placeholder="e.g. 45,000" className="bg-background border-brand-charcoal focus:border-brand-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-brand-white" />
                    <span className="text-sm text-brand-gray">
                      Check financing options & APR
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MoveRight className="w-4 h-4 text-brand-white" />
                    <span className="text-sm text-brand-gray">
                      Test drive slots fill fast — pick a time above
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Notes</label>
                  <Textarea
                    placeholder="Anything else we should know? (features you want, color, delivery timing…)"
                    className="bg-background border-brand-charcoal focus:border-brand-white min-h-[120px]"
                  />
                </div>

                {/* Koment: GDPR/consent i thjesht, mos e komplikojme */}
                <p className="text-xs text-brand-gray">
                  By submitting, you agree to be contacted about this inquiry. We don’t sell your data.
                </p>

                <Button size="lg" className="w-full bg-gradient-luxury text-brand-dark font-semibold hover:shadow-glow">
                  Send Request
                </Button>

                <p className="text-xs text-brand-gray text-center">
                  We usually reply within 15–30 minutes during business hours.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators (dealership-style) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-brand-white" />
            </div>
            <h4 className="font-semibold mb-2">Warranty & Inspection</h4>
            <p className="text-brand-gray text-sm">
              Every car is multi-point inspected. Extended warranty & service plans available.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-brand-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-brand-white" />
            </div>
            <h4 className="font-semibold mb-2">Certified Vehicles</h4>
            <p className="text-brand-gray text-sm">
              Clean title & verified history. Buy with confidence from a trusted dealer.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-brand-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-brand-white" />
            </div>
            <h4 className="font-semibold mb-2">Easy Financing</h4>
            <p className="text-brand-gray text-sm">
              Multiple lenders, fast approvals, competitive APR. Trade-in welcome.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
