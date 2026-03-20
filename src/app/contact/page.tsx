import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — The Dexarium",
  description: "Get in touch for custom orders, preorders, or any questions.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-2 text-[10px] tracking-widest font-body mb-8" style={{ color: "var(--muted)" }}>
          <Link href="/" className="transition-colors" style={{ color: "var(--muted)" }}>HOME</Link>
          <span style={{ color: "var(--border)" }}>›</span>
          <span style={{ color: "var(--text)", opacity: 0.5 }}>CONTACT</span>
        </div>

        <div
          className="h-px mb-8"
          style={{ background: "linear-gradient(90deg, transparent, var(--primary), transparent)", opacity: 0.4 }}
        />

        <p className="font-body text-[10px] tracking-[0.3em] mb-3 uppercase" style={{ color: "var(--primary)", opacity: 0.7 }}>
          Get in Touch
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl mb-4" style={{ color: "var(--text)" }}>CONTACT</h1>
        <p className="font-body text-sm max-w-md leading-relaxed" style={{ color: "var(--muted)" }}>
          Custom orders, preorder inquiries, STL commissions, or just want to chat about minis — we&apos;re here.
        </p>
      </div>

      {/* Contact Options */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {[
            {
              icon: "📧",
              label: "EMAIL",
              value: "hello@yarik3d.co.za",
              sub: "Replies within 24 hours",
              href: "mailto:hello@yarik3d.co.za",
            },
            {
              icon: "💬",
              label: "WHATSAPP",
              value: "+27 73 914 0709",
              sub: "Mon–Sat, 9am–6pm SAST",
              href: "https://wa.me/27739140709",
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-6 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-body text-[10px] tracking-[0.3em] mb-1" style={{ color: "var(--primary)", opacity: 0.7 }}>{item.label}</p>
                <p className="font-heading text-base transition-colors" style={{ color: "var(--text)" }}>
                  {item.value}
                </p>
                <p className="font-body text-xs mt-1" style={{ color: "var(--muted)" }}>{item.sub}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Enquiry Types */}
        <div
          className="p-8 mb-12"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h2 className="font-heading text-lg tracking-widest mb-6" style={{ color: "var(--primary)" }}>COMMON ENQUIRIES</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Custom Prints", desc: "Got an STL? We'll quote it." },
              { label: "Preorders", desc: "Reserve upcoming releases." },
              { label: "Bulk Orders", desc: "10+ units — ask about discounts." },
              { label: "Commission Work", desc: "Custom sculpts & painted minis." },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 p-4"
                style={{ border: "1px solid var(--border)" }}
              >
                <span style={{ color: "var(--primary)" }} className="mt-0.5">→</span>
                <div>
                  <p className="font-body text-sm font-semibold" style={{ color: "var(--text)" }}>{item.label}</p>
                  <p className="font-body text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-12">
          <ContactForm />
        </div>

        {/* Army Builder CTA */}
        <div className="text-center">
          <p className="font-body text-sm mb-4" style={{ color: "var(--muted)" }}>
            Want to build a custom army order? Use our builder for an instant quote.
          </p>
          <Link
            href="/builder"
            className="font-body text-xs tracking-[0.2em] px-8 py-3 transition-all duration-200 inline-block"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            GO TO ARMY BUILDER
          </Link>
        </div>
      </div>
    </div>
  );
}
