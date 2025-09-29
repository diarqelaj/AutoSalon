// src/app/careers/page.tsx
export default function CareersPage() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-serif font-bold">Careers</h1>
      <p className="mt-4 text-muted-foreground max-w-3xl">
        Join a small team obsessed with customer experience. We move fast, keep promises, and love cars.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[
          { role: "Sales Advisor", tag: "Full-time • NYC" },
          { role: "Detailing Specialist", tag: "Full-time • NYC" },
        ].map((j) => (
          <div key={j.role} className="rounded-xl border border-border p-6 bg-card">
            <div className="font-semibold">{j.role}</div>
            <div className="text-xs text-muted-foreground mt-1">{j.tag}</div>
            <p className="text-sm text-muted-foreground mt-3">
              Help clients find the right car with clarity and zero pressure.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
