// File: app/thank-you/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { http } from "@/lib/api";
import { imaginImageUrl } from "@/lib/imagin";
import { Button } from "@/components/ui/button";

type SaleRead = {
  saleID: number;
  vehicleID: number;
  vehicleName: string;   // VIN from backend mapping
  make: string;          // may be empty (backend)
  modelFamily: string;   // may be empty (backend)
  modelYear?: number | null;
  price: number;
  paintDescription?: string | null;
  angle?: string | null;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string | null;
  createdAt: string;
};

type VehicleApi = {
  vehicleID: number;
  year: number;
  imageUrl?: string | null;
  model?: {
    name?: string | null;
    brandName?: string | null;
    family?: string | null;
    make?: string | null;
    modelFamily?: string | null;
    modelYear?: number | null;
  } | null;
};

const eur = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export default function ThankYouPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const saleId = Number(sp.get("saleId") || 0);
  const qAngle = sp.get("angle") || "23";
  const qPaint = sp.get("paint") || undefined;

  const [sale, setSale] = useState<SaleRead | null>(null);
  const [vehicle, setVehicle] = useState<VehicleApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        if (!saleId) {
          setErr("Missing saleId.");
          return;
        }

        const s = await http.get<SaleRead>(`/sales/${saleId}`);
        if (!alive) return;
        setSale(s);

        // also fetch vehicle to get imageUrl or richer model info
        try {
          const v = await http.get<VehicleApi>(`/vehicles/${s.vehicleID}`);
          if (!alive) return;
          setVehicle(v);
        } catch { /* optional */ }

        // confetti
        setTimeout(() => {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.3 } });
        }, 200);
      } catch {
        if (alive) setErr("Failed to load your order.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [saleId]);

  const imageUrl = useMemo(() => {
    if (!sale) return "";
    // Prefer backend vehicle image if available
    if (vehicle?.imageUrl) return vehicle.imageUrl;

    // Fallback to IMAGIN when we have enough info
    const make = sale.make || vehicle?.model?.brandName || vehicle?.model?.make || "";
    const modelFamily = sale.modelFamily || vehicle?.model?.family || vehicle?.model?.name || "";
    const modelYear = sale.modelYear ?? vehicle?.model?.modelYear ?? vehicle?.year;
    if (!make || !modelFamily) return "";

    return imaginImageUrl({
      make,
      modelFamily,
      modelYear: modelYear ?? undefined,
      angle: qAngle || sale.angle || "23",
      paintDescription: qPaint || sale.paintDescription || undefined,
      width: 1400,
    });
  }, [sale, vehicle, qAngle, qPaint]);

  if (loading) return <div className="container mx-auto px-4 py-16">Loading…</div>;
  if (err || !sale)
    return (
      <div className="container mx-auto px-4 py-16 text-destructive">
        {err ?? "Order not found."}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl font-serif font-semibold">Thank you, {sale.buyerName}!</h1>
            <p className="mt-2 text-muted-foreground">
              Your order has been <span className="text-foreground font-medium">verified</span>.  
              Your car is on the way 🚗✨
            </p>

            <div className="mt-6">
              <div className="text-sm text-muted-foreground">Order number</div>
              <div className="text-lg font-medium">#{sale.saleID}</div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-muted-foreground">Car</div>
              <div className="text-lg font-medium">
                {sale.vehicleName}
                {sale.modelYear ? ` · ${sale.modelYear}` : ""}
                {sale.paintDescription ? ` · ${sale.paintDescription}` : ""}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-muted-foreground">Total paid</div>
              <div className="text-2xl font-semibold">{eur.format(sale.price)}</div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button onClick={() => router.push(`/fleet`)}>Browse more cars</Button>
              <Button variant="outline" onClick={() => router.push(`/orders/${sale.saleID}`)}>
                View order
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              A confirmation has been sent to <span className="text-foreground">{sale.buyerEmail}</span>.
            </p>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={sale.vehicleName}
                className="w-full h-full object-contain"
                fetchPriority="high"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
