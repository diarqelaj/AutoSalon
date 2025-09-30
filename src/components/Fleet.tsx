// src/components/Fleet.tsx
"use client";

import { useEffect,  useRef,useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Luggage, Fuel, Zap, Star } from "lucide-react";

const fallbackImage = "/luxury-fleet.jpg";

// ---- Types ----
type FleetItem = {
  id: number;
  name: string;
  category: string | null;
  basePrice?: number | null; // filled from /vehicles/:id
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

// ---- Helpers ----
function normalizeCategory(raw?: string | null): string {
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

const safeImageSrc = (src?: string | null): string | null => {
  const s = (src ?? "").trim();
  return s.length > 0 ? s : fallbackImage;
};

async function runLimited<T>(tasks: Array<() => Promise<T>>, limit: number): Promise<T[]> {
  const results: T[] = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

const MAX_TO_SHOW = 3;

function Spinner({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-muted-foreground/40 border-t-transparent ${className}`}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    />
  );
}

// --- Image with spinner overlay ---
function ImageWithSpinner({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(src);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src);
    setLoading(true);
  }, [src]);

  // handle cached images
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete && el.naturalWidth > 0) {
      setLoading(false);
    }
  }, [imgSrc]);

  return (
    <div className="relative h-64 bg-muted flex items-end justify-center px-3 pt-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={imgSrc ?? undefined}
        alt={alt}
        className={`max-h-full w-auto object-contain origin-bottom transition-opacity duration-300 ${className ?? ""} ${loading ? "opacity-0" : "opacity-100"}`}
        loading="lazy"           // use 'lazy' so the spinner actually appears before the image is fetched
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setLoading(false)}
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement;
          if (el.src !== "/luxury-fleet.jpg") {
            el.src = "/luxury-fleet.jpg"; // fallback
          }
          setLoading(false);
        }}
      />

      {/* Spinner overlay ONLY while loading */}
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-background/30 backdrop-blur-[2px]">
          <Spinner size={32} />
        </div>
      )}
    </div>
  );
}

// ---- Skeletons ----
function SkeletonPill({ className = "" }: { className?: string }) {
  return <div className={`rounded-full bg-muted animate-pulse ${className}`} />;
}
function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`h-4 rounded bg-muted animate-pulse ${className}`} />;
}
function SkeletonSpecRow({ icon, width = "w-24" }: { icon: React.ReactNode; width?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="opacity-40">{icon}</div>
      <SkeletonLine className={width} />
    </div>
  );
}
function SkeletonCard() {
  return (
    <Card className="border-luxury-charcoal bg-gradient-card overflow-hidden">
      <div className="relative h-64 bg-muted">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted/70 to-muted" />
        <div className="absolute top-4 left-4">
          <SkeletonPill className="h-6 w-24" />
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-luxury-gold opacity-40" />
            <SkeletonLine className="h-3 w-8" />
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <SkeletonLine className="h-5 w-40" />
          <SkeletonLine className="h-5 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <SkeletonSpecRow icon={<Users className="w-4 h-4" />} width="w-20" />
          <SkeletonSpecRow icon={<Luggage className="w-4 h-4" />} width="w-16" />
          <SkeletonSpecRow icon={<Zap className="w-4 h-4" />} width="w-24" />
          <SkeletonSpecRow icon={<Fuel className="w-4 h-4" />} width="w-20" />
        </div>
        <div className="space-y-2">
          <SkeletonLine className="h-10 w-full" />
          <SkeletonLine className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Component ----
export default function Fleet() {
  const router = useRouter();

  const [items, setItems] = useState<FleetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<string>("All Vehicles");
  const [fillingIds, setFillingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await api.get<FleetItem[]>("/vehicles/fleet");
        if (!alive) return;
        const list = res.data ?? [];
        setItems(list);

        const missing = list.filter((x) => !(x.basePrice != null && x.basePrice > 0));
        if (missing.length > 0) {
          setFillingIds(new Set(missing.map((m) => m.id)));

          const tasks = missing.map((m) => async () => {
            try {
              const r = await api.get<{ basePrice?: number | null; status?: string }>(`/vehicles/${m.id}`);
              if (!alive) return null;
              const bp = r?.data?.basePrice ?? null;
              setItems((prev) => prev.map((it) => (it.id === m.id ? { ...it, basePrice: bp } : it)));
              return bp;
            } catch {
              return null;
            } finally {
              if (alive) {
                setFillingIds((prev) => {
                  const next = new Set(prev);
                  next.delete(m.id);
                  return next;
                });
              }
            }
          });

          await runLimited(tasks, 4);
        }
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

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(normalizeCategory(i.category)));
    const order = ["SUV", "Sedan", "Hatchback", "Coupe", "Convertible", "Wagon", "Truck", "Van/MPV", "Other"];
    const present = Array.from(set);
    const sorted = [
      ...order.filter((o) => present.includes(o)),
      ...present.filter((p) => !order.includes(p)).sort(),
    ];
    return ["All Vehicles", ...sorted];
  }, [items]);

  const filtered = useMemo(() => {
    if (activeCat === "All Vehicles") return items;
    return items.filter((i) => normalizeCategory(i.category) === activeCat);
  }, [items, activeCat]);

  const displayItems = useMemo(() => filtered.slice(0, MAX_TO_SHOW), [filtered]);

  const renderPrice = (it: FleetItem) => {
    if (it.basePrice != null && it.basePrice > 0) {
      return <span className="text-luxury-gold font-semibold">{eur.format(it.basePrice)}</span>;
    }
    if (fillingIds.has(it.id)) return <span className="text-muted-foreground">…</span>;
    return <span className="text-muted-foreground">Contact for price</span>;
  };

  return (
    <section id="fleet" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Premium <span className="text-luxury-gold">Fleet</span>
          </h2>
          <p className="text-xl text-luxury-gray max-w-3xl mx-auto">
            Curated luxury & performance cars. Transparent pricing, fast test drives, easy financing.
          </p>
        </div>

        {/* tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12" role="tablist" aria-label="Fleet categories">
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
                role="tab"
              >
                {category}
              </Button>
            );
          })}
        </div>

        {err && !loading && <div className="text-center text-destructive mb-8">{err}</div>}

        {/* skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-live="polite" aria-busy="true">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* cards */}
        {!loading && !err && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayItems.map((item) => {
                const imgSrc = safeImageSrc(item.imageUrl);
                return (
                  <Card
                    key={item.id}
                    className="group hover:shadow-luxury transition-all duration-500 border-luxury-charcoal hover:border-luxury-gold/50 bg-gradient-card overflow-hidden"
                  >
                    {/* image with circular loader */}
                    <div className="relative">
                      <ImageWithSpinner
                        src={imgSrc}
                        alt={item.name}
                        className="group-hover:scale-[1.02]"
                      />

                      {/* top-left badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-luxury-gold text-luxury-dark">
                          {normalizeCategory(item.category)}
                        </Badge>
                      </div>
                      {/* top-right rating */}
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 text-luxury-gold fill-current" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>

                      {!item.available && (
                        <div className="absolute inset-0 bg-neutral-900/35 flex items-center justify-center">
                          <Badge className="bg-neutral-700/90 text-neutral-100">Currently Unavailable</Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-serif font-semibold">{item.name}</h3>
                        {renderPrice(item)}
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
                          className="w-full bg-gradient-luxury text-luxury-dark hover:shadow-glow transition-all"
                          onClick={() => router.push(`/vehicles/${item.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-luxury-charcoal text-luxury-gray hover:border-luxury-gold hover:text-luxury-gold"
                          onClick={() => router.push(`/contact?vehicleId=${item.id}`)}
                        >
                          Contact Sales
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

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
          </>
        )}
      </div>
    </section>
  );
}
