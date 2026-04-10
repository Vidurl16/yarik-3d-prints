# Yarik 3D Prints — Codebase Skill Guide

Use this guide to make changes immediately without re-exploring the repo.

---

## Stack

- **Framework**: Next.js 16 (App Router, `src/` dir)
- **Styling**: Tailwind v4 + CSS custom properties (theme tokens)
- **Auth + DB**: Supabase (SSR package `@supabase/ssr`)
- **Payments**: Yoco (provider-agnostic adapter)
- **Email**: Resend
- **Cart state**: Zustand + localStorage + Supabase `carts` table sync
- **Animations**: Framer Motion
- **Fonts**: Cinzel Decorative (headings) + Rajdhani (body) via `next/font/google`
- **Tests**: Playwright E2E only (no Jest/Vitest)

---

## Critical File Paths

```
src/
  app/
    layout.tsx                  # Root layout — Nav, CartDrawer, CartSyncProvider, footer
    globals.css                 # Theme tokens (CSS vars), animations, print badge classes
    page.tsx                    # Home hero
    login/page.tsx              # Login + signup + forgot password (3 modes in one form)
    account/page.tsx            # User account dashboard (SSR, protected)
    account/ChangePasswordButton.tsx  # Client component for in-page password reset
    reset-password/page.tsx     # Password reset landing page (handles Supabase token)
    cart/page.tsx               # Cart + Yoco checkout
    (shop)/[brand]/
      page.tsx                  # Brand category page
      [faction]/page.tsx        # Faction product listing
      army-builder/page.tsx     # Army builder entry (passes props to ArmyBuilderClient)
    auth/
      callback/route.ts         # Exchanges Supabase ?code= → session, redirects to ?next=
      update-password/page.tsx  # Legacy password reset page (keep — old links still work)
    api/
      auth/reset-password/route.ts   # Sends password reset email via Resend
      auth/signout/route.ts
      checkout/route.ts
      admin/products/route.ts
      admin/orders/route.ts
      admin/analytics/route.ts
      admin/upload-image/route.ts
      webhooks/yoco/route.ts
    admin/                      # Protected admin routes
  components/
    Nav.tsx                     # Mega-menu nav (650 lines — desktop + mobile accordion)
    NavAuthLinks.tsx            # LOGIN/ACCOUNT links, reads Supabase session client-side
    CartDrawer.tsx              # Slide-in cart panel
    CartSyncProvider.tsx        # Auth-triggered cart merge + ongoing DB sync
    ArmyBuilderClient.tsx       # Full army builder UI — selections, summary, cart add
    ProductCard.tsx
    theme/
      themes.ts                 # ThemeId, THEMES, BRAND_THEME_MAP, ARMY_BUILDER_BRANDS
      ThemeProvider.tsx
  lib/
    auth/
      getSession.ts             # getSession() → User | null  (use in Server Components)
      isAdmin.ts                # isAdmin(user) → boolean
    supabase/
      browser.ts                # getBrowserClient() — anon key, singleton, for Client Components
      server.ts                 # getServiceClient() — service role, for API routes/admin ops
      server-auth.ts            # createAuthClient() — SSR cookies, for Server Components/middleware
    products.ts                 # Static product data, formatPrice(), brandFactions
    data/
      products.ts               # DB-backed product fetching
      orders.ts                 # DB-backed order fetching
      types.ts                  # DbProduct, DbOrder, PaymentStatus
    payments/
      index.ts                  # getPaymentProvider() factory
      types.ts                  # PaymentProvider interface
      yoco.ts                   # Yoco adapter
  store/
    cartStore.ts                # Zustand cart (persist to localStorage + Supabase sync)
  proxy.ts                      # Auth middleware: session refresh + /admin + /account protection
e2e/
  auth.spec.ts
  forgot-password.spec.ts
  helpers/auth.ts               # mockSignInSuccess/Failure/SignUpSuccess helpers
playwright.config.ts            # baseURL: localhost:3002, 3 viewports, webServer: npm run dev
```

---

## Styling Conventions

### CSS Custom Properties (Theme Tokens)

All colours come from CSS variables set by `[data-theme="X"]` in `globals.css`.
**Never hardcode colours** — always use `var(--token)`.

| Token | Usage |
|---|---|
| `var(--bg)` | Page background |
| `var(--surface)` | Cards, panels |
| `var(--text)` | Primary body text |
| `var(--muted)` | Secondary/label text |
| `var(--primary)` | Gold accent — buttons, headings, prices |
| `var(--accent)` | Blood red — destructive, badges |
| `var(--border)` | Borders |
| `var(--glow)` | Box shadows, glows |

**Theme IDs**: `dexarium` (default), `grimdark`, `fantasy`, `pokemon`, `basing`, `terrain`, `display`

Brand → theme mapping is in `src/components/theme/themes.ts`:
```ts
import { BRAND_THEME_MAP, THEMES } from "@/components/theme/themes";
const theme = THEMES[BRAND_THEME_MAP["grimdark-future"]]; // ThemeTokens
```

### Font Classes

```tsx
className="font-heading" // Cinzel Decorative — headings, prices
className="font-body"    // Rajdhani — all body text, labels, buttons
```

### Print Badge Classes (from globals.css)

```tsx
className="print-badge-resin"
className="print-badge-fdm"
className="print-badge-multicolour"
```

### Common Inline Style Pattern

```tsx
style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
```

---

## Supabase Client Patterns

### In Client Components (`"use client"`)

```tsx
import { getBrowserClient } from "@/lib/supabase/browser";

const supabase = getBrowserClient(); // singleton
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
await supabase.auth.signOut();
const { data: { session } } = await supabase.auth.getSession();
```

### In Server Components / Route Handlers (read-only, SSR cookies)

```tsx
import { createAuthClient } from "@/lib/supabase/server-auth";

const supabase = createAuthClient();
const { data: { user } } = await supabase.auth.getUser();
```

### In API Routes / Admin Operations (service role)

```tsx
import { getServiceClient } from "@/lib/supabase/server";

const supabase = getServiceClient();
// Full admin access — user management, bypasses RLS
await supabase.auth.admin.createUser({ email, email_confirm: true });
await supabase.auth.admin.generateLink({ type: "recovery", email, options: { redirectTo } });
await supabase.from("orders").select("*"); // bypasses RLS
```

---

## Auth Patterns

### Protect a Server Component page

```tsx
import { getSession } from "@/lib/auth/getSession";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/your-page");
  // user.id, user.email, user.user_metadata.full_name
}
```

### Check admin (server-side only)

```tsx
import { isAdmin } from "@/lib/auth/isAdmin";
if (!isAdmin(user)) redirect("/");
```

### Password reset flow (full)

1. User submits email on `/login` (forgot mode)
2. POST `/api/auth/reset-password` → `admin.generateLink({ type: "recovery", redirectTo: "${SITE_URL}/reset-password" })` → Resend email
3. User clicks email link → Supabase verifies → redirects to `/reset-password?code=xxx`
4. `/reset-password` page calls `supabase.auth.exchangeCodeForSession(code)` → session set
5. User submits new password → `supabase.auth.updateUser({ password })` → redirect to `/account?updated=true`

> **Supabase Dashboard requirement**: Auth > URL Configuration > Site URL must be `https://thedexarium.co.za`
> and `/reset-password` must be in the Redirect URLs allowlist.

---

## Cart Store

```tsx
import { useCartStore } from "@/store/cartStore";

const { addItem, removeItem, updateQuantity, clearCart, items, openDrawer, getTotal } = useCartStore();

addItem({
  id: "product-id",
  name: "Product Name",
  price: 35000, // in cents (R350.00)
  imageUrl: "https://...",
  printType: "RESIN", // "RESIN" | "FDM" | "MULTICOLOUR"
});

updateQuantity("product-id", 3); // 0 removes
openDrawer(); // opens CartDrawer
```

Cart persists to `localStorage` key `"yarik-cart"` and syncs to `carts` table when logged in.

---

## Products

### Formatting

```tsx
import { formatPrice } from "@/lib/products";
formatPrice(35000) // → "R 350"  (price in cents)
```

### Static product data

```tsx
import { brandFactions } from "@/lib/products";
brandFactions["grimdark-future"] // → Array<{ id, name, description }>
```

### DB products

```tsx
import { getProductsByBrand, getProductById } from "@/lib/data/products";
const products = await getProductsByBrand("grimdark-future");
```

---

## Army Builder

**Entry**: `/src/app/(shop)/[brand]/army-builder/page.tsx` (server, fetches products)  
**Component**: `/src/components/ArmyBuilderClient.tsx` (client, ~1000 lines)

Props:
```tsx
{ brand, theme, mainProducts, basingSuggestion, battleEffectsSuggestion }
```

Key state:
- `selections: Record<productId, quantity>` — persisted to `sessionStorage` key `army-builder-${brand}`
- `selectedFaction: string` — "all" or faction ID
- `basingActive / battleEffectsActive: boolean`
- `mobileSummaryOpen: boolean` — mobile bottom sheet toggle

Factions grouped by alliance in `FACTION_GROUPS`. Products grouped by role in `ROLE_SECTIONS`.

---

## Navigation / Routing

- Brand pages: `/(shop)/[brand]/page.tsx` — uses `BRAND_THEME_MAP` to set `data-theme`
- Faction pages: `/(shop)/[brand]/[faction]/page.tsx`
- Army builder: `/(shop)/[brand]/army-builder/page.tsx` — only for `ARMY_BUILDER_BRANDS`
- The middleware (`src/proxy.ts`) redirects `/admin/*` and `/account/*` to login if unauthed

### Adding a new protected page

1. Create `src/app/your-page/page.tsx`
2. Add `const user = await getSession(); if (!user) redirect("/login?next=/your-page");` at the top
3. The middleware already handles the redirect, but belt-and-suspenders is fine

---

## Environment Variables

| Variable | Where used |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | All Supabase clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server-auth clients |
| `SUPABASE_SERVICE_ROLE_KEY` | `getServiceClient()` — API routes only |
| `NEXT_PUBLIC_SITE_URL` | Reset password `redirectTo`, canonical URLs |
| `RESEND_API_KEY` | Email sending |
| `RESEND_FROM_EMAIL` | From address (must match verified Resend domain) |
| `PAYMENT_PROVIDER` | `"yoco"` |
| `PAYMENT_SECRET_KEY` | Yoco live key |
| `PAYMENT_TEST_SECRET_KEY` | Yoco test key |
| `PAYMENT_WEBHOOK_SECRET` | Yoco webhook validation |
| `ADMIN_EMAIL_ALLOWLIST` | Comma-separated admin emails (checked in proxy.ts) |
| `PUDO_API_KEY` | `{accountId}\|{apiKey}` |
| `REVALIDATE_SECRET` | ISR revalidation token |

---

## Testing

```bash
npx playwright test                          # all tests
npx playwright test e2e/auth.spec.ts         # specific file
npx playwright test --reporter=list          # verbose output
```

Tests mock Supabase via `page.route("https://[supabase-url]/auth/v1/**", ...)`.  
Internal API routes (`/api/auth/reset-password`) are mocked via `page.route("/api/...", ...)`.

**Important**: Needs `.env.local` with at least stub Supabase values to start the dev server.  
The 4 pre-existing failures in `auth.spec.ts` are due to the Supabase mock URL not matching the stub `.env.local` URL — not a real bug.

---

## Common Gotchas

- **Prices are in cents**: `35000` = R350. Use `formatPrice()` for display.
- **`getServiceClient()` is server-only** — never import in client components.
- **`getBrowserClient()` is a singleton** — call it anywhere in client code, no need to memoize.
- **Theme tokens only work inside a `[data-theme]` container** — root `<body>` has `data-theme="dexarium"` by default.
- **`product-card-frame` / `product-card-image`** are CSS utility classes in `globals.css` for consistent image aspect ratios.
- **Cart quantities are deltas, not absolutes when using `addItem`** — use `updateQuantity(id, newTotal)` to set absolute qty.
- **Supabase Dashboard Site URL** must be set to `https://thedexarium.co.za` for auth redirect links to use the correct domain.
- **Resend from address** domain must match a verified domain in the Resend dashboard, and SPF/DKIM DNS records must exist.
