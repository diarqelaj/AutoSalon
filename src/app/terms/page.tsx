// src/app/terms/page.tsx
export default function TermsPage() {
  const lastUpdated = "September 29, 2025";

  return (
    <section className="container mx-auto px-4 py-20 max-w-4xl">
      {/* Hero */}
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Terms of Service</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Using our website or purchasing a vehicle from us means you accept these terms. Please read them carefully.
        </p>
        <div className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</div>
      </header>

      {/* Quick summary */}
      <div className="grid gap-4 md:grid-cols-3 mb-12">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">Transparent Inventory</div>
          <p className="mt-2 text-sm text-muted-foreground">We strive for accuracy; occasional errors may occur.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">No Offer Until Signed</div>
          <p className="mt-2 text-sm text-muted-foreground">A sale is final only once the purchase agreement is signed.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">Fair Use</div>
          <p className="mt-2 text-sm text-muted-foreground">Don’t misuse the site, data, or trademarks.</p>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 id="site-use">1. Website use</h2>
        <p>
          The content on this site is provided for general information and to help you browse inventory and request
          services. We may update, suspend, or remove content at any time.
        </p>

        <h2 id="inventory">2. Inventory, pricing, and availability</h2>
        <ul>
          <li>We aim for accuracy, but specifications, pricing, and availability may change without notice.</li>
          <li>Listing a vehicle online is not a binding offer to sell.</li>
          <li>
            If we discover a pricing or specification error after you submit interest, we’ll contact you to confirm next
            steps before proceeding.
          </li>
        </ul>

        <h2 id="orders">3. Orders, deposits, and payment</h2>
        <ul>
          <li>
            A vehicle purchase becomes binding only when both parties sign the purchase agreement (and any required
            disclosures).
          </li>
          <li>Deposits (if any) and payment schedules are described in your purchase agreement.</li>
          <li>Taxes, registration, and other fees may apply and are your responsibility unless stated otherwise.</li>
        </ul>

        <h2 id="trade-in">4. Trade-in appraisals</h2>
        <p>
          Trade-in values depend on accurate information and inspection. We may revise an initial estimate if condition
          or records differ from the information provided.
        </p>

        <h2 id="financing">5. Financing</h2>
        <p>
          Third-party lenders may offer financing options subject to their terms and approval criteria. We are not a
          lender and do not guarantee approval or specific rates.
        </p>

        <h2 id="delivery">6. Delivery, title, and risk</h2>
        <p>
          Title and risk of loss pass as described in your purchase agreement or delivery note. Please review those
          documents carefully.
        </p>

        <h2 id="inspection">7. Inspection and test drive</h2>
        <p>
          You should inspect and/or test drive the vehicle prior to purchase. Let us know of any concerns so we can
          address them before you sign.
        </p>

        <h2 id="warranty">8. Warranties and returns</h2>
        <ul>
          <li>
            Manufacturer warranties (if applicable) are provided by the manufacturer and are subject to their terms.
          </li>
          <li>
            Any dealership warranties or service plans will be stated explicitly in your purchase paperwork.
          </li>
          <li>Unless stated otherwise, vehicles are sold “as-is” to the extent permitted by law.</li>
        </ul>

        <h2 id="liability">9. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, we shall not be liable for indirect, incidental, special, or
          consequential damages arising from your use of the site or the purchase process. Our total liability is
          limited to the amount you paid directly to us for the specific service at issue.
        </p>

        <h2 id="acceptable-use">10. Acceptable use</h2>
        <ul>
          <li>No scraping, bulk data extraction, or reverse engineering.</li>
          <li>No attempts to bypass security or disrupt service.</li>
          <li>No misuse of trademarks, content, or confidential information.</li>
        </ul>

        <h2 id="intellectual">11. Intellectual property</h2>
        <p>
          All trademarks, logos, and content on this site are owned by us or licensed to us. You may not use them
          without prior written permission.
        </p>

        <h2 id="third-party">12. Third-party links</h2>
        <p>
          We may link to third-party websites or services; we’re not responsible for their content, terms, or privacy
          practices.
        </p>

        <h2 id="changes">13. Changes to these terms</h2>
        <p>
          We may update these terms from time to time. When we do, we’ll change the “Last updated” date above. If
          changes are material, we may provide additional notice.
        </p>

        <h2 id="law">14. Governing law</h2>
        <p>
          These terms are governed by the laws applicable at our principal place of business, without regard to conflict
          of laws rules. Local mandatory consumer protections still apply.
        </p>

        <h2 id="contact">15. Contact</h2>
        <p>
          Questions? Email <a href="mailto:support@luxeride.com">support@luxeride.com</a>.
        </p>
      </div>
    </section>
  );
}
