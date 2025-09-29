// src/app/financing/page.tsx
export default function FinancingPage() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-serif font-bold">Financing</h1>
      <p className="mt-4 text-muted-foreground max-w-3xl">
        Multiple lenders, competitive APRs, and quick approvals. Start pre-approval online and speed up your purchase.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { t: "Pre-Approval", d: "2–5 minutes. Soft check where supported." },
          { t: "Flexible Terms", d: "Choose term & down payment that fits." },
          { t: "Trade-In Credit", d: "Apply value instantly to your deal." },
        ].map((x) => (
          <div key={x.t} className="rounded-xl border border-border p-6 bg-card">
            <div className="font-semibold">{x.t}</div>
            <div className="text-sm text-muted-foreground mt-2">{x.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
