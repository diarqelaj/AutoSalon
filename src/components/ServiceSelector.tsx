// src/components/ServiceSelector.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  Gauge,
  Banknote,
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle2,
  Repeat2,
  Users,
} from "lucide-react";

const ServiceSelector = () => {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-brand-charcoal/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Everything for your <span className="text-brand-white">next car</span>
          </h2>
          <p className="text-lg md:text-xl text-brand-gray max-w-3xl mx-auto">
            Browse luxury and performance models, book a test drive, get an instant trade-in estimate,
            and secure flexible finance — all in one place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Buy / Reserve */}
          <Card className="group hover:shadow-luxury transition-all duration-500 border-brand-charcoal hover:border-brand-white/50 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-brand-white/10 rounded-xl">
                  <Car className="w-7 h-7 text-brand-white" />
                </div>
                <span className="text-xs bg-brand-white/20 text-brand-white px-2.5 py-1 rounded-full">
                  New & Certified
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Shop & Reserve</h3>
              <p className="text-sm text-brand-gray">
                Explore our curated inventory and reserve your car online with a small, fully refundable hold.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-brand-gray">
                <li className="flex items-center gap-2"><Star className="w-4 h-4" /> Premium selection</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Verified history</li>
              </ul>
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/pricing">Browse inventory <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Drive */}
          <Card className="group hover:shadow-luxury transition-all duration-500 border-brand-charcoal hover:border-brand-white/50 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-brand-white/10 rounded-xl">
                  <Gauge className="w-7 h-7 text-brand-white" />
                </div>
                <span className="text-xs bg-brand-white/20 text-brand-white px-2.5 py-1 rounded-full">
                  Same-day slots
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book a Test Drive</h3>
              <p className="text-sm text-brand-gray">
                Pick a model and a time — we’ll have it ready with your preferred configuration and route.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-brand-gray">
                <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> 30–60 min sessions</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4" /> Cleaned & prepped</li>
              </ul>
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/test-drive">Schedule test drive <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          

          {/* Finance & Care */}
          <Card className="group hover:shadow-luxury transition-all duration-500 border-brand-charcoal hover:border-brand-white/50 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-brand-white/10 rounded-xl">
                  <Shield className="w-7 h-7 text-brand-white" />
                </div>
                <span className="text-xs bg-brand-white/20 text-brand-white px-2.5 py-1 rounded-full">
                  Approved partners
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Finance & Protection</h3>
              <p className="text-sm text-brand-gray">
                Flexible finance and extended warranty options, plus detailing and delivery services.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-brand-gray">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Transparent rates</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4" /> Detailing & delivery</li>
              </ul>
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/financing">Explore finance <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-charcoal">
            <Link href="/fleet">View complete inventory</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceSelector;
