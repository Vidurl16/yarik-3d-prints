# Yarik 3D Prints — Session Context

> Last updated: March 2026 · Commit: `3f0d43d`

---

## Project Overview

**The Dexarium** — e-commerce store for Yarik's 3D-printed wargaming miniatures.
- **Stack:** Next.js 16 (App Router, Turbopack), Supabase (auth + DB), Yoco (payments), Resend (email), Vercel (hosting)
- **Repo:** `github.com/Vidurl16/yarik-3d-prints`
- **Live:** `https://yarik-3d-prints.vercel.app`
- **Dev port:** Always use **3002** (3000/3001 are occupied by stale processes, PID 60440 on 3001 is unkillable)

---

## Environment Quirks

```bash
# Always use this Node version for commands
export PATH="$HOME/.nvm/versions/node/v22.14.0/bin:$PATH"

# npm installs require --ignore-scripts (napi-postinstall symlink is broken)
npm install --ignore-scripts

# Run dev server
npm run dev -- --port 3002
```

---

## Credentials & Env Vars

### `.env.local` (local dev)
| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zdwqssqppdbwqigxxgje.supabase.co` |
| `ADMIN_EMAIL_ALLOWLIST` | `vidur.lutchminarain@gamesglobal.com,vidur360@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3002` |
| `REVALIDATE_SECRET` | `ef844711ce4cd2447e1bd218bc5ee989cc5de6fd0e6480fb483a6b69152d267e` |
| `PAYMENT_WEBHOOK_SECRET` | `whsec_xxx` ← **placeholder, needs real Yoco key** |
| `RESEND_API_KEY` | `re_your_api_key_here` ← **placeholder, needs real key** |

### Vercel env vars (production)
| Key | Status |
|-----|--------|
| `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` | ✅ Set |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Set |
| `ADMIN_EMAIL_ALLOWLIST` | ✅ `yarikhansraj@gmail.com,vidur360@gmail.com,vidur.lutchminarain@gamesglobal.com` |
| `NEXT_PUBLIC_SITE_URL` | ✅ `https://yarik-3d-prints.vercel.app` |
| `REVALIDATE_SECRET` | ✅ Set |
| `RESEND_API_KEY` | ❌ Missing — needs real key from resend.com |
| `PAYMENT_WEBHOOK_SECRET` | ❌ Still placeholder `whsec_xxx` — needs real Yoco key |

---

## Database

- **Project ref:** `zdwqssqppdbwqigxxgje`
- **No direct DB URL** — DDL must be run in the Supabase SQL Editor
- DDL cannot be run via the REST API (PostgREST doesn't support it)

### Tables
| Table | Key columns |
|-------|-------------|
| `products` | `id, slug, name, brand, type, print_type, faction, role, price_cents, currency, tags[], image_url, is_preorder, is_new, is_active, preorder_date, stock_quantity, created_at, updated_at` |
| `orders` | `id, user_id, email, currency, total_amount_cents, status, payment_provider, payment_session_id, payment_status, payment_event_ids, payment_metadata, paid_at, shipping_address, created_at` |
| `order_items` | `id, order_id, product_id, name_snapshot, quantity, unit_amount_cents, created_at` |
| `carts` | `user_id, cart_json, updated_at` |
| `preorder_reservations` | `id, product_id, name, email, message, created_at` ← **needs migration** |

### ⚠️ Pending migration
Run **`supabase/migration_phase5_polish.sql`** in Supabase SQL Editor:
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address jsonb;
CREATE TABLE IF NOT EXISTS preorder_reservations (...);
```

### `supabase/schema.sql` is outdated
The real DB uses `payment_session_id`, `payment_provider`, `payment_status` — not the old `stripe_*` names in schema.sql.

---

## Auth Architecture (Critical)

```
Browser → createBrowserClient (@supabase/ssr) → stores tokens in COOKIES
SSR     → getSession() reads cookies → works ✅

OLD BUG (fixed): createClient (@supabase/supabase-js) stored in localStorage → SSR couldn't read → every protected page redirected to login
```

- `src/lib/supabase/browser.ts` — uses `createBrowserClient` from `@supabase/ssr`
- `src/lib/supabase/server.ts` — server-side service client
- Admin check: `ADMIN_EMAIL_ALLOWLIST` env var, checked in `src/lib/auth/isAdmin.ts`

---

## Key File Map

```
src/
├── app/
│   ├── layout.tsx                    Root layout with Nav, footer, CartDrawer, CartSyncProvider
│   ├── login/page.tsx                Login/signup/forgot-password (3 modes)
│   ├── auth/
│   │   ├── callback/route.ts         Supabase code exchange (email confirm, magic link, oauth)
│   │   └── update-password/page.tsx  Password reset form
│   ├── cart/page.tsx                 Cart + shipping address + checkout
│   ├── preorders/page.tsx            Preorder listing with inline reservation form
│   ├── terms/page.tsx                Terms of service (POPIA)
│   ├── privacy/page.tsx              Privacy policy (POPIA)
│   ├── shop/
│   │   ├── [faction]/page.tsx        Product listing by faction/brand
│   │   └── [faction]/[slug]/
│   │       ├── page.tsx              Product detail page (server component)
│   │       └── AddToCartButton.tsx   Client add-to-cart for detail page
│   ├── api/
│   │   ├── checkout/route.ts         Creates Yoco checkout, saves order + shipping_address
│   │   ├── webhooks/yoco/route.ts    Yoco webhook → update order status + send email
│   │   ├── preorders/reserve/route.ts  POST preorder reservation
│   │   └── admin/products/
│   │       ├── route.ts              GET/POST products (includes stock_quantity)
│   │       └── [id]/route.ts         PATCH/DELETE product
│   └── admin/products/ProductForm.tsx  Full product form with stock_quantity field
├── components/
│   ├── DbProductCard.tsx             Product card with stock badges + links to detail page
│   ├── PreorderReserveButton.tsx     Client component: inline reservation form
│   ├── Nav.tsx                       Top navigation
│   ├── CartDrawer.tsx                Slide-out cart
│   └── CartSyncProvider.tsx          Zustand ↔ Supabase cart sync
└── lib/
    ├── data/
    │   ├── types.ts                  DbProduct (+ stock_quantity), DbOrder (+ shipping_address)
    │   ├── products.ts               DB queries incl. getProductBySlug()
    │   └── orders.ts                 createOrder (+ shipping_address), updateOrderPaymentStatus
    ├── email/index.ts                sendEmail() generic + sendOrderConfirmationEmail()
    ├── supabase/browser.ts           createBrowserClient (CRITICAL: cookie-based)
    └── auth/isAdmin.ts               Email allowlist check
```

---

## Cart / Zustand Store

- **Persist key:** `"yarik-cart"`
- `CartItem` shape: `{ id, name, price (ZAR), quantity, imageUrl, printType: "RESIN"|"FDM"|"MULTICOLOUR" }`
- Products with `id.startsWith("b-")` are bundle items (no `product_id` in DB)

---

## Payments (Yoco)

- Provider configured in `src/lib/payments/`
- Checkout flow: Cart → `POST /api/checkout` → Yoco session → redirect → webhook → `POST /api/webhooks/yoco`
- Webhook at `/api/webhooks/yoco` updates order status + sends Resend email
- **Webhook secret still a placeholder** — must get real key from Yoco dashboard

---

## Testing

```bash
# Run all E2E tests (110 passing)
npm run test:e2e

# Run with real admin credentials
TEST_ADMIN_EMAIL=vidur360@gmail.com TEST_ADMIN_PASSWORD='...' npm run test:e2e

# View HTML report
npx playwright show-report
```

- Test files in `e2e/` (excluded from Next.js TypeScript check via `e2e/tsconfig.json`)
- `playwright.config.ts` — port 3002, chromium, HTML report

---

## Revalidation

- `REVALIDATE_SECRET` must be set in Vercel for product cache revalidation to work
- `triggerRevalidation()` in admin product routes calls `POST /api/admin/revalidate`
- Has `AbortSignal.timeout(5_000)` to prevent hanging when `NEXT_PUBLIC_SITE_URL` doesn't match

---

## What's Done

- [x] Full Playwright E2E test suite (110 passing)
- [x] Auth cookie bug fixed (`createBrowserClient` vs `createClient`)
- [x] All missing files committed to git (was causing Vercel build failures)
- [x] Vercel deploys successfully
- [x] 3 admins in `ADMIN_EMAIL_ALLOWLIST` on Vercel
- [x] `REVALIDATE_SECRET` set on Vercel
- [x] Password reset flow
- [x] Shipping address collection at checkout
- [x] Stock/inventory tracking (admin form + badges on cards)
- [x] Individual product detail pages (`/shop/[faction]/[slug]`)
- [x] Preorder reservation flow (inline form, API, confirmation email)
- [x] Terms & Privacy pages (POPIA-compliant)
- [x] Footer with all key links

## Still Outstanding

- [ ] **Run DB migration** `supabase/migration_phase5_polish.sql` in Supabase SQL Editor
- [ ] **Yoco live webhook secret** — get from Yoco merchant dashboard, set `PAYMENT_WEBHOOK_SECRET` on Vercel
- [ ] **Resend API key** — get from resend.com, set `RESEND_API_KEY` on Vercel (then order confirmation emails go live)
- [ ] Admin: show reservation count next to preorder products on admin products page
- [ ] Admin: order management UI (currently orders are in Supabase dashboard only)
