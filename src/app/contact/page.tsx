import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — YARIK 3D Prints",
  description: "Get in touch for custom orders, preorders, or any questions.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#6b6b6b] font-body mb-8">
          <Link href="/" className="hover:text-[#c9a84c] transition-colors">HOME</Link>
          <span className="text-[rgba(201,168,76,0.3)]">›</span>
          <span className="text-[rgba(232,224,208,0.5)]">CONTACT</span>
        </div>

        <div
          className="h-px mb-8"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }}
        />

        <p className="font-body text-[10px] tracking-[0.3em] text-[rgba(201,168,76,0.5)] mb-3 uppercase">
          Get in Touch
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl text-[#e8e0d0] mb-4">CONTACT</h1>
        <p className="font-body text-sm text-[#6b6b6b] max-w-md leading-relaxed">
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
              value: "+27 XX XXX XXXX",
              sub: "Mon–Sat, 9am–6pm SAST",
              href: "https://wa.me/27XXXXXXXXXX",
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-6 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #141414 0%, #1a1414 100%)",
                border: "1px solid rgba(201,168,76,0.12)",
              }}
            >
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-body text-[10px] tracking-[0.3em] text-[rgba(201,168,76,0.5)] mb-1">{item.label}</p>
                <p className="font-heading text-base text-[#e8e0d0] group-hover:text-[#c9a84c] transition-colors">
                  {item.value}
                </p>
                <p className="font-body text-xs text-[#6b6b6b] mt-1">{item.sub}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Enquiry Types */}
        <div
          className="p-8 mb-12"
          style={{
            background: "linear-gradient(135deg, #141414 0%, #1a1414 100%)",
            border: "1px solid rgba(201,168,76,0.1)",
          }}
        >
          <h2 className="font-heading text-lg tracking-widest text-[#c9a84c] mb-6">COMMON ENQUIRIES</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Custom Prints", desc: "Got an STL? We&apos;ll quote it." },
              { label: "Preorders", desc: "Reserve upcoming releases." },
              { label: "Bulk Orders", desc: "10+ units — ask about discounts." },
              { label: "Commission Work", desc: "Custom sculpts &amp; painted minis." },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 p-4 border border-[rgba(201,168,76,0.06)]"
              >
                <span className="text-[#c9a84c] mt-0.5">→</span>
                <div>
                  <p className="font-body text-sm font-semibold text-[rgba(232,224,208,0.85)]">{item.label}</p>
                  <p
                    className="font-body text-xs text-[#6b6b6b] mt-0.5"
                    dangerouslySetInnerHTML={{ __html: item.desc }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Army Builder CTA */}
        <div className="text-center">
          <p className="font-body text-sm text-[#6b6b6b] mb-4">
            Want to build a custom army order? Use our builder for an instant quote.
          </p>
          <Link
            href="/builder"
            className="font-body text-xs tracking-[0.2em] px-8 py-3 bg-[#8b0000] hover:bg-[#b50000] text-[#e8e0d0] transition-all duration-200 inline-block"
          >
            GO TO ARMY BUILDER
          </Link>
        </div>
      </div>
    </div>
  );
}
