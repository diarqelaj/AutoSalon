// src/app/privacy/page.tsx
export default function PrivacyPage() {
  const lastUpdated = "September 29, 2025";

  return (
    <section className="container mx-auto px-4 py-20 max-w-4xl">
      {/* Hero */}
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Privacy Policy</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          We keep your data minimal, secure, and under your control. This page explains what we collect, why,
          and how you can exercise your rights.
        </p>
        <div className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</div>
      </header>

      {/* Highlights */}
      <div className="grid gap-4 md:grid-cols-3 mb-12">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">Minimal Collection</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Only data we need to respond, schedule test drives, and complete purchases.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">No Data Sales</div>
          <p className="mt-2 text-sm text-muted-foreground">
            We never sell your personal data. Full stop.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">Your Rights</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Access, correct, delete, export—just ask. We’ll help fast.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <h2 id="who-we-are">Who we are</h2>
        <p>
          LuxeRide (“we”, “us”) is a vehicle dealership and services provider. If you have questions about this
          policy, email <a href="mailto:privacy@luxeride.com">privacy@luxeride.com</a>.
        </p>

        <h2 id="what-we-collect">What we collect</h2>
        <ul>
          <li>
            <strong>Contact details</strong> – name, email, phone; for inquiries, test drives, and purchase flow.
          </li>
          <li>
            <strong>Vehicle interests</strong> – models you view, wishlists, messages you send.
          </li>
          <li>
            <strong>Order & billing info</strong> – address, invoice details (only if you proceed with a purchase).
          </li>
          <li>
            <strong>Technical data</strong> – basic logs (IP, user agent) for security and fraud prevention.
          </li>
          <li>
            <strong>Cookies</strong> – strictly necessary cookies for session & preferences; optional analytics if
            enabled (see “Cookies & Analytics”).
          </li>
        </ul>

        <h2 id="how-we-use">How we use your data (purposes & legal bases)</h2>
        <ul>
          <li>
            <strong>Responding to you</strong> (legitimate interests/contract): answering questions, booking test drives,
            sending quotes.
          </li>
          <li>
            <strong>Sales processing</strong> (contract/legal obligation): preparing offers, invoices, warranty or
            registration paperwork.
          </li>
          <li>
            <strong>Security & fraud</strong> (legitimate interests/legal obligation): protecting our site and users.
          </li>
          <li>
            <strong>Optional updates</strong> (consent): if you opt-in to hear about new inventory or offers.
          </li>
        </ul>

        <h2 id="sharing">Sharing & third parties</h2>
        <p>
          We share data only with service providers that help us run the business (e.g., secure hosting, payments,
          messaging, logistics). They process data under contracts and can’t use it for their own purposes. If required
          by law, we may share information with authorities.
        </p>

        <h2 id="retention">Retention</h2>
        <p>
          We keep data only as long as needed for the purposes above, then either anonymize or delete it. For purchases,
          some documents must be retained for legal, tax, or warranty reasons.
        </p>

        <h2 id="international">International transfers</h2>
        <p>
          If data leaves your country, we use lawful mechanisms (e.g., SCCs / equivalent) and vendors with strong
          security standards.
        </p>

        <h2 id="cookies">Cookies & analytics</h2>
        <ul>
          <li>
            <strong>Strictly necessary</strong>: login session, CSRF protection, preferences.
          </li>
          <li>
            <strong>Analytics (optional)</strong>: if enabled, we use privacy-respecting analytics to improve the site
            (no data sale; IPs truncated or anonymized where possible). You can opt out via cookie banner/settings when
            available.
          </li>
        </ul>

        <h2 id="your-rights">Your rights</h2>
        <p>
          Depending on your location (e.g., GDPR in the EU), you may have the right to access, rectify, delete, restrict,
          object to processing, or export your data. You can also withdraw consent at any time for processing that relies
          on consent.
        </p>
        <p>
          To exercise rights, email <a href="mailto:privacy@luxeride.com">privacy@luxeride.com</a>. We’ll respond
          promptly.
        </p>

        <h2 id="security">Security</h2>
        <p>
          We use encryption in transit, access controls, audits, and least-privilege practices. No system is perfect,
          but we work to keep risks low and respond quickly.
        </p>

        <h2 id="children">Children</h2>
        <p>
          Our services are not directed to children under 16. If you believe a child provided us data, contact us and we
          will delete it.
        </p>

        <h2 id="changes">Changes to this policy</h2>
        <p>
          If we make material changes, we’ll update this page and adjust the “Last updated” date. If the changes are
          significant, we’ll provide additional notice.
        </p>

        <h2 id="contact">Contact</h2>
        <p>
          Questions or requests? Email <a href="mailto:privacy@luxeride.com">privacy@luxeride.com</a>.
        </p>
      </div>
    </section>
  );
}
