import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — The Dexarium",
  description: "Terms and conditions for purchasing from The Dexarium.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs tracking-wider font-body mb-8" style={{ color: "var(--muted)" }}>
          <Link href="/" style={{ color: "var(--muted)" }}>HOME</Link>
          <span style={{ color: "var(--border)" }}>›</span>
          <span style={{ color: "var(--text)" }}>TERMS OF SERVICE</span>
        </div>

        <h1 className="font-heading text-3xl mb-2" style={{ color: "var(--text)" }}>TERMS OF SERVICE</h1>
        <p className="font-body text-xs tracking-wider mb-10" style={{ color: "var(--muted)" }}>Last updated: June 2025</p>

        <div className="space-y-8 font-body text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>1. ABOUT US</h2>
            <p>The Dexarium is operated by Yarik Hanjsraj, a South African independent 3D printing studio specialising in resin and FDM miniatures for wargaming and collecting. All products are manufactured to order in South Africa.</p>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>2. ORDERS & PAYMENT</h2>
            <p className="mb-3">All prices are in South African Rand (ZAR). Payment is processed securely via Yoco. By placing an order you confirm that you are at least 18 years old or have parental consent.</p>
            <p>We reserve the right to cancel any order at our discretion. If cancelled after payment, a full refund will be issued within 5–7 business days.</p>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>3. PRODUCTION & DELIVERY</h2>
            <p className="mb-3">All products are printed to order. Standard production time is 5–10 business days. Preorder items may take longer; estimated availability is shown on the product page.</p>
            <p>Delivery is via courier within South Africa. The Dexarium is not responsible for delays caused by couriers or circumstances beyond our control.</p>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>4. RETURNS & REFUNDS</h2>
            <p className="mb-3">Due to the custom nature of our products, we do not accept returns unless the item arrives damaged or defective. If you receive a damaged item, please contact us within 7 days with photos and we will arrange a replacement or refund.</p>
            <p>Preorder deposits are non-refundable once production has begun.</p>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>5. INTELLECTUAL PROPERTY</h2>
            <p>All original designs and 3D models created by The Dexarium are our intellectual property. Commercial reproduction without written permission is prohibited.</p>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>6. LIMITATION OF LIABILITY</h2>
            <p>To the maximum extent permitted by law, The Dexarium&apos;s total liability shall not exceed the amount paid for the relevant order.</p>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>7. GOVERNING LAW</h2>
            <p>These terms are governed by the laws of the Republic of South Africa.</p>
          </section>
          <section>
            <h2 className="font-heading text-base tracking-wider mb-3" style={{ color: "var(--primary)" }}>8. CONTACT</h2>
            <p>For questions, please <Link href="/contact" style={{ color: "var(--primary)" }} className="hover:underline">contact us</Link>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
          <Link href="/privacy" className="font-body text-xs tracking-wider" style={{ color: "var(--muted)" }}>View Privacy Policy →</Link>
        </div>
      </div>
    </div>
  );
}
