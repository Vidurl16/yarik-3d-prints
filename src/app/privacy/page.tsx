import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — The Dexarium",
  description: "How The Dexarium collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs tracking-wider font-body mb-8" style={{ color: "var(--muted)" }}>
          <Link href="/" style={{ color: "var(--muted)" }}>HOME</Link>
          <span style={{ color: "var(--border)" }}>›</span>
          <span style={{ color: "var(--text)" }}>PRIVACY POLICY</span>
        </div>

        <h1 className="font-heading text-3xl mb-2" style={{ color: "var(--text)" }}>PRIVACY POLICY</h1>
        <p className="font-body text-xs tracking-wider mb-10" style={{ color: "var(--muted)" }}>Last updated: June 2025</p>

        <div className="space-y-8 font-body text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>1. WHO WE ARE</h2>
            <p>The Dexarium is operated by Yarik Hanjsraj. This policy explains how we handle personal information in compliance with South Africa&apos;s Protection of Personal Information Act (POPIA).</p>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>2. INFORMATION WE COLLECT</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Account information:</strong> Email address and password (hashed) when you create an account.</li>
              <li><strong>Order information:</strong> Name, email, shipping address, and order contents when you place an order.</li>
              <li><strong>Payment information:</strong> Processed entirely by Yoco. We do not store card details.</li>
              <li><strong>Usage data:</strong> Standard server logs including IP address and browser type.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>3. HOW WE USE YOUR INFORMATION</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To process and fulfil your orders.</li>
              <li>To send order confirmations and shipping notifications.</li>
              <li>To respond to your enquiries and provide customer support.</li>
              <li>To improve our website and services.</li>
            </ul>
            <p className="mt-3">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>4. THIRD-PARTY SERVICES</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Supabase</strong> — authentication and database.</li>
              <li><strong>Yoco</strong> — payment processing (PCI-DSS compliant, South Africa).</li>
              <li><strong>Vercel</strong> — website hosting.</li>
              <li><strong>Resend</strong> — transactional email delivery.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>5. DATA RETENTION</h2>
            <p>Order records are retained for 5 years for accounting and legal compliance. Account data is retained until you request deletion. You may request deletion at any time by contacting us.</p>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>6. YOUR RIGHTS (POPIA)</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your information.</li>
              <li>Object to the processing of your information.</li>
              <li>Lodge a complaint with the Information Regulator of South Africa.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>7. COOKIES</h2>
            <p>We use essential cookies only — for authentication sessions and cart state. We do not use advertising or tracking cookies.</p>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>8. CONTACT</h2>
            <p>For privacy-related requests, please <Link href="/contact" style={{ color: "var(--primary)" }} className="hover:underline">contact us</Link>. We will respond within 10 business days.</p>
          </section>
        </div>

        <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
          <Link href="/terms" className="font-body text-xs tracking-wider" style={{ color: "var(--muted)" }}>View Terms of Service →</Link>
        </div>
      </div>
    </div>
  );
}
