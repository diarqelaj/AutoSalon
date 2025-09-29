// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-serif font-bold">About LuxeRide</h1>
      <p className="mt-4 text-muted-foreground max-w-3xl">
        We curate modern luxury & performance vehicles with transparent pricing and a no-pressure experience.
        {/* kom: filozofi e thjeshte, pa marketing te tepert */}
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { title: "Curation", desc: "Every car hand-picked and multi-point inspected." },
          { title: "Clarity", desc: "Clear pricing. No hidden fees. Ever." },
          { title: "Care", desc: "Personal advisors and fast test-drive scheduling." },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border border-border p-6 bg-card">
            <div className="text-lg font-semibold">{c.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
