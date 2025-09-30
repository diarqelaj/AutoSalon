"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { http } from "@/lib/api";
import { imaginImageUrl } from "@/lib/imagin";

type SaleRead = {
  saleID: number;
  vehicleID: number;
  vehicleName: string;   // VIN or model name from backend mapping
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

export default function OrderDetailsPage() {
  const params = useParams<{ saleId: string }>();
  const router = useRouter();

  const saleId = Number(params?.saleId || 0);

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

        if (!saleId || Number.isNaN(saleId)) {
          setErr("Invalid order id.");
          return;
        }

        const s = await http.get<SaleRead>(`/sales/${saleId}`);
        if (!alive) return;
        setSale(s);

        // Optional: fetch vehicle for richer image/model info
        try {
          const v = await http.get<VehicleApi>(`/vehicles/${s.vehicleID}`);
          if (!alive) return;
          setVehicle(v);
        } catch {
          /* vehicle is optional */
        }
      } catch {
        if (alive) setErr("Failed to load order.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [saleId]);

  const imageUrl = useMemo(() => {
    if (!sale) return "";
    // Prefer backend-provided image if present
    if (vehicle?.imageUrl) return vehicle.imageUrl;

    const make =
      sale.make ||
      vehicle?.model?.brandName ||
      vehicle?.model?.make ||
      "";
    const modelFamily =
      sale.modelFamily ||
      vehicle?.model?.family ||
      vehicle?.model?.name ||
      "";
    const modelYear = sale.modelYear ?? vehicle?.model?.modelYear ?? vehicle?.year;
    if (!make || !modelFamily) return "";

    return imaginImageUrl({
      make,
      modelFamily,
      modelYear: modelYear ?? undefined,
      angle: sale.angle || "23",
      paintDescription: sale.paintDescription || undefined,
      width: 1400,
    });
  }, [sale, vehicle]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">Loading…</div>
    );
  }

  if (err || !sale) {
    return (
      <div className="container mx-auto px-4 py-16 text-destructive">
        {err ?? "Order not found."}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>&larr; Back</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start">
          {/* Left: details */}
          <div>
            <h1 className="text-3xl font-serif font-semibold">Order #{sale.saleID}</h1>
            <p className="mt-2 text-muted-foreground">
              Placed on{" "}
              <span className="text-foreground">
                {new Date(sale.createdAt).toLocaleString()}
              </span>
            </p>

            <div className="mt-6 space-y-5">
              <section>
                <div className="text-sm text-muted-foreground">Buyer</div>
                <div className="mt-1">
                  <div className="font-medium">{sale.buyerName}</div>
                  <div className="text-muted-foreground">{sale.buyerEmail}</div>
                  {sale.buyerPhone ? (
                    <div className="text-muted-foreground">{sale.buyerPhone}</div>
                  ) : null}
                </div>
              </section>

              <section>
                <div className="text-sm text-muted-foreground">Vehicle</div>
                <div className="mt-1 font-medium">
                  {sale.vehicleName}
                  {sale.modelYear ? ` · ${sale.modelYear}` : ""}
                  {sale.paintDescription ? ` · ${sale.paintDescription}` : ""}
                </div>
              </section>

              <section>
                <div className="text-sm text-muted-foreground">Total paid</div>
                <div className="mt-1 text-2xl font-semibold">
                  {eur.format(sale.price)}
                </div>
              </section>

              {/* Simple status timeline (static demo-friendly) */}
              <section>
                <div className="text-sm text-muted-foreground mb-2">Status</div>
                <ol className="relative border-s pl-4 space-y-4">
                  <li className="ms-2">
                    <span className="absolute -start-1.5 mt-1 size-3 rounded-full bg-primary" />
                    <p className="font-medium">Order confirmed</p>
                    <p className="text-sm text-muted-foreground">
                      We’ve received your order and started processing.
                    </p>
                  </li>
                  <li className="ms-2">
                    <span className="absolute -start-1.5 mt-1 size-3 rounded-full bg-muted-foreground" />
                    <p className="font-medium">Preparing vehicle</p>
                    <p className="text-sm text-muted-foreground">
                      Detailing & final inspection underway.
                    </p>
                  </li>
                  <li className="ms-2">
                    <span className="absolute -start-1.5 mt-1 size-3 rounded-full bg-muted-foreground" />
                    <p className="font-medium">On the way</p>
                    <p className="text-sm text-muted-foreground">
                      You’ll receive an email with delivery window.
                    </p>
                  </li>
                </ol>
              </section>

              <div className="pt-2 flex gap-3">
                <Button onClick={() => router.push("/fleet")}>Browse more cars</Button>
                <Button variant="outline" onClick={() => window.print()}>
                  Print receipt
                </Button>
              </div>
            </div>
          </div>

          {/* Right: image */}
          <div className="rounded-xl border border-border overflow-hidden bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={sale.vehicleName}
                className="w-full h-full object-contain"
                fetchPriority="high"
              />
            ) : (
              <div className="p-8 text-sm text-muted-foreground">
                Image not available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
