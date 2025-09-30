// File: app/purchase/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { http } from "@/lib/api";
import { imaginImageUrl } from "@/lib/imagin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const maybe = err as { message?: string; response?: { data?: unknown } };
    if (maybe.response?.data != null) return String(maybe.response.data);
    if (maybe.message) return maybe.message;
  }
  return "An unexpected error occurred.";
}

type VehicleApi = {
  vehicleID: number;   // backend PK
  modelID: number;
  vin: string;
  year: number;
  color?: string | null;
  transmission?: string | null;
  fuelType?: string | null;
  mileageKm?: number | null;
  basePrice: number;          // non-nullable in your model
  status?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  dailyRate?: number | null;
  imageUrl?: string | null;
  description?: string | null;

  // optional if your API includes populated model/brand later:
  model?: {
    name?: string | null;
    brandName?: string | null;
    family?: string | null;
    make?: string | null;      // alias for brandName
    modelFamily?: string | null;
    modelYear?: number | null;
  } | null;
};

type SaleResponse = {
  saleID: number;
  vehicleID: number;
  vehicleName: string;     // we send VIN from backend mapping
  make: string;
  modelFamily: string;
  modelYear?: number | null;
  price: number;
  paintDescription?: string | null;
  angle?: string | null;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string | null;
  createdAt: string;
};

const eur = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export default function PurchasePage() {
  const sp = useSearchParams();
  const router = useRouter();

  const vehicleId = Number(sp.get("vehicleId") || 0);
  const angle = sp.get("angle") || "23";
  const paint = sp.get("paint") || undefined;

  const [vehicle, setVehicle] = useState<VehicleApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Form state
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        if (!vehicleId) {
          setErr("Missing vehicleId.");
          return;
        }

        // Fetch your vehicle by backend PK
        const v = await http.get<VehicleApi>(`/vehicles/${vehicleId}`);
        if (!alive) return;
        setVehicle(v);
      } catch {
        if (alive) setErr("Failed to load vehicle.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [vehicleId]);

  const title = useMemo(() => {
    if (!vehicle) return "";
    // Try to build a human title: Brand + Model or fallback to VIN
    const brand = vehicle.model?.brandName || vehicle.model?.make || "";
    const modelName = vehicle.model?.name || vehicle.model?.family || "";
    const composed = [brand, modelName].filter(Boolean).join(" ");
    return composed || vehicle.vin;
  }, [vehicle]);

  const priceLabel = useMemo(() => {
    if (!vehicle) return "—";
    const price = vehicle.basePrice > 0 ? vehicle.basePrice : (vehicle.dailyRate ?? 0);
    return price > 0 ? eur.format(price) : "—";
  }, [vehicle]);

  const previewImage = useMemo(() => {
    if (!vehicle) return "";
    // Prefer backend image if available
    if (vehicle.imageUrl) return vehicle.imageUrl;

    // Fallback to IMAGIN when you have the necessary fields on the model record
    const make = vehicle.model?.brandName || vehicle.model?.make || "";
    const modelFamily = vehicle.model?.family || vehicle.model?.name || "";
    const modelYear = vehicle.model?.modelYear ?? vehicle.year;
    if (!make || !modelFamily) return "";

    return imaginImageUrl({
      make,
      modelFamily,
      modelYear,
      angle,
      paintDescription: paint,
      width: 1200,
    });
  }, [vehicle, angle, paint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    if (!buyerName.trim() || !buyerEmail.trim()) {
      alert("Please enter your name and email.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        vehicleID: vehicle.vehicleID,         // backend expects VehicleID
        buyerName,
        buyerEmail,
        buyerPhone: buyerPhone || null,
        paintDescription: paint || null,
        angle: angle || null,
      };

      const sale = await http.post<SaleResponse>("/sales", payload);

      router.replace(
        `/thank-you?saleId=${sale.saleID}&vehicleId=${vehicle.vehicleID}` +
          (paint ? `&paint=${encodeURIComponent(paint)}` : "") +
          (angle ? `&angle=${encodeURIComponent(angle)}` : "")
      );
    } catch (err: unknown) {
        console.error(err);
        alert(getErrorMessage(err));
        setSubmitting(false);
        }
  };

  if (loading) return <div className="container mx-auto px-4 py-16">Loading…</div>;
  if (err || !vehicle)
    return (
      <div className="container mx-auto px-4 py-16 text-destructive">
        {err ?? "Not found."}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* LEFT: Preview */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="text-sm text-muted-foreground mb-2">Confirm your selection</div>
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-muted">
          {previewImage ? (
            <img
              src={previewImage}
              alt={title}
              className="absolute inset-0 h-full w-full object-contain"
              fetchPriority="high"
            />
          ) : null}
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-serif font-semibold">{title}</h1>
          <div className="text-sm text-muted-foreground">
            {vehicle.year}{vehicle.color ? ` · ${vehicle.color}` : ""}{paint ? ` · ${paint}` : ""}
          </div>
          <div className="mt-3 text-2xl font-semibold">{priceLabel}</div>

          <div className="mt-3 flex gap-2 flex-wrap">
            <Badge variant="outline">Verified order</Badge>
            <Badge variant="outline">Fast delivery</Badge>
            <Badge variant="outline">Secure checkout</Badge>
          </div>
        </div>
      </div>

      {/* RIGHT: Checkout form */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Buyer details</h2>
        <p className="text-muted-foreground text-sm mt-1">
          We’ll email your verified order summary and next steps.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Full name</label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone (optional)</label>
            <input
              type="tel"
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="+383 49 123 123"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full mt-2"
            aria-busy={submitting}
          >
            {submitting ? "Placing order…" : "Place order"}
          </Button>

          <div className="text-xs text-muted-foreground">
            By placing this order you agree to our Terms. A confirmation email will be sent to you.
          </div>
        </form>
      </div>
    </div>
  );
}
