// src/components/Hero.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Car, Shield, Clock, Award } from "lucide-react";
import Image from "next/image";

// --- API types (match your backend) ---
type ApiBrand = { brandID: number; name: string };

const Hero = () => {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Form state
  const [pickup, setPickup] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [vehicleClass, setVehicleClass] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const [bRes, btRes] = await Promise.all([
          api.get<ApiBrand[]>("/brands"),
          api.get<string[]>("/models/bodytypes"), // backend endpoint we added
        ]);

        if (!alive) return;
        setBrands(bRes.data ?? []);

        const list = (btRes.data ?? []).filter((s) => !!s && s.trim() !== "");
        setBodyTypes(list.length ? list : ["Luxury Sedan", "Premium SUV", "Exotic Sports", "Executive"]);

        // Optionally preselect first body type
        if (!vehicleClass && list.length) setVehicleClass(list[0]);
      } catch {
        if (!alive) return;
        setErr("Failed to load brands or body types.");
        setBodyTypes(["Luxury Sedan", "Premium SUV", "Exotic Sports", "Executive"]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pick 5 brand badges alphabetically
  const brandBadges = useMemo(
    () => [...brands].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 5).map((b) => b.name),
    [brands]
  );

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <Image
        src="/hero-luxury-car.jpg"
        alt=""
        fill
        priority
        className="object-cover -z-10 opacity-25"
      />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl">
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mb-8">
            {loading && <div className="text-sm text-muted-foreground">Loading brands…</div>}
            {err && <div className="text-sm text-destructive">{err}</div>}
            {!loading &&
              !err &&
              brandBadges.map((brand) => (
                <div
                  key={brand}
                  className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border"
                >
                  <span className="text-sm text-luxury-gray">{brand}</span>
                </div>
              ))}
          </div>

          {/* Headlines */}
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

          {/* Booking Widget */}
          <div className="bg-card/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl border border-brand-charcoal shadow-card max-w-4xl">
            <h3 className="text-lg sm:text-xl font-serif font-semibold mb-4 sm:mb-6">
              Check Availability & Get Instant Quote
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-brand-gray" />
                  <Input
                    placeholder="City or Address"
                    className="pl-10 bg-background border-brand-charcoal focus:border-brand-white"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
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
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
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
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Class</label>
                <Select value={vehicleClass} onValueChange={setVehicleClass}>
                  <SelectTrigger className="bg-background border-brand-charcoal focus:border-brand-white">
                    <Car className="w-4 h-4 mr-2 text-brand-gray" />
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map((bt) => (
                      <SelectItem key={bt} value={bt}>
                        {bt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                className="flex-1 bg-gradient-luxury text-brand-dark font-semibold hover:shadow-glow transition-all"
                onClick={() => {
                  // TODO: wire to a search route or query param, e.g.:
                  // router.push(`/fleet?from=${pickupDate}&to=${returnDate}&class=${encodeURIComponent(vehicleClass)}&loc=${encodeURIComponent(pickup)}`);
                }}
              >
                Search Available Cars
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark"
              >
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
