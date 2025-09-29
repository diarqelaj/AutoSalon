// src/components/Hero.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import {
  Car,
  Shield,
  Award,
  Banknote,
  CheckCircle2,
  Search,
  SlidersHorizontal,
} from "lucide-react";

type ApiBrand = { brandID: number; name: string };


const ANY = "__any";


const norm = (s: string) => s.toLowerCase().replace(/[\s\-_.]/g, "");
const WHITELIST = new Set(["bmw", "audi", "mercedesbenz", "porsche", "tesla"]);

const Hero = () => {
  const router = useRouter();

  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);


  const [brand, setBrand] = useState<string>(ANY);
  const [body, setBody] = useState<string>(ANY);
  const [budgetMax, setBudgetMax] = useState<string>("");
  const [yearMin, setYearMin] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const [bRes, btRes] = await Promise.all([
          api.get<ApiBrand[]>("/brands"),
          api.get<string[]>("/models/bodytypes"),
        ]);

        if (!alive) return;
        setBrands(bRes.data ?? []);
        const list = (btRes.data ?? []).filter((s) => !!s && s.trim() !== "");
        setBodyTypes(
          list.length ? list : ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon"]
        );
      } catch {
        if (!alive) return;
        setErr("Failed to load brands or body types.");
        setBodyTypes(["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon"]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

 
  const whitelistedBadges = useMemo(
    () =>
      [...brands]
        .filter((b) => WHITELIST.has(norm(b.name)))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((b) => b.name)
        .slice(0, 5),
    [brands]
  );

  const topFiveBadges = useMemo(
    () =>
      [...brands]
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 5)
        .map((b) => b.name),
    [brands]
  );

  const badgesToShow = whitelistedBadges.length ? whitelistedBadges : topFiveBadges;

  const doSearch = () => {
    const qs = new URLSearchParams();
    if (brand !== ANY) qs.set("brand", brand);
    if (body !== ANY) qs.set("body", body);
    if (budgetMax) qs.set("maxPrice", budgetMax);
    if (yearMin) qs.set("minYear", yearMin);
    router.push(`/pricing?${qs.toString()}`);
  };

  return (
    <section className="min-h-[86vh] relative flex items-center justify-center overflow-hidden">
      <Image
        src="/hero-luxury-car.jpg"
        alt=""
        fill
        priority
        className="object-cover -z-10 opacity-25"
      />

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl">
          {/* Brand badges / trust strip */}
          <div className="flex flex-wrap gap-3 mb-6 md:mb-8">
            {loading && <div className="text-sm text-muted-foreground">Loading brands…</div>}
            {err && <div className="text-sm text-destructive">{err}</div>}
            {!loading &&
              !err &&
              badgesToShow.map((name) => (
                <div
                  key={name}
                  className="bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border"
                >
                  <span className="text-sm text-luxury-gray">{name}</span>
                </div>
              ))}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-3 md:mb-4">
            Find your next{" "}
            <span className="bg-gradient-luxury bg-clip-text text-transparent">luxury car</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-brand-gray max-w-2xl mb-6 md:mb-8">
            Shop our curated inventory, book a test drive, and secure flexible financing — all with
            concierge care.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-5 mb-8 md:mb-12">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-white" />
              <span className="text-sm">Verified history</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-white" />
              <span className="text-sm">Premium selection</span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-brand-white" />
              <span className="text-sm">Transparent pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-white" />
              <span className="text-sm">Warranty options</span>
            </div>
          </div>

          {/* Inventory Search Widget */}
          <div className="bg-card/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl border border-brand-charcoal shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-5 h-5 text-brand-gray" />
              <h3 className="text-lg sm:text-xl font-serif font-semibold">Search in-stock vehicles</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {/* Brand */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="bg-background border-brand-charcoal focus:border-brand-white">
                    <Car className="w-4 h-4 mr-2 text-brand-gray" />
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>Any</SelectItem>
                    {brands.map((b) => (
                      <SelectItem key={b.brandID} value={b.name}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Body Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Body type</label>
                <Select value={body} onValueChange={setBody}>
                  <SelectTrigger className="bg-background border-brand-charcoal focus:border-brand-white">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>Any</SelectItem>
                    {bodyTypes.map((bt) => (
                      <SelectItem key={bt} value={bt}>
                        {bt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget (max) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget (max €)</label>
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 45000"
                  className="bg-background border-brand-charcoal focus:border-brand-white"
                  value={budgetMax}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D+/g, "");
                    setBudgetMax(val);
                  }}
                />
              </div>

              {/* Year (min) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Year (min)</label>
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 2019"
                  className="bg-background border-brand-charcoal focus:border-brand-white"
                  value={yearMin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D+/g, "");
                    setYearMin(val);
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                className="flex-1 bg-gradient-luxury text-brand-dark font-semibold hover:shadow-glow transition-all"
                onClick={doSearch}
              >
                <Search className="w-4 h-4 mr-2" />
                Search inventory
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark"
                onClick={() => router.push("/test-drive")}
              >
                Book a test drive
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
