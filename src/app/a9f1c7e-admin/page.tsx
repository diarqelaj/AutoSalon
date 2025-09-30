// src/app/a9f1c7e-admin/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  ShieldCheck,
  Lock,
  Unlock,
} from "lucide-react";

/* -----------------------------------------------------------
   Tiny client cache (per-URL) – tab switch me shpejt
   (kom: e thjesht, s'ka expiry; mjafton per admin UI)
----------------------------------------------------------- */
type CacheEntry<T> = { data: T | null; ts: number };
const _cache = new Map<string, CacheEntry<unknown>>();
function getCache<T>(key: string): T | null {
  const hit = _cache.get(key);
  return (hit?.data as T) ?? null;
}
function setCache<T>(key: string, data: T) {
  _cache.set(key, { data, ts: Date.now() });
}

/* -----------------------------------------------------------
   Types – merri vesh me backend tond
----------------------------------------------------------- */
type Vehicle = {
  vehicleID: number;
  modelID: number;
  vin: string;
  year: number;
  color: string;
  transmission: string;
  fuelType: string;
  mileageKm: number;
  basePrice: number | null;
  status: "Available" | "Reserved" | "Sold";
  description?: string | null;
  imageUrl?: string | null;
};

type Model = {
  modelID: number;
  brandID: number;
  name: string;
  bodyType?: string | null;
  modelPageUrl?: string | null;
  featuresCsv?: string | null;
};

type Brand = {
  brandID: number;
  name: string;
  country?: string | null;
  website?: string | null;
};

/* Users (map me AuthController admin* DTO-t) */
type UserRole = "Admin" | "User";
type AppUser = {
  id: number;
  email: string;
  role: UserRole;
  username?: string | null;
  fullName?: string | null;
  isActive: boolean;
  locked?: boolean; // jo ne API — UI-only flag (leave false)
  createdAt: string;
};
type Sale = {
  saleID: number;
  vehicleID: number;
  vehicleName: string;    
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

type PagedResult<T> = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: T[];
};


function useList<T>(url: string) {
  const [data, setData] = useState<T[] | null>(() => getCache<T[]>(url));
  const [loading, setLoading] = useState(!getCache<T[]>(url));
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<T[]>(url);
      setData(res.data);
      setCache(url, res.data);
    } catch {
      setError("Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data) void load();
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, setData, loading, error, reload: load };
}

/* -----------------------------------------------------------
   Tabs – i thjesht (pa deps)
----------------------------------------------------------- */
function Tabs({
  value,
  onChange,
  labels,
}: {
  value: string;
  onChange: (v: string) => void;
  labels: { id: string; title: string }[];
}) {
  return (
    <div className="flex gap-2 border-b border-border">
      {labels.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-2 text-sm border-b-2 ${
            value === t.id
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          aria-pressed={value === t.id}
        >
          {t.title}
        </button>
      ))}
    </div>
  );
}

/* -----------------------------------------------------------
   Modal – minimal (pa portal)
----------------------------------------------------------- */
function Modal({
  open,
  title,
  children,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[min(720px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer ? (
          <div className="border-t border-border p-3 flex justify-end gap-2">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* -----------------------------------------------------------
   Admin Page (guard: only Admin)
----------------------------------------------------------- */
export default function AdminPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"vehicles" | "models" | "brands" | "users" | "fleet" | "orders">("vehicles");


  useEffect(() => {
    const u = getCurrentUser();
    // koment: nese s'je admin, ktheje te root
    if (!u || u.role !== "Admin") {
      router.replace("/");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (allowed === null) {
    return (
      <section className="container mx-auto px-4 py-20">
        <div className="h-8 w-44 bg-muted rounded animate-pulse mb-6" />
        <div className="h-40 bg-muted rounded animate-pulse" />
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage inventory, models, brands, users.
        </p>
      </div>

      <Tabs
        value={tab}
        onChange={(v) => setTab(v as typeof tab)}
        labels={[
          { id: "vehicles", title: "Vehicles" },
          { id: "models", title: "Models" },
          { id: "brands", title: "Brands" },
          { id: "users", title: "Users" },
          { id: "fleet", title: "Fleet" },
          { id: "orders", title: "Orders" },

        ]}
      />

      <div className="mt-6">
        {tab === "vehicles" && <VehiclesPanel />}
        {tab === "models" && <ModelsPanel />}
        {tab === "brands" && <BrandsPanel />}
        {tab === "users" && <UsersPanel />}
        {tab === "fleet" && <FleetPanel />}
        {tab === "orders" && <OrdersPanel />} 
      </div>
    </section>
  );
}

function OrderModal({
  open,
  onClose,
  editing,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  editing: Sale | null;
  onSaved: () => void;
}) {
  // Always call hooks at the top level
  const [buyerName, setBuyerName] = useState<string>(editing?.buyerName ?? "");
  const [buyerEmail, setBuyerEmail] = useState<string>(editing?.buyerEmail ?? "");
  const [buyerPhone, setBuyerPhone] = useState<string>(editing?.buyerPhone ?? "");
  const [price, setPrice] = useState<number>(editing?.price ?? 0);
  const [vehicleID, setVehicleID] = useState<number>(editing?.vehicleID ?? 0);
  const [paintDescription, setPaintDescription] = useState<string>(editing?.paintDescription ?? "");
  const [angle, setAngle] = useState<string>(editing?.angle ?? "");

  // Keep local state in sync when a new order is opened
  useEffect(() => {
    if (open && editing) {
      setBuyerName(editing.buyerName);
      setBuyerEmail(editing.buyerEmail);
      setBuyerPhone(editing.buyerPhone ?? "");
      setPrice(editing.price);
      setVehicleID(editing.vehicleID);
      setPaintDescription(editing.paintDescription ?? "");
      setAngle(editing.angle ?? "");
    }
  }, [open, editing]);

  // It's safe to return after hooks
  if (!open || !editing) return null;

  const save = async () => {
    try {
      await api.put(`/sales/${editing.saleID}`, {
        vehicleID,
        buyerName,
        buyerEmail,
        buyerPhone: buyerPhone || null,
        price,
        paintDescription: paintDescription || null,
        angle: angle || null,
      });
      onSaved();
      onClose();
    } catch {
      // optional: toast
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit Order #${editing.saleID}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save}>Save changes</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          type="number"
          placeholder="VehicleID"
          value={vehicleID}
          onChange={(e) => setVehicleID(Number(e.target.value))}
        />
        <Input
          placeholder="Buyer Name"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Buyer Email"
          value={buyerEmail}
          onChange={(e) => setBuyerEmail(e.target.value)}
        />
        <Input
          placeholder="Buyer Phone"
          value={buyerPhone}
          onChange={(e) => setBuyerPhone(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Price (€)"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <Input
          placeholder="Paint Description"
          value={paintDescription}
          onChange={(e) => setPaintDescription(e.target.value)}
        />
        <Input
          placeholder="Angle"
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
        />
        <div className="md:col-span-2 text-xs text-muted-foreground">
          Note: changing VehicleID will re-link this order to a different vehicle.
        </div>
      </div>
    </Modal>
  );
}
/* ===========================================================
   ORDERS (Sales) — LIST PANEL
=========================================================== */
function OrdersPanel() {
  const router = useRouter();

  // filters + paging
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [sort, setSort] = useState<string>("-createdAt");

  // data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Sale[]>([]);
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const url =
        `/sales?page=${page}&pageSize=${pageSize}` +
        (q ? `&search=${encodeURIComponent(q)}` : "") +
        (dateFrom ? `&dateFrom=${encodeURIComponent(dateFrom)}` : "") +
        (dateTo ? `&dateTo=${encodeURIComponent(dateTo)}` : "") +
        (sort ? `&sort=${encodeURIComponent(sort)}` : "");
      const res = await api.get<PagedResult<Sale>>(url);
      setRows(res.data.items);
      setTotal(res.data.totalItems);
    } catch {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sort]); // search triggers via button

  const viewOrder = (s: Sale) => {
    router.push(
      `/thank-you?saleId=${s.saleID}&vehicleId=${s.vehicleID}` +
        (s.paintDescription ? `&paint=${encodeURIComponent(s.paintDescription)}` : "") +
        (s.angle ? `&angle=${encodeURIComponent(s.angle)}` : "")
    );
  };

  const handleDelete = async (id: number) => {
    const snapshot = rows;
    setRows((prev) => prev.filter((x) => x.saleID !== id));
    try {
      await api.delete(`/sales/${id}`);
      if (total - 1 <= (page - 1) * pageSize && page > 1) {
        setPage(page - 1);
      } else {
        void load();
      }
    } catch {
      setRows(snapshot);
    }
  };

  // modal state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Sale | null>(null);
  const startEdit = (s: Sale) => {
    setEditing(s);
    setOpen(true);
  };

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        {/* Filter bar */}
        <div className="mb-5 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto_auto] gap-3">
          <Input
            className="w-full"
            placeholder="Search buyer email / name / VIN…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="From" />
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} title="To" />
          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            title="Sort"
          >
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="-price">Price (high → low)</option>
            <option value="price">Price (low → high)</option>
          </select>
          <Button
            variant="outline"
            onClick={() => {
              setPage(1);
              void load();
            }}
          >
            Search
          </Button>
        </div>

        {loading && <div className="text-muted-foreground">Loading orders…</div>}
        {error && <div className="text-destructive">{error}</div>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-2 pr-3">Order #</th>
                    <th className="py-2 pr-3">Created</th>
                    <th className="py-2 pr-3">Buyer</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Vehicle (VIN/name)</th>
                    <th className="py-2 pr-3">Price</th>
                    <th className="py-2 pr-0 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s.saleID} className="border-b border-border/70">
                      <td className="py-2 pr-3 font-mono">#{s.saleID}</td>
                      <td className="py-2 pr-3">{new Date(s.createdAt).toLocaleString()}</td>
                      <td className="py-2 pr-3">{s.buyerName}</td>
                      <td className="py-2 pr-3">{s.buyerEmail}</td>
                      <td className="py-2 pr-3">
                        {s.vehicleName}
                        {s.modelYear ? ` · ${s.modelYear}` : ""}
                        {s.paintDescription ? ` · ${s.paintDescription}` : ""}
                      </td>
                      <td className="py-2 pr-3">€ {Math.round(s.price).toLocaleString()}</td>
                      <td className="py-2 pl-3">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => viewOrder(s)}>View</Button>
                          <Button variant="outline" size="sm" onClick={() => startEdit(s)}>Edit</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(s.saleID)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-muted-foreground">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pager */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Page {page} / {totalPages} • {total.toLocaleString()} orders
              </span>
              <div className="flex items-center gap-2">
                <select
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Prev
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {/* Re-use your existing modal */}
      <OrderModal
        open={open}
        onClose={() => setOpen(false)}
        editing={editing}
        onSaved={() => void load()}
      />
    </Card>
  );
}


function VehiclesPanel() {
  const { data, setData, loading, error, reload } =
    useList<Vehicle>("/vehicles");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const list = data ?? [];
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (v) =>
        v.vin.toLowerCase().includes(s) ||
        String(v.year).includes(s) ||
        v.color.toLowerCase().includes(s) ||
        String(v.basePrice ?? "").includes(s)
    );
  }, [data, q]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);

  const startNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const startEdit = (v: Vehicle) => {
    setEditing(v);
    setOpen(true);
  };

  const optimisticRemove = (id: number) => {
    setData((prev) => (prev ? prev.filter((x) => x.vehicleID !== id) : prev));
  };
  const handleDelete = async (id: number) => {
    const snapshot = data ?? [];
    optimisticRemove(id);
    try {
      await api.delete(`/vehicles/${id}`);
    } catch {
      setData(snapshot);
    }
  };

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Input
            className="max-w-sm"
            placeholder="Search VIN / color / year / price…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button variant="outline" size="sm" onClick={reload}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={startNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Vehicle
          </Button>
        </div>

        {loading && (
          <div className="text-muted-foreground">Loading vehicles…</div>
        )}
        {error && <div className="text-destructive">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="py-2 pr-3">VIN</th>
                  <th className="py-2 pr-3">Year</th>
                  <th className="py-2 pr-3">Color</th>
                  <th className="py-2 pr-3">Trans</th>
                  <th className="py-2 pr-3">Fuel</th>
                  <th className="py-2 pr-3">Mileage</th>
                  <th className="py-2 pr-3">Base Price</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(filtered ?? []).map((v) => (
                  <tr key={v.vehicleID} className="border-b border-border/70">
                    <td className="py-2 pr-3 font-mono">{v.vin}</td>
                    <td className="py-2 pr-3">{v.year}</td>
                    <td className="py-2 pr-3">{v.color}</td>
                    <td className="py-2 pr-3">{v.transmission}</td>
                    <td className="py-2 pr-3">{v.fuelType}</td>
                    <td className="py-2 pr-3">
                      {v.mileageKm.toLocaleString()} km
                    </td>
                    <td className="py-2 pr-3">
                      {v.basePrice != null ? (
                        <>€ {Math.round(v.basePrice).toLocaleString()}</>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <Badge variant="outline">{v.status}</Badge>
                    </td>
                    <td className="py-2 pl-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => startEdit(v)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(v.vehicleID)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No vehicles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <VehicleModal
        open={open}
        onClose={() => setOpen(false)}
        editing={editing}
        onSaved={reload}
        setList={setData}
      />
    </Card>
  );
}
function FleetPanel() {
  // marrim te dhenat bazike (kom: fleet = view e vehicles + emri i modelit)
  const { data: vehicles, setData, loading, error, reload } = useList<Vehicle>("/vehicles");
  const { data: models } = useList<Model>("/models");

  const [q, setQ] = useState("");

  // map modelID -> name per kolone
  const modelName = useMemo(() => {
    const m = new Map<number, string>();
    (models ?? []).forEach((x) => m.set(x.modelID, x.name));
    return m;
  }, [models]);

  const filtered = useMemo(() => {
    const list = vehicles ?? [];
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter((v) => {
      const name = modelName.get(v.modelID)?.toLowerCase() ?? "";
      return (
        v.vin.toLowerCase().includes(s) ||
        name.includes(s) ||
        String(v.year).includes(s) ||
        String(v.basePrice ?? "").includes(s) ||
        (v.color ?? "").toLowerCase().includes(s)
      );
    });
  }, [vehicles, q, modelName]);

  // inline update helpers
  const patchVehicle = async (id: number, changes: Partial<Vehicle>) => {
    const snap = vehicles ?? [];
    setData((prev) =>
      prev
        ? prev.map((x) => (x.vehicleID === id ? { ...x, ...changes } : x))
        : prev
    );
    try {
      const current = snap.find((x) => x.vehicleID === id);
      await api.put(`/vehicles/${id}`, { ...current, ...changes });
    } catch {
      // rollback by reload
      await reload();
    }
  };

  const setStatus = (v: Vehicle, status: Vehicle["status"]) =>
    patchVehicle(v.vehicleID, { status });

  const setPrice = (v: Vehicle, value: string) => {
    const n = value === "" ? null : Number(value);
    patchVehicle(v.vehicleID, { basePrice: Number.isFinite(n as number) ? (n as number) : null });
  };

  const setImage = (v: Vehicle, url: string) =>
    patchVehicle(v.vehicleID, { imageUrl: url });

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Input
            className="max-w-sm"
            placeholder="Search model / VIN / year / price…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button variant="outline" size="sm" onClick={reload}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
         
        </div>

        {loading && <div className="text-muted-foreground">Loading fleet…</div>}
        {error && <div className="text-destructive">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="py-2 pr-3">Image</th>
                  <th className="py-2 pr-3">Model</th>
                  <th className="py-2 pr-3">VIN</th>
                  <th className="py-2 pr-3">Year</th>
                  <th className="py-2 pr-3">Price (€)</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-0 text-right">Quick</th>
                </tr>
              </thead>
              <tbody>
                {(filtered ?? []).map((v) => {
                  const name = modelName.get(v.modelID) ?? `Model #${v.modelID}`;
                  return (
                    <tr key={v.vehicleID} className="border-b border-border/70 align-top">
                      <td className="py-2 pr-3 w-[160px]">
                        <div className="flex gap-3 items-start">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={v.imageUrl || "/luxury-fleet.jpg"}
                            alt={name}
                            className="h-16 w-24 object-cover rounded border border-border"
                          />
                          <Input
                            className="h-9"
                            placeholder="Image URL"
                            defaultValue={v.imageUrl ?? ""}
                            onBlur={(e) => setImage(v, e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-muted-foreground">
                          {v.color} • {v.transmission} • {v.fuelType}
                        </div>
                      </td>
                      <td className="py-2 pr-3 font-mono">{v.vin}</td>
                      <td className="py-2 pr-3">{v.year}</td>
                      <td className="py-2 pr-3">
                        <Input
                          type="number"
                          className="h-9 w-36"
                          defaultValue={v.basePrice ?? ""}
                          placeholder="—"
                          onBlur={(e) => setPrice(v, e.target.value)}
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <select
                          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                          defaultValue={v.status}
                          onChange={(e) => setStatus(v, e.target.value as Vehicle["status"])}
                        >
                          <option value="Available">Available</option>
                          <option value="Reserved">Reserved</option>
                          <option value="Sold">Sold</option>
                        </select>
                      </td>
                      <td className="py-2 pl-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStatus(v, "Reserved")}
                          >
                            Reserve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStatus(v, "Sold")}
                          >
                            Mark Sold
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStatus(v, "Available")}
                          >
                            Available
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {(filtered ?? []).length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      No fleet vehicles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


function VehicleModal({
  open,
  onClose,
  editing,
  onSaved,
  setList,
}: {
  open: boolean;
  onClose: () => void;
  editing: Vehicle | null;
  onSaved: () => void;
  setList: React.Dispatch<React.SetStateAction<Vehicle[] | null>>;
}) {
  const isEdit = !!editing;
  const [form, setForm] = useState<Partial<Vehicle>>(
    editing ?? {
      vehicleID: 0,
      modelID: 0,
      vin: "",
      year: new Date().getFullYear(),
      color: "",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileageKm: 0,
      basePrice: null,
      status: "Available",
      description: "",
      imageUrl: "",
    }
  );
  useEffect(() => {
    setForm(
      editing ?? {
        vehicleID: 0,
        modelID: 0,
        vin: "",
        year: new Date().getFullYear(),
        color: "",
        transmission: "Automatic",
        fuelType: "Petrol",
        mileageKm: 0,
        basePrice: null,
        status: "Available",
        description: "",
        imageUrl: "",
      }
    );
  }, [editing]);

  const set = <K extends keyof Vehicle>(k: K, v: Vehicle[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    if (isEdit) {
      // kom: optimistik – pastaj revalidate
      setList((prev) =>
        prev
          ? prev.map((x) =>
              x.vehicleID === editing!.vehicleID
                ? ({ ...x, ...form, vehicleID: editing!.vehicleID } as Vehicle)
                : x
            )
          : prev
      );
      try {
        await api.put(`/vehicles/${editing!.vehicleID}`, {
          ...editing,
          ...form,
        });
        onSaved();
        onClose();
      } catch {
        onSaved(); // rollback via reload
      }
    } else {
      const tempId = Math.floor(Math.random() * 1e9);
      const draft: Vehicle = {
        vehicleID: tempId,
        modelID: Number(form.modelID) || 0,
        vin: String(form.vin || ""),
        year: Number(form.year) || new Date().getFullYear(),
        color: String(form.color || ""),
        transmission: String(form.transmission || "Automatic"),
        fuelType: String(form.fuelType || "Petrol"),
        mileageKm: Number(form.mileageKm) || 0,
        basePrice: form.basePrice != null ? Number(form.basePrice) : null,
        status: (form.status as Vehicle["status"]) || "Available",
        description: form.description ?? "",
        imageUrl: form.imageUrl ?? "",
      };
      setList((prev) => (prev ? [draft, ...prev] : [draft]));
      try {
        const res = await api.post("/vehicles", draft);
        const realId = (res.data?.vehicleID as number) ?? tempId;
        setList((prev) =>
          prev ? prev.map((x) => (x.vehicleID === tempId ? { ...x, vehicleID: realId } : x)) : prev
        );
        onSaved();
        onClose();
      } catch {
        onSaved();
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Vehicle" : "New Vehicle"}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>{isEdit ? "Save changes" : "Create"}</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          placeholder="VIN"
          value={form.vin ?? ""}
          onChange={(e) => set("vin", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Year"
          value={form.year ?? 0}
          onChange={(e) => set("year", Number(e.target.value))}
        />
        <Input
          placeholder="Color"
          value={form.color ?? ""}
          onChange={(e) => set("color", e.target.value)}
        />
        <Input
          placeholder="Transmission"
          value={form.transmission ?? ""}
          onChange={(e) => set("transmission", e.target.value)}
        />
        <Input
          placeholder="Fuel Type"
          value={form.fuelType ?? ""}
          onChange={(e) => set("fuelType", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Mileage (km)"
          value={form.mileageKm ?? 0}
          onChange={(e) => set("mileageKm", Number(e.target.value))}
        />
        <Input
          type="number"
          placeholder="Base Price (€)"
          value={form.basePrice ?? ""}
          onChange={(e) =>
            set("basePrice", e.target.value === "" ? null : Number(e.target.value))
          }
        />
        <Input
          type="number"
          placeholder="Model ID"
          value={form.modelID ?? 0}
          onChange={(e) => set("modelID", Number(e.target.value))}
        />
        <div className="md:col-span-2">
          <Textarea
            placeholder="Description"
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Input
            placeholder="Image URL"
            value={form.imageUrl ?? ""}
            onChange={(e) => set("imageUrl", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={form.status ?? "Available"}
            onChange={(e) => set("status", e.target.value as Vehicle["status"])}
          >
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}

/* ===========================================================
   MODELS
=========================================================== */
function ModelsPanel() {
  const { data, setData, loading, error, reload } = useList<Model>("/models");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const list = data ?? [];
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (m) => m.name.toLowerCase().includes(s) || String(m.modelID).includes(s)
    );
  }, [data, q]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Model | null>(null);

  const startNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const startEdit = (m: Model) => {
    setEditing(m);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    const snapshot = data ?? [];
    setData((prev) => (prev ? prev.filter((x) => x.modelID !== id) : prev));
    try {
      await api.delete(`/models/${id}`);
    } catch {
      setData(snapshot);
    }
  };

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="mb-5 flex items-center gap-3">
          <Input
            className="max-w-sm"
            placeholder="Search models…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        <Button variant="outline" size="sm" onClick={reload}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={startNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Model
          </Button>
        </div>

        {loading && <div className="text-muted-foreground">Loading models…</div>}
        {error && <div className="text-destructive">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Brand ID</th>
                  <th className="py-2 pr-3">Body</th>
                  <th className="py-2 pr-3">Model Page</th>
                  <th className="py-2 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(filtered ?? []).map((m) => (
                  <tr key={m.modelID} className="border-b border-border/70">
                    <td className="py-2 pr-3">{m.modelID}</td>
                    <td className="py-2 pr-3 font-medium">{m.name}</td>
                    <td className="py-2 pr-3">{m.brandID}</td>
                    <td className="py-2 pr-3">{m.bodyType ?? "—"}</td>
                    <td className="py-2 pr-3">
                      {m.modelPageUrl ? (
                        <a
                          href={m.modelPageUrl}
                          className="text-luxury-gold hover:underline"
                          target="_blank"
                        >
                          Link
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-2 pl-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => startEdit(m)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(m.modelID)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No models found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <ModelModal
        open={open}
        onClose={() => setOpen(false)}
        editing={editing}
        onSaved={reload}
        setList={setData}
      />
    </Card>
  );
}

function ModelModal({
  open,
  onClose,
  editing,
  onSaved,
  setList,
}: {
  open: boolean;
  onClose: () => void;
  editing: Model | null;
  onSaved: () => void;
  setList: React.Dispatch<React.SetStateAction<Model[] | null>>;
}) {
  const isEdit = !!editing;
  const [form, setForm] = useState<Partial<Model>>(
    editing ?? {
      modelID: 0,
      brandID: 0,
      name: "",
      bodyType: "",
      modelPageUrl: "",
      featuresCsv: "",
    }
  );
  useEffect(() => {
    setForm(
      editing ?? {
        modelID: 0,
        brandID: 0,
        name: "",
        bodyType: "",
        modelPageUrl: "",
        featuresCsv: "",
      }
    );
  }, [editing]);
  const set = <K extends keyof Model>(k: K, v: Model[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    if (isEdit) {
      setList((prev) =>
        prev
          ? prev.map((x) =>
              x.modelID === editing!.modelID
                ? ({ ...x, ...form, modelID: editing!.modelID } as Model)
                : x
            )
          : prev
      );
      try {
        await api.put(`/models/${editing!.modelID}`, { ...editing, ...form });
        onSaved();
        onClose();
      } catch {
        onSaved();
      }
    } else {
      const tempId = Math.floor(Math.random() * 1e9);
      const draft: Model = {
        modelID: tempId,
        brandID: Number(form.brandID) || 0,
        name: form.name || "",
        bodyType: form.bodyType ?? "",
        modelPageUrl: form.modelPageUrl ?? "",
        featuresCsv: form.featuresCsv ?? "",
      };
      setList((p) => (p ? [draft, ...p] : [draft]));
      try {
        const res = await api.post("/models", draft);
        const realId = (res.data?.modelID as number) ?? tempId;
        setList((p) =>
          p ? p.map((x) => (x.modelID === tempId ? { ...x, modelID: realId } : x)) : p
        );
        onSaved();
        onClose();
      } catch {
        onSaved();
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Model" : "New Model"}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>{isEdit ? "Save changes" : "Create"}</Button>
        </>
      }
    >
      <div className="grid gap-3">
        <Input
          placeholder="Name"
          value={form.name ?? ""}
          onChange={(e) => set("name", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Brand ID"
          value={form.brandID ?? 0}
          onChange={(e) => set("brandID", Number(e.target.value))}
        />
        <Input
          placeholder="Body Type"
          value={form.bodyType ?? ""}
          onChange={(e) => set("bodyType", e.target.value)}
        />
        <Input
          placeholder="Model Page URL"
          value={form.modelPageUrl ?? ""}
          onChange={(e) => set("modelPageUrl", e.target.value)}
        />
        <Textarea
          placeholder="Features CSV"
          value={form.featuresCsv ?? ""}
          onChange={(e) => set("featuresCsv", e.target.value)}
        />
      </div>
    </Modal>
  );
}


/* ===========================================================
   BRANDS
=========================================================== */
function BrandsPanel() {
  const { data, setData, loading, error, reload } = useList<Brand>("/brands");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const list = data ?? [];
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (b) => b.name.toLowerCase().includes(s) || String(b.brandID).includes(s)
    );
  }, [data, q]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);

  const startNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const startEdit = (b: Brand) => {
    setEditing(b);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    const snapshot = data ?? [];
    setData((prev) => (prev ? prev.filter((x) => x.brandID !== id) : prev));
    try {
      await api.delete(`/brands/${id}`);
    } catch {
      setData(snapshot);
    }
  };

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="mb-5 flex items-center gap-3">
          <Input
            className="max-w-sm"
            placeholder="Search brands…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button variant="outline" size="sm" onClick={reload}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={startNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Brand
          </Button>
        </div>

        {loading && (
          <div className="text-muted-foreground">Loading brands…</div>
        )}
        {error && <div className="text-destructive">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Country</th>
                  <th className="py-2 pr-3">Website</th>
                  <th className="py-2 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(filtered ?? []).map((b) => (
                  <tr key={b.brandID} className="border-b border-border/70">
                    <td className="py-2 pr-3">{b.brandID}</td>
                    <td className="py-2 pr-3 font-medium">{b.name}</td>
                    <td className="py-2 pr-3">{b.country ?? "—"}</td>
                    <td className="py-2 pr-3">
                      {b.website ? (
                        <a
                          className="text-luxury-gold hover:underline"
                          href={b.website}
                          target="_blank"
                        >
                          Link
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-2 pl-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => startEdit(b)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(b.brandID)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No brands found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <BrandModal
        open={open}
        onClose={() => setOpen(false)}
        editing={editing}
        onSaved={reload}
        setList={setData}
      />
    </Card>
  );
}

function BrandModal({
  open,
  onClose,
  editing,
  onSaved,
  setList,
}: {
  open: boolean;
  onClose: () => void;
  editing: Brand | null;
  onSaved: () => void;
  setList: React.Dispatch<React.SetStateAction<Brand[] | null>>;
}) {
  const isEdit = !!editing;
  const [form, setForm] = useState<Partial<Brand>>(
    editing ?? { brandID: 0, name: "", country: "", website: "" }
  );
  useEffect(() => {
    setForm(editing ?? { brandID: 0, name: "", country: "", website: "" });
  }, [editing]);
  const set = <K extends keyof Brand>(k: K, v: Brand[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    if (isEdit) {
      setList((prev) =>
        prev
          ? prev.map((x) =>
              x.brandID === editing!.brandID
                ? ({ ...x, ...form, brandID: editing!.brandID } as Brand)
                : x
            )
          : prev
      );
      try {
        await api.put(`/brands/${editing!.brandID}`, { ...editing, ...form });
        onSaved();
        onClose();
      } catch {
        onSaved();
      }
    } else {
      const tempId = Math.floor(Math.random() * 1e9);
      const draft: Brand = {
        brandID: tempId,
        name: form.name || "",
        country: form.country ?? "",
        website: form.website ?? "",
      };
      setList((p) => (p ? [draft, ...p] : [draft]));
      try {
        const res = await api.post("/brands", draft);
        const realId = (res.data?.brandID as number) ?? tempId;
        setList((p) =>
          p ? p.map((x) => (x.brandID === tempId ? { ...x, brandID: realId } : x)) : p
        );
        onSaved();
        onClose();
      } catch {
        onSaved();
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Brand" : "New Brand"}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>{isEdit ? "Save changes" : "Create"}</Button>
        </>
      }
    >
      <div className="grid gap-3">
        <Input
          placeholder="Name"
          value={form.name ?? ""}
          onChange={(e) => set("name", e.target.value)}
        />
        <Input
          placeholder="Country"
          value={form.country ?? ""}
          onChange={(e) => set("country", e.target.value)}
        />
        <Input
          placeholder="Website"
          value={form.website ?? ""}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>
    </Modal>
  );
}

/* ===========================================================
   USERS  (uses /auth/admin/users*)
   kom: CRUD komplet + paging + search server-side
=========================================================== */

type AdminListUsersResponse = {
  page: number;
  pageSize: number;
  total: number;
  items: Array<{
    id: number;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
  }>;
};

function UsersPanel() {
  // kom: paging + search (server-side nga AuthController)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AppUser[]>([]);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<AdminListUsersResponse>(
        `/auth/admin/users?page=${page}&pageSize=${pageSize}&q=${encodeURIComponent(
          q
        )}`
      );
      const mapped: AppUser[] = res.data.items.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
        username: null,
        fullName: null,
        locked: false,
      }));
      setRows(mapped);
      setTotal(res.data.total);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]); // q triggohet me Search

  // Modal state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);

  const startNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const startEdit = (u: AppUser) => {
    setEditing(u);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    const snapshot = rows;
    setRows((prev) => prev.filter((x) => x.id !== id));
    try {
      await api.delete(`/auth/admin/users/${id}`);
      // nese zbrazen rreshtat e faqes aktuale, shko nje faqe mbrapa
      if (total - 1 <= (page - 1) * pageSize && page > 1) {
        setPage(page - 1);
      } else {
        void load();
      }
    } catch {
      setRows(snapshot);
    }
  };

  const toggleRole = async (user: AppUser) => {
    const next: UserRole = user.role === "Admin" ? "User" : "Admin";
    const snapshot = rows;
    setRows((prev) => prev.map((x) => (x.id === user.id ? { ...x, role: next } : x)));
    try {
      await api.put(`/auth/admin/users/${user.id}`, { Role: next });
    } catch {
      setRows(snapshot);
    }
  };

  const toggleActive = async (user: AppUser) => {
    const next = !user.isActive;
    const snapshot = rows;
    setRows((prev) => prev.map((x) => (x.id === user.id ? { ...x, isActive: next } : x)));
    try {
      await api.put(`/auth/admin/users/${user.id}`, { IsActive: next });
    } catch {
      setRows(snapshot);
    }
  };

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        {/* Filter bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Input
            className="max-w-sm"
            placeholder="Search email / role…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPage(1);
              void load();
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button size="sm" onClick={startNew}>
            <Plus className="w-4 h-4 mr-2" />
            New User
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows:</span>
            <select
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {loading && <div className="text-muted-foreground">Loading users…</div>}
        {error && <div className="text-destructive">{error}</div>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-2 pr-3">ID</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Role</th>
                    <th className="py-2 pr-3">Active</th>
                    <th className="py-2 pr-3">Created</th>
                    <th className="py-2 pr-0 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((u) => (
                    <tr key={u.id} className="border-b border-border/70">
                      <td className="py-2 pr-3">{u.id}</td>
                      <td className="py-2 pr-3 font-mono">{u.email}</td>
                      <td className="py-2 pr-3">
                        <Badge variant={u.role === "Admin" ? "default" : "outline"}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-2 pr-3">
                        {u.isActive ? (
                          <span className="text-green-500">Yes</span>
                        ) : (
                          <span className="text-destructive">No</span>
                        )}
                      </td>
                      <td className="py-2 pr-3">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 pl-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            title={u.role === "Admin" ? "Make User" : "Make Admin"}
                            onClick={() => toggleRole(u)}
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            title={u.isActive ? "Deactivate" : "Activate"}
                            onClick={() => toggleActive(u)}
                          >
                            {u.isActive ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => startEdit(u)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(u.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pager */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Page {page} / {totalPages} • {total.toLocaleString()} users
              </span>
              <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                  Prev
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <UserModal
        open={open}
        onClose={() => setOpen(false)}
        editing={editing}
        onSaved={() => void load()}
      />
    </Card>
  );
}

function UserModal({
  open,
  onClose,
  editing,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  editing: AppUser | null;
  onSaved: () => void;
}) {
  const isEdit = !!editing;

  // kom: Create kerkon Password; Edit ka NewPassword opsional
  const [email, setEmail] = useState(editing?.email ?? "");
  const [username, setUsername] = useState(editing?.username ?? "");
  const [fullName, setFullName] = useState(editing?.fullName ?? "");
  const [role, setRole] = useState<UserRole>(editing?.role ?? "User");
  const [isActive, setIsActive] = useState<boolean>(editing?.isActive ?? true);
  const [password, setPassword] = useState(""); // create
  const [newPassword, setNewPassword] = useState(""); // edit

  useEffect(() => {
    setEmail(editing?.email ?? "");
    setUsername(editing?.username ?? "");
    setFullName(editing?.fullName ?? "");
    setRole(editing?.role ?? "User");
    setIsActive(editing?.isActive ?? true);
    setPassword("");
    setNewPassword("");
  }, [editing, open]);

  const save = async () => {
    try {
      if (isEdit) {
        // AdminUpdateUserDto
        const payload: Record<string, unknown> = {
          Email: email || undefined,
          Username: username || undefined,
          FullName: fullName || undefined,
          Role: role || undefined,
          IsActive: isActive,
        };
        if (newPassword.trim()) payload.NewPassword = newPassword.trim();
        await api.put(`/auth/admin/users/${editing!.id}`, payload);
      } else {
        // AdminCreateUserDto
        await api.post(`/auth/admin/users`, {
          Email: email,
          Password: password,
          Username: username || email.split("@")[0],
          FullName: fullName || null,
          MarketingOptIn: false,
          Role: role,
          IsActive: isActive,
        });
      }
      onSaved();
      onClose();
    } catch {
      // kom: mund te shtojme toast me vone
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit User" : "New User"}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>{isEdit ? "Save changes" : "Create"}</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        <Input
          placeholder="Username"
          value={username ?? ""}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Full Name"
          value={fullName ?? ""}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={!!isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span>Active</span>
        </label>

        {!isEdit ? (
          <div className="md:col-span-2">
            {/* kom: per krijim duhet password */}
            <Input
              type="password"
              placeholder="Password (required)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        ) : (
          <div className="md:col-span-2">
            {/* kom: per edit, fjalekalimi eshte opsional */}
            <Input
              type="password"
              placeholder="New password (optional)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
