import { ARMY_BUILDER_BRANDS, BRAND_THEME_MAP, THEMES } from "@/components/theme/themes";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ brand: string }>;
}

export function generateStaticParams() {
  return ARMY_BUILDER_BRANDS.map((brand) => ({ brand }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const themeId = BRAND_THEME_MAP[brand] ?? "dexarium";
  const theme = THEMES[themeId];
  return {
    title: `Army Builder — ${theme.label} | The Dexarium`,
    description: `Build your ${theme.label} army. Select units by role, add basing & battle effects upsells.`,
  };
}

const ROLE_SECTIONS = [
  { id: "hq", label: "HQ", icon: "👑", description: "Commanders & Characters" },
  { id: "battleline", label: "Battleline", icon: "🛡️", description: "Core troops & scoring units" },
  { id: "infantry", label: "Infantry / Cavalry", icon: "⚔️", description: "Foot soldiers & mounted warriors" },
  { id: "vehicles", label: "Vehicles", icon: "🚛", description: "Tanks, walkers & war machines" },
  { id: "transports", label: "Transports", icon: "🚁", description: "Deployment & mobility units" },
] as const;

const UPSELL_TOGGLES = [
  { id: "basing", label: "Basing Materials", icon: "🪨", description: "Scenic bases for every unit" },
  { id: "battle-effects", label: "Battle Effects", icon: "💥", description: "Explosions, smoke & impact markers" },
] as const;

export default async function ArmyBuilderPage({ params }: Props) {
  const { brand } = await params;
  const themeId = BRAND_THEME_MAP[brand] ?? "dexarium";
  const theme = THEMES[themeId];

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>

      {/* ── Page Header ──────────────────────────────────────── */}
      <div
        className="border-b pt-24 pb-8"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-body text-[10px] tracking-[0.35em] uppercase mb-2"
            style={{ color: "var(--primary)", opacity: 0.7 }}
          >
            {theme.icon} {theme.label}
          </p>
          <h1
            className="font-heading text-3xl sm:text-5xl tracking-wider"
            style={{ color: "var(--text)" }}
          >
            ARMY BUILDER
          </h1>
          <p
            className="font-body text-sm mt-2 tracking-wide"
            style={{ color: "var(--muted)" }}
          >
            Select units by role. Add basing &amp; battle effects. Review your list.
          </p>
        </div>
      </div>

      {/* ── Main Layout: Roles + Sticky Summary ──────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">

        {/* Left: Role sections */}
        <div className="flex-1 space-y-6">
          {ROLE_SECTIONS.map((role) => (
            <section
              key={role.id}
              className="p-6"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{role.icon}</span>
                <div>
                  <h2
                    className="font-heading text-lg tracking-wider"
                    style={{ color: "var(--text)" }}
                  >
                    {role.label.toUpperCase()}
                  </h2>
                  <p
                    className="font-body text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    {role.description}
                  </p>
                </div>
              </div>

              {/* Unit placeholder grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square flex items-center justify-center animate-pulse"
                    style={{
                      background: "var(--bg)",
                      border: "1px dashed var(--border)",
                    }}
                  >
                    <span
                      className="font-body text-[10px] tracking-wider"
                      style={{ color: "var(--muted)" }}
                    >
                      + ADD UNIT
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Upsell toggles */}
          <section
            className="p-6"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <h2
              className="font-heading text-lg tracking-wider mb-5"
              style={{ color: "var(--text)" }}
            >
              OPTIONAL ADD-ONS
            </h2>
            <div className="space-y-3">
              {UPSELL_TOGGLES.map((toggle) => (
                <label
                  key={toggle.id}
                  className="flex items-center gap-4 p-4 cursor-pointer transition-all duration-150"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {/* Placeholder checkbox */}
                  <div
                    className="w-5 h-5 flex-shrink-0"
                    style={{ border: "1px solid var(--primary)" }}
                    aria-hidden="true"
                  />
                  <span className="text-xl">{toggle.icon}</span>
                  <div className="flex-1">
                    <p
                      className="font-body text-sm font-semibold tracking-wider"
                      style={{ color: "var(--text)" }}
                    >
                      {toggle.label}
                    </p>
                    <p
                      className="font-body text-xs"
                      style={{ color: "var(--muted)" }}
                    >
                      {toggle.description}
                    </p>
                  </div>
                  <span
                    className="font-body text-[10px] tracking-wider"
                    style={{ color: "var(--primary)" }}
                  >
                    ADD →
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Sticky Summary Panel */}
        <aside
          className="lg:w-80 xl:w-96 shrink-0"
          style={{ position: "sticky", top: "80px", alignSelf: "flex-start" }}
        >
          <div
            className="p-6"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="font-heading text-base tracking-wider mb-6 pb-4"
              style={{ color: "var(--text)", borderBottom: "1px solid var(--border)" }}
            >
              YOUR LIST
            </h3>

            {/* Role summary rows */}
            <div className="space-y-3 mb-6">
              {ROLE_SECTIONS.map((role) => (
                <div key={role.id} className="flex items-center justify-between">
                  <span
                    className="font-body text-xs tracking-wider flex items-center gap-2"
                    style={{ color: "var(--muted)" }}
                  >
                    <span>{role.icon}</span>
                    {role.label}
                  </span>
                  <span
                    className="font-body text-xs"
                    style={{ color: "var(--text)" }}
                  >
                    0 units
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              className="my-4"
              style={{ borderTop: "1px solid var(--border)" }}
            />

            {/* Add-on rows */}
            {UPSELL_TOGGLES.map((t) => (
              <div key={t.id} className="flex items-center justify-between mb-2">
                <span
                  className="font-body text-xs flex items-center gap-2"
                  style={{ color: "var(--muted)" }}
                >
                  {t.icon} {t.label}
                </span>
                <span
                  className="font-body text-[10px] tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  —
                </span>
              </div>
            ))}

            {/* Divider */}
            <div
              className="my-5"
              style={{ borderTop: "1px solid var(--border)" }}
            />

            {/* Total placeholder */}
            <div className="flex items-baseline justify-between mb-6">
              <span
                className="font-body text-xs tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
              >
                TOTAL
              </span>
              <span
                className="font-heading text-xl"
                style={{ color: "var(--primary)" }}
              >
                R 0.00
              </span>
            </div>

            {/* CTA placeholder */}
            <button
              disabled
              className="w-full font-body text-sm tracking-[0.2em] py-4 transition-all duration-200 opacity-40 cursor-not-allowed"
              style={{
                background: "var(--primary)",
                color: "var(--bg)",
              }}
            >
              ADD TO CART
            </button>
            <p
              className="font-body text-[10px] text-center mt-3"
              style={{ color: "var(--muted)" }}
            >
              Select units to continue
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
