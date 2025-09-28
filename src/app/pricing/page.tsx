"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Luggage, Fuel, Zap, Star } from "lucide-react";

const PAGE_SIZE = 9;
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

function normalizeCategory(raw?: string): string {
  if (!raw) return "Other";
  const s = raw.toLowerCase().replace(/\s+/g, " ").trim();
  if (s.includes("suv")) return "SUV";
  if (s.includes("hatch")) return "Hatchback";
  if (s.includes("sedan") || s.includes("saloon")) return "Sedan";
  if (s.includes("coupe") || s.includes("coupé")) return "Coupe";
  if (s.includes("truck") || s.includes("pickup")) return "Truck";
  if (s.includes("wagon") || s.includes("estate")) return "Wagon";
  if (s.includes("convertible") || s.includes("cabrio") || s.includes("roadster")) return "Convertible";
  if (s.includes("van") || s.includes("mpv")) return "Van/MPV";
  return raw
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function PricingPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [items, setItems] = useState<FleetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const pageFromQS = Number(sp.get("page") || "1");
  const [page, setPage] = useState<number>(Number.isFinite(pageFromQS) && pageFromQS > 0 ? pageFromQS : 1);

  useEffect(() => {
    setPage(Number.isFinite(pageFromQS) && pageFromQS > 0 ? pageFromQS : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await api.get<FleetItem[]>("/vehicles/fleet");
        if (alive) setItems(res.data ?? []);
      } catch {
        if (alive) setErr("Failed to load vehicles. Please try again.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paged = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, safePage]);

  const gotoPage = (p: number) => {
    const clamped = Math.min(Math.max(1, p), totalPages);
    const qs = new URLSearchParams(sp.toString());
    qs.set("page", String(clamped));
    router.replace(`/pricing?${qs.toString()}`);
    setPage(clamped);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Our Fleet</h1>
          <p className="text-lg text-muted-foreground mt-2">Select a car to view live pricing and options.</p>
        </div>

        {loading && <div className="text-center text-muted-foreground">Loading vehicles…</div>}
        {err && !loading && <div className="text-center text-destructive mb-8">{err}</div>}

        {!loading && !err && items.length === 0 && (
          <div className="text-center text-muted-foreground">No vehicles available right now.</div>
        )}

        {!loading && !err && items.length > 0 && (
          <>
            {/* Grid (9 per page) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paged.map((item) => (
                <Card
                  key={item.id}
                  className="group hover:shadow-luxury pt-7 transition-all duration-500 border-luxury-charcoal hover:border-luxury-gold/50 bg-gradient-card overflow-hidden"
                >
                 <div className="relative h-64 bg-muted rounded-t-xl flex items-end justify-center px-3 pt-3">
                    <img
                        src={item.imageUrl ?? fallbackImage}
                        alt={item.name}
                        className="
                        max-h-full w-auto object-contain
                        transition-transform duration-500
                        origin-bottom group-hover:scale-[1.02]
                        "
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
    <>
      <div className="absolute inset-0 bg-neutral-900/35" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        <Badge className="bg-neutral-700/90 text-neutral-100">Currently Unavailable</Badge>
      </div>
    </>
  )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-serif font-semibold">{item.name}</h3>
                      <span className="text-luxury-gold font-semibold">
                        From {eur.format(item.pricePerDay)}/day
                      </span>
                    </div>

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

                   <div className="space-y-2">
 

  <Button
    variant="outline"
    className="w-full border-luxury-charcoal text-luxury-gray hover:border-luxury-gold hover:text-luxury-gold"
    onClick={() => router.push(`/vehicles/${item.id}`)}
  >
    View Details / Pricing
  </Button>
</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pager */}
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={safePage <= 1} onClick={() => gotoPage(safePage - 1)}>
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === safePage ? "default" : "outline"}
                  size="sm"
                  onClick={() => gotoPage(p)}
                  aria-pressed={p === safePage}
                >
                  {p}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() => gotoPage(safePage + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
