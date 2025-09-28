// src/components/Fleet.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Luggage, Fuel, Zap, Star } from "lucide-react";

const fallbackImage = "/luxury-fleet.jpg";

type FleetItem = {
  id: number;
  name: string;
  category: string;
  pricePerDay: number;
  transmission: string;
  fuel: string;
  available: boolean;
  imageUrl?: string | null;
  modelPageUrl?: string | null; 
};

const eur = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

// Normalize a category string to a canonical bucket
function normalizeCategory(raw?: string): string {
  if (!raw) return "Other";
  const s = raw.toLowerCase().replace(/\s+/g, " ").trim();

  // quick synonyms / contains mapping
  if (s.includes("suv")) return "SUV";
  if (s.includes("hatch")) return "Hatchback";
  if (s.includes("sedan") || s.includes("saloon")) return "Sedan";
  if (s.includes("coupe") || s.includes("coupé")) return "Coupe";
  if (s.includes("truck") || s.includes("pickup")) return "Truck";
  if (s.includes("wagon") || s.includes("estate")) return "Wagon";
  if (s.includes("convertible") || s.includes("cabrio") || s.includes("roadster")) return "Convertible";
  if (s.includes("van") || s.includes("mpv")) return "Van/MPV";

  // fallback “luxury” marketing labels → try to infer
  if (s.includes("luxury") && s.includes("suv")) return "SUV";
  if (s.includes("sport") && s.includes("coupe")) return "Coupe";

  // last resort: title case original
  return raw
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const Fleet = () => {
  const router = useRouter();

  const [items, setItems] = useState<FleetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [activeCat, setActiveCat] = useState<string>("All Vehicles");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await api.get<FleetItem[]>("/vehicles/fleet");
        if (alive) setItems(res.data ?? []);
      } catch {
        if (alive) setErr("Failed to load fleet. Please try again.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Build categories only from data (so tabs always have results)
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(normalizeCategory(i.category)));
    // order the common ones first
    const order = ["SUV", "Sedan", "Hatchback", "Coupe", "Convertible", "Wagon", "Truck", "Van/MPV", "Other"];
    const present = Array.from(set);
    const sorted = [
      ...order.filter((o) => present.includes(o)),
      ...present.filter((p) => !order.includes(p)).sort(),
    ];
    return ["All Vehicles", ...sorted];
  }, [items]);

  // Filtered list using normalized bucket
  const filtered = useMemo(() => {
    if (activeCat === "All Vehicles") return items;
    return items.filter((i) => normalizeCategory(i.category) === activeCat);
  }, [items, activeCat]);

  const handleBook = (id: number, available: boolean) => {
    if (!available) return;
    router.push(`/booking?vehicleId=${id}`);
  };
  const handleDetails = (id: number) => {
    router.push(`/vehicles/${id}`);
  };
  const handleViewAll = () => {
    router.push("/fleet");
  };

  return (
    <section id="fleet" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Premium <span className="text-luxury-gold">Fleet</span>
          </h2>
          <p className="text-xl text-luxury-gray max-w-3xl mx-auto">
            Experience the finest collection of luxury vehicles, each meticulously maintained
            and equipped with premium features for your comfort and style.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const active = category === activeCat;
            return (
              <Button
                key={category}
                variant={active ? "default" : "outline"}
                className={
                  active
                    ? "bg-gradient-luxury text-luxury-dark"
                    : "border-luxury-charcoal text-luxury-gray hover:border-luxury-gold hover:text-luxury-gold"
                }
                onClick={() => setActiveCat(category)}
                aria-pressed={active}
              >
                {category}
              </Button>
            );
          })}
        </div>

        {/* States */}
        {loading && <div className="text-center text-muted-foreground">Loading fleet…</div>}
        {err && !loading && <div className="text-center text-destructive mb-8">{err}</div>}

        {/* Vehicle Grid */}
        {!loading && !err && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-luxury transition-all duration-500 border-luxury-charcoal hover:border-luxury-gold/50 bg-gradient-card overflow-hidden"
              >
               <div className="relative h-64 bg-muted flex items-end justify-center px-3 pt-3">
  <img
    src={item.imageUrl ?? fallbackImage}
    alt={item.name}
    className="max-h-full w-auto object-contain origin-bottom transition-transform duration-500 group-hover:scale-[1.02]"
    loading="lazy"
    referrerPolicy="no-referrer"
  />


                  <div className="absolute top-4 left-4">
                    <Badge className="bg-luxury-gold text-luxury-dark">
                      {normalizeCategory(item.category)}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-luxury-gold fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  {!item.available && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Badge variant="destructive">Currently Unavailable</Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-serif font-semibold">{item.name}</h3>
                    <span className="text-luxury-gold font-semibold">
                      From {eur.format(item.pricePerDay)}/day
                    </span>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-luxury-gray" />
                      <span>5 Seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Luggage className="w-4 h-4 text-luxury-gray" />
                      <span>3 Bags</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-luxury-gray" />
                      <span>{item.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-luxury-gray" />
                      <span>{item.fuel}</span>
                    </div>
                  </div>

                  {/* Features (placeholder) */}
                  <div className="flex flex-wrap gap-1 mb-6">
                    <Badge variant="outline" className="text-xs border-luxury-charcoal">
                      Premium Interior
                    </Badge>
                    <Badge variant="outline" className="text-xs border-luxury-charcoal">
                      Premium Audio
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-gradient-luxury text-luxury-dark hover:shadow-glow transition-all"
                      disabled={!item.available}
                      onClick={() => {
                        if (item.available) router.push(`/booking?vehicleId=${item.id}`);
                      }}
                    >
                      {item.available ? "Book Now" : "Notify When Available"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-luxury-charcoal text-luxury-gray hover:border-luxury-gold hover:text-luxury-gold"
                      onClick={() => router.push(`/vehicles/${item.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View All */}
        {!loading && !err && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark"
              onClick={() => router.push("/pricing")}
            >
              View Complete Fleet
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Fleet;
