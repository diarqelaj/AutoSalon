// src/app/warranty/page.tsx
export default function WarrantyPage() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-serif font-bold">Warranty & Protection</h1>
      <p className="mt-4 text-muted-foreground max-w-3xl">
        Every car is multi-point inspected. Extended coverage & service plans available for extra peace of mind.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="font-semibold">Included</div>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Comprehensive inspection</li>
            <li>Verified history</li>
            <li>30-day defect guarantee (where applicable)</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="font-semibold">Optional Plans</div>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Extended powertrain & electronics</li>
            <li>Wheel & tire protection</li>
            <li>GAP coverage</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
