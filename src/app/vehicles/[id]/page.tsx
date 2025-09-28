// src/app/vehicles/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { http } from "@/lib/api";
import { imaginImageUrl, IMAGIN_SWATCHES } from "@/lib/imagin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Luggage, Fuel, Zap, Star } from "lucide-react";

type VehicleDto = {
  id: number;
  name: string;
  make: string;
  modelFamily: string;
  modelYear?: number;
  bodySize?: string;
  trim?: string;
  powerTrain?: string;
  pricePerDay: number;
  defaultPaintId?: string | null;

  // NEW
  description?: string | null;

  // Optional extras to keep Fleet-like UI consistent
  seats?: number | null;
  bags?: number | null;
  transmission?: string | null;
  fuel?: string | null;
  rating?: number | null;
  features?: string[] | null;
  modelPageUrl?: string | null;
};

const ANGLES: { value: string; label: string }[] = [
  { value: "23", label: "Front ¾" },
  { value: "1",  label: "Side" },
  { value: "33", label: "Top" },
  { value: "13", label: "Rear" },
];

const eur = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export default function VehiclePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const sp = useSearchParams();

  const [v, setV] = useState<VehicleDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [angle, setAngle] = useState<string>("23");
  const [paintDesc, setPaintDesc] = useState<string | undefined>(undefined);
  const [days, setDays] = useState<number>(3);
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await http.get<VehicleDto>(`/vehicles/${id}/config`);
        if (!alive) return;
        setV(data);
        setPaintDesc(sp.get("paint") || undefined);
        const a = sp.get("angle");
        if (a) setAngle(a);
      } catch {
        if (alive) setErr("Failed to load vehicle.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id, sp]);

  const imageUrl = useMemo(() => {
    if (!v) return "";
    return imaginImageUrl({
      make: v.make,
      modelFamily: v.modelFamily,
      modelYear: v.modelYear,
      trim: v.trim,
      bodySize: v.bodySize,
      powerTrain: v.powerTrain,
      angle,
      paintDescription: paintDesc,
      width: 1400,
    });
  }, [v, angle, paintDesc]);

  useEffect(() => {
    if (!imageUrl) return;
    setImgLoading(true);
  }, [imageUrl]);

  const total = v ? Math.max(1, days) * v.pricePerDay : 0;
  const angleLabel = ANGLES.find(a => a.value === angle)?.label ?? `Angle ${angle}`;

  if (loading) return <div className="container mx-auto px-4 py-16">Loading…</div>;
  if (err || !v)   return <div className="container mx-auto px-4 py-16 text-destructive">{err ?? "Not found."}</div>;

  const seats = v.seats ?? 5;
  const bags = v.bags ?? 3;
  const transmission = v.transmission ?? "Automatic";
  const fuel = v.fuel ?? v.powerTrain ?? "Petrol";
  const rating = (v.rating ?? 4.8).toFixed(1);
  const featureList = (v.features && v.features.length > 0)
    ? v.features
    : ["Premium Interior", "Premium Audio"];

  return (
    <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* LEFT: Gallery + selectors + specs */}
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={imageUrl}
            src={imageUrl}
            alt={`${v.name} ${paintDesc || ""}`}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${imgLoading ? "opacity-0" : "opacity-100"}`}
            onLoad={() => setImgLoading(false)}
          />
          {imgLoading && <div className="absolute inset-0 animate-pulse bg-muted/50" />}

          {/* Rating chip */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full border border-border">
              <Star className="w-3 h-3 text-luxury-gold fill-current" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          </div>
        </div>

        {/* Angles */}
        <div className="mt-4">
          <div className="mb-2 text-sm text-muted-foreground">View</div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {ANGLES.map((a) => {
              const active = a.value === angle;
              return (
                <button
                  key={a.value}
                  onClick={() => setAngle(a.value)}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-sm border ${
                    active ? "bg-accent text-foreground border-border" : "border-border hover:bg-accent/50"
                  }`}
                  aria-pressed={active}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Colors */}
        <div className="mt-4">
          <div className="mb-2 text-sm text-muted-foreground">Colors</div>
          <div className="flex items-center pt-1 gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setPaintDesc(undefined)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                !paintDesc ? "bg-accent text-foreground border-border" : "border-border hover:bg-accent/50"
              }`}
              aria-pressed={!paintDesc}
            >
              Default
            </button>

            {IMAGIN_SWATCHES.map((c) => {
              const active = paintDesc === c.q;
              return (
                <button
                  key={c.q}
                  onClick={() => setPaintDesc(c.q)}
                  aria-pressed={active}
                  title={c.label}
                  className={`relative h-9 w-9 shrink-0 rounded-full border transition ${
                    active ? "ring-2 ring-offset-2 ring-foreground" : "hover:ring-1 hover:ring-border"
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/10" />
                </button>
              );
            })}
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            {paintDesc ? `Selected: ${paintDesc}` : "Selected: Default"}
          </div>
        </div>

        {/* Specs */}
        <div className="mt-6 rounded-xl border border-border bg-background/60 p-4">
          <div className="mb-2 text-sm font-medium">Specifications</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-luxury-gray" />
              <span>{seats} Seats</span>
            </div>
            <div className="flex items-center gap-2">
              <Luggage className="w-4 h-4 text-luxury-gray" />
              <span>{bags} Bags</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-luxury-gray" />
              <span>{transmission}</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-luxury-gray" />
              <span>{fuel}</span>
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {featureList.map((f) => (
            <Badge key={f} variant="outline" className="text-xs border-luxury-charcoal">
              {f}
            </Badge>
          ))}
        </div>

        {/* Optional official page link */}
        {v.modelPageUrl ? (
          <div className="mt-4">
            <Button asChild variant="outline" className="border-luxury-charcoal hover:border-luxury-gold hover:text-luxury-gold">
              <a href={v.modelPageUrl} target="_blank" rel="noopener noreferrer">Official Model Page</a>
            </Button>
          </div>
        ) : null}
      </div>

      {/* RIGHT: summary + booking + description */}
      <div className="lg:sticky lg:top-24 h-fit rounded-2xl border border-border p-6">
        <h1 className="text-2xl font-serif font-semibold">{v.name}</h1>
        <div className="mt-2 text-sm text-muted-foreground">
          {v.make.toUpperCase()} · {v.modelFamily}{v.modelYear ? ` · ${v.modelYear}` : ""}
        </div>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="text-3xl font-semibold">{eur.format(v.pricePerDay)}</span>
          
        </div>

        <div className="mt-6 space-y-3">
          <label className="text-sm font-medium" htmlFor="days">Days</label>
          <input
            id="days"
            type="number"
            min={1}
            value={days}
            onChange={(e) => setDays(Math.max(1, Number(e.target.value || 1)))}
            className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <div className="text-sm text-muted-foreground">
            {angleLabel}{paintDesc ? ` • ${paintDesc}` : ""}
          </div>
          <div className="mt-2 text-lg font-medium">
            Total: {eur.format(total)}
          </div>
        </div>

       {/* Actions (inline links instead of buttons) */}
<div className="mt-6 text-sm">
  {(() => {
    const checkoutHref =
      `/booking?vehicleId=${v.id}` +
      `&days=${days}` +
      `&angle=${angle}` +
      (paintDesc ? `&paint=${encodeURIComponent(paintDesc)}` : "");

    return (
      <p className="text-muted-foreground">
        <a
          href={checkoutHref}
          onClick={(e) => { e.preventDefault(); router.push(checkoutHref); }}
          className="font-medium text-luxury-gold hover:underline"
          aria-label="Continue to checkout"
        >
          Continue to checkout
        </a>

        <span className="mx-2">or</span>

        <a
          href="/fleet"
          onClick={(e) => { e.preventDefault(); router.push("/pricing"); }}
          className="font-medium hover:underline"
          aria-label="Browse more cars"
        >
          browse more cars
        </a>


        
      </p>
    );
  })()}
</div>


        <div className="mt-6">
          <Badge variant="outline">Live imagery via IMAGIN</Badge>
        </div>

        {/* --- NEW: Description block at the bottom-right --- */}
        <div className="mt-8 border-t border-border pt-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          {v.description && v.description.trim().length > 0 ? (
            <p className="text-sm leading-6 text-muted-foreground whitespace-pre-line">
              {v.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Add a compelling description for this vehicle in the admin to display it here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
