// src/app/pricing/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Luggage, Fuel, Zap, Star } from "lucide-react";

const PAGE_SIZE = 9;
const fallbackImage = "/luxury-fleet.jpg";

// We SELL cars. basePrice is the price we show.
// We'll also enrich each fleet item with `status` from /vehicles/:id
type VehicleStatus = "Available" | "Reserved" | "Sold" | string;

type FleetItem = {
  id: number;
  name: string;
  category: string | null;

  // RENTAL FIELDS (ignored)
  dailyRate?: number | null;
  pricePerDay?: number | null;

  // SALE FIELDS (used; may be missing from /fleet)
  basePrice?: number | null;

  transmission: string;
  fuel: string;
  available: boolean; // from /fleet (boolean)
  imageUrl?: string | null;
  modelPageUrl?: string | null;

  // we’ll attach this after fetching /vehicles/:id
  status?: VehicleStatus;
};

const eur = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

// super simple image cache so we don't refetch same URLs
const LOADED = new Set<string>();
const preloadImage = (src?: string | null) => {
  if (!src || LOADED.has(src)) return;
  const img = new Image() as HTMLImageElement & { fetchPriority?: "high" | "low" | "auto" };
  img.decoding = "async";
  img.fetchPriority = "low";
  img.onload = () => LOADED.add(src);
  img.onerror = () => {};
  img.src = src;
};

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

// types to read the /vehicles/:id details we need
type VehicleDetails = {
  basePrice?: number | null;
  status?: VehicleStatus | null;
};

// tiny concurrency limiter so we don’t flood the API
async function runLimited<T>(tasks: Array<() => Promise<T>>, limit: number): Promise<T[]> {
  const results: T[] = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}

// for setting fetchpriority without `any`
type FetchPrio = "high" | "low" | "auto";
type PriorityImgEl = HTMLImageElement & { fetchPriority?: FetchPrio };

export default function PricingPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [items, setItems] = useState<FleetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // track items we’re enriching with /vehicles/:id so we don’t flash "Contact for price"
  const [fillingIds, setFillingIds] = useState<Set<number>>(new Set());

  const pageFromQS = Number(sp.get("page") || "1");
  const [page, setPage] = useState<number>(Number.isFinite(pageFromQS) && pageFromQS > 0 ? pageFromQS : 1);

  // preloading next page images when pager becomes visible
  const pagerRef = useRef<HTMLDivElement | null>(null);
  const hasPreloadedNextRef = useRef(false);

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

        // 1) fetch fleet list (may be missing basePrice/status)
        const res = await api.get<FleetItem[]>("/vehicles/fleet");
        if (!alive) return;

        // normalize to ensure no rental prices are shown anywhere
        const list = (res.data ?? []).map((x) => ({
          ...x,
          dailyRate: null,
          pricePerDay: null,
        }));

        setItems(list);

        // 2) find those missing basePrice OR status and enrich from /vehicles/:id
        const missing = list.filter((x) => !(x.basePrice != null && x.basePrice > 0) || typeof x.status === "undefined");
        if (missing.length > 0) {
          setFillingIds(new Set(missing.map((m) => m.id)));

          const tasks = missing.map((m) => async () => {
            try {
              const r = await api.get<VehicleDetails>(`/vehicles/${m.id}`);
              if (!alive) return null;

              const details = r?.data ?? {};
              const bp = details.basePrice ?? null;
              const status = (details.status ?? undefined) as VehicleStatus | undefined;

              setItems((prev) =>
                prev.map((it) =>
                  it.id === m.id
                    ? {
                        ...it,
                        // only override basePrice if we actually got a number
                        basePrice: typeof bp === "number" ? bp : it.basePrice ?? null,
                        status: status ?? it.status,
                      }
                    : it
                )
              );
              return details;
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

          await runLimited(tasks, 4); // up to 4 parallel detail requests
        }
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

  // Preload the first row of images to feel instant
  useEffect(() => {
    paged.slice(0, 3).forEach((it) => preloadImage(it.imageUrl ?? fallbackImage));
  }, [paged]);

  // Preload next page when pager shows up
  useEffect(() => {
    if (!pagerRef.current || hasPreloadedNextRef.current) return;
    const el = pagerRef.current;
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasPreloadedNextRef.current) return;

        const nextPage = safePage + 1;
        if (nextPage <= totalPages) {
          const start = (nextPage - 1) * PAGE_SIZE;
          items.slice(start, start + PAGE_SIZE).forEach((it) => preloadImage(it.imageUrl ?? fallbackImage));
        }

        hasPreloadedNextRef.current = true;
        io.disconnect();
      },
      { rootMargin: "200px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [items, safePage, totalPages]);

  const gotoPage = (p: number) => {
    const clamped = Math.min(Math.max(1, p), totalPages);
    const qs = new URLSearchParams(sp.toString());
    qs.set("page", String(clamped));
    router.replace(`/pricing?${qs.toString()}`);
    setPage(clamped);
    hasPreloadedNextRef.current = false; // allow another preload
  };

  // SALE price only.
  // While we’re fetching /vehicles/:id for this card, show "…", not “Contact for price”.
  const renderPrice = (it: FleetItem) => {
    if (it.basePrice != null && it.basePrice > 0) {
      return <span className="text-luxury-gold font-semibold">{eur.format(it.basePrice)}</span>;
    }
    if (fillingIds.has(it.id)) {
      return <span className="text-muted-foreground">…</span>;
    }
    return <span className="text-muted-foreground">Contact for price</span>;
  };

  // Compute visual “not available” state from either status or available flag
  const computeCardState = (it: FleetItem) => {
    const st = (it.status ?? "") as string;
    const reserved = /reserved/i.test(st);
    const sold = /sold/i.test(st);
    const unavailable = !it.available;
    const dim = sold || reserved || unavailable;
    let badge: string | null = null;
    if (sold) badge = "Sold";
    else if (reserved) badge = "Reserved";
    else if (unavailable) badge = "Unavailable";
    return { dim, badge };
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Our Fleet</h1>
          <p className="text-lg text-muted-foreground mt-2">Select a car to view details and options.</p>
        </div>

        {loading && <div className="text-center text-muted-foreground">Loading vehicles…</div>}
        {err && !loading && <div className="text-center text-destructive mb-8">{err}</div>}

        {!loading && !err && items.length === 0 && (
          <div className="text-center text-muted-foreground">No vehicles available right now.</div>
        )}

        {!loading && !err && items.length > 0 && (
          <>
            {/* 9 per page */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paged.map((item, idx) => {
                const imgSrc = item.imageUrl ?? fallbackImage;
                const priority = idx < 3; // eager-load first row
                const { dim, badge } = computeCardState(item);

                return (
                  <Card
                    key={item.id}
                    className="group hover:shadow-luxury pt-7 transition-all duration-500 border-luxury-charcoal hover:border-luxury-gold/50 bg-gradient-card overflow-hidden"
                    onMouseEnter={() => preloadImage(imgSrc)}
                  >
                    <div className="relative h-64 bg-muted rounded-t-xl flex items-end justify-center px-3 pt-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="max-h-full w-auto object-contain transition-transform duration-500 origin-bottom group-hover:scale-[1.02]"
                        loading={priority ? "eager" : "lazy"}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        // set fetchpriority via ref without `any`
                        ref={(node) => {
                          if (!node) return;
                          const el = node as PriorityImgEl;
                          const val: FetchPrio = priority ? "high" : "low";
                          if (typeof el.fetchPriority !== "undefined") el.fetchPriority = val;
                          else el.setAttribute("fetchpriority", val);
                        }}
                      />

                      {/* category chip */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-luxury-gold text-luxury-dark">
                          {normalizeCategory(item.category || undefined)}
                        </Badge>
                      </div>

                      {/* rating chip (static 4.8 for now) */}
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 text-luxury-gold fill-current" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>

                      {/* status overlay */}
                      {dim && (
                        <>
                          <div className="absolute inset-0 bg-neutral-900/35" aria-hidden="true" />
                          {badge && (
                            <div className="absolute inset-x-0 bottom-3 flex justify-center">
                              <Badge className="bg-neutral-700/90 text-neutral-100">{badge}</Badge>
                            </div>
                          )}
                        </>
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
                        {/* pass basePrice to details via query for instant price on detail page */}
                        <Button
                          variant="outline"
                          className="w-full border-luxury-charcoal text-luxury-gray hover:border-luxury-gold hover:text-luxury-gold"
                          onClick={() => {
                            const bp = (item.basePrice ?? "") as number | "";
                            router.push(`/vehicles/${item.id}?bp=${bp}`);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pager */}
            <div ref={pagerRef} className="mt-10 flex items-center justify-center gap-2">
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
