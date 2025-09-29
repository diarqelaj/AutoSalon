// src/app/test-drive/page.tsx
export default function TestDrivePage() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-serif font-bold">Book a Test Drive</h1>
      <p className="mt-4 text-muted-foreground max-w-3xl">
        Pick a car, date, and time — we’ll confirm by SMS or WhatsApp. {/* kom: thjesht, pa forma te gjata */}
      </p>

      <div className="mt-8 rounded-xl border border-border p-6 bg-card">
        <form className="grid gap-4 md:grid-cols-2">
          <input className="rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Full name" />
          <input className="rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Phone" />
          <input className="rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Vehicle (e.g. BMW 3 Series)" />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input type="time" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <textarea
            className="md:col-span-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Anything we should know?"
            rows={4}
          />
          <button className="md:col-span-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">
            Request Slot
          </button>
        </form>
      </div>
    </section>
  );
}
