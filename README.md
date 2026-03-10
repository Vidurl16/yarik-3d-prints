# The Dexarium — Yarik 3D Prints

A production-quality 3D printing e-commerce store for Yarik, built with **Next.js 16**, **Supabase**, and **Yoco** payments. Sells Warhammer-style tabletop miniatures, Pokémon figures, basing materials, and terrain — all printed with medical-grade dental resin and Bambu Lab multicolour FDM printers in South Africa.

**Live URL:** `https://yarik.vidur.co.za`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 (cart, persisted to localStorage) |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (email + password) |
| Payments | Yoco (abstract `PaymentProvider` interface) |
| Email | Resend (order confirmation) |
| Fonts | Cinzel Decorative + Rajdhani (Google Fonts) |
| Deployment | Vercel |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

Copy `.env.example` to `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

Required keys:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin APIs) |
| `PAYMENT_PROVIDER` | Set to `yoco` |
| `PAYMENT_SECRET_KEY` | Yoco secret key |
| `PAYMENT_WEBHOOK_SECRET` | Yoco webhook signing secret |
| `ADMIN_EMAIL_ALLOWLIST` | Comma-separated admin emails |
| `REVALIDATE_SECRET` | Random secret for ISR cache purge API |
| `RESEND_API_KEY` | Resend API key (optional — emails skipped if absent) |
| `RESEND_FROM_EMAIL` | Override sender (default: `The Dexarium <orders@yarik3d.co.za>`) |

### 3. Run the database migration

In Supabase SQL Editor, run **both**:
1. `supabase/schema.sql` (Phase 1 schema)
2. `supabase/migration_phase2.sql` (Phase 2: carts, provider-agnostic orders, RLS, storage bucket)

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (shop)/[brand]/          # Brand pages (grimdark-future, age-of-fantasy, etc.)
│   │   └── army-builder/        # Interactive army builder (Grimdark + Fantasy only)
│   ├── admin/                   # Admin dashboard (products, orders, analytics)
│   ├── api/                     # checkout, webhooks/yoco, admin APIs
│   ├── cart/                    # Cart page + Yoco redirect handling
│   ├── account/                 # Order history (auth-gated)
│   └── login/                   # Auth (sign in / sign up)
├── components/
│   ├── ArmyBuilderClient.tsx    # Interactive army builder UI
│   ├── BrandPage.tsx            # Shared brand page layout
│   ├── CartDrawer.tsx           # Framer Motion cart drawer
│   ├── CartSyncProvider.tsx     # Auth-aware cart sync
│   └── theme/                   # CSS var theme system
├── lib/
│   ├── data/                    # Supabase queries (products, orders)
│   ├── payments/                # Abstract PaymentProvider + Yoco adapter
│   ├── email/                   # Resend order confirmation
│   └── products.ts              # Static product catalogue (36 products)
└── store/
    └── cartStore.ts             # Zustand cart store with DB sync
```

---

## Key Features

- **Route-driven theming** — 6 themes (dexarium, grimdark, fantasy, pokemon, basing, terrain) via CSS variables and `data-theme` attribute
- **Army Builder** — interactive unit selector for Grimdark Future and Age of Fantasy; groups by role (HQ, Battleline, Infantry/Cavalry, Vehicles, Transports); real-time total; upsell toggles for basing & battle effects; "Add Warband to Cart" CTA
- **Checkout** — server-side order creation → Yoco hosted payment → webhook-confirmed status update → Resend confirmation email
- **Admin portal** — product CRUD with image upload, order management with filters, revenue analytics with date-range KPIs
- **Cart sync** — guest cart in localStorage; merges with Supabase on login; debounced DB sync while logged in
- **ISR** — brand pages revalidate every 60 seconds; admin triggers manual purge on product save

---

## Manual Testing Guide

> Run these steps against `http://localhost:3000` (or your deployed URL) with the DB migration applied and Supabase Auth enabled.

### Prerequisites

Before testing, confirm:

- [ ] `supabase/migration_phase2.sql` has been run in the Supabase SQL Editor
- [ ] `.env.local` has real values for all keys (not placeholder `xxx`)
- [ ] `ADMIN_EMAIL_ALLOWLIST` contains the email you'll use to test admin
- [ ] `RESEND_API_KEY` is set with a valid Resend key (safe to omit — emails are skipped gracefully if missing)
- [ ] Supabase Auth → Email provider is **enabled** (Dashboard → Auth → Providers)
- [ ] Dev server is running: `npm run dev` → `http://localhost:3000`

---

### 1. Storefront — Public Pages

| # | Step | Expected |
|---|------|----------|
| 1.1 | Visit `/` | Landing page loads with Dexarium theme, no errors |
| 1.2 | Visit `/shop` | Product grid renders; at least one product card visible |
| 1.3 | Click a brand tile (e.g. `/grimdark-future`) | Brand page loads with brand theme |
| 1.4 | Visit `/new-arrivals` | Page renders (may be empty if no new products) |
| 1.5 | Visit `/preorders` | Page renders |
| 1.6 | Visit `/contact` | Contact page renders |
| 1.7 | Open DevTools → Network; reload any page | No `401` or `500` errors in Network tab |

---

### 2. Authentication

#### 2a. Sign Up
| # | Step | Expected |
|---|------|----------|
| 2.1 | Visit `/login` | Login form renders |
| 2.2 | Click **"Sign up"** tab | Sign-up form appears |
| 2.3 | Enter a valid email + password (min 6 chars) and submit | Success message or redirect to `/account` |
| 2.4 | Check Supabase Dashboard → Auth → Users | New user row appears |

#### 2b. Log In
| # | Step | Expected |
|---|------|----------|
| 2.5 | Visit `/login`, enter credentials, submit | Redirects to `/account` |
| 2.6 | Check nav bar | **ACCOUNT** link visible (not LOGIN) |
| 2.7 | Visit `/account` directly | Account page shows email + order history section |

#### 2c. Sign Out
| # | Step | Expected |
|---|------|----------|
| 2.8 | Click **Sign out** on `/account` | Redirected to `/login` or `/` |
| 2.9 | Manually navigate to `/account` while logged out | Redirected to `/login` |

#### 2d. Admin Access Guard
| # | Step | Expected |
|---|------|----------|
| 2.10 | While logged out, navigate to `/admin` | Redirected to `/login` |
| 2.11 | Log in with a NON-admin email, navigate to `/admin` | Redirected to `/` (access denied) |
| 2.12 | Log in with the admin email (in `ADMIN_EMAIL_ALLOWLIST`), navigate to `/admin` | Admin dashboard loads |

---

### 3. Cart — Guest Behaviour

| # | Step | Expected |
|---|------|----------|
| 3.1 | While **logged out**, add a product to cart from `/shop` | Cart count in nav increments |
| 3.2 | Navigate to `/cart` | Product line items visible with correct prices |
| 3.3 | Change quantity | Total updates instantly |
| 3.4 | Remove an item | Item disappears, total recalculates |
| 3.5 | Refresh page | Cart items still there (persisted in `localStorage`) |

---

### 4. Cart — Logged-In Behaviour

| # | Step | Expected |
|---|------|----------|
| 4.1 | Add items to cart while **logged out** (guest) | Items stored in `localStorage` |
| 4.2 | Log in | Cart merges: local items + any Supabase-saved items combined, then saved to DB |
| 4.3 | Add another item while logged in | Item count increases; Supabase `carts` row updates within ~1 second |
| 4.4 | In Supabase Dashboard → Table Editor → `carts` table | Row exists for your user ID with correct items JSON |
| 4.5 | Log out, log back in on a **different browser/device** | Cart restores from Supabase (not empty) |

---

### 5. Army Builder

| # | Step | Expected |
|---|------|----------|
| 5.1 | Visit `/grimdark-future/army-builder` | Page loads with Grimdark theme; all role sections show real product cards |
| 5.2 | Visit `/age-of-fantasy/army-builder` | Same, but Fantasy theme and Fantasy/Undead products |
| 5.3 | Click **+ ADD** on a unit card | Card highlights; quantity controls appear; summary panel updates with unit name + price |
| 5.4 | Adjust unit quantity using +/− controls | Summary panel total updates in real time |
| 5.5 | Toggle **Basing Materials** upsell checkbox | Checkbox fills; basing product appears in summary; total increases |
| 5.6 | Toggle **Battle Effects** upsell checkbox | Same for battle effects product |
| 5.7 | Remove all units (set qty to 0) | Summary shows "No units selected"; **ADD WARBAND TO CART** button is disabled |
| 5.8 | Select at least one unit, click **ADD WARBAND TO CART** | Cart drawer opens; all selected units + upsells are in cart |
| 5.9 | Role count badges in section headers | Show "X selected" when units are chosen in that role |

---

### 6. Checkout Flow (Yoco)

> **Note:** Requires real Yoco test keys in `.env.local`. Use Yoco test card numbers from https://developer.yoco.com/testing

| # | Step | Expected |
|---|------|----------|
| 6.1 | Add item(s) to cart, click **Checkout** | Redirected to Yoco hosted payment page |
| 6.2 | In Supabase `orders` table | New row created with `payment_status = pending` |
| 6.3 | Complete payment with Yoco test card | Redirected back to `/cart?success=true` |
| 6.4 | Cart success state | Shows **"PAYMENT PROCESSING"**; cart is automatically cleared |
| 6.5 | Yoco fires webhook → `POST /api/webhooks/yoco` | Order row `payment_status` updates to `paid` |
| 6.6 | In Supabase `orders` table | `payment_status = paid`, `paid_at` populated, `payment_provider = yoco` |
| 6.7 | Customer receives order confirmation email | Branded **"The Dexarium"** email sent via Resend (requires `RESEND_API_KEY`) |
| 6.8 | **Failed payment** — use Yoco declined-card test number | Yoco redirects back to `/cart?cancelled=true`; red banner shown; cart intact |

> ⚠️ Webhook won't fire locally. Use [ngrok](https://ngrok.com): `ngrok http 3000` and set the Yoco dashboard webhook URL to `https://<your-ngrok-url>/api/webhooks/yoco`

---

### 7. Admin Portal — Products CRUD

Log in with an admin email first.

| # | Step | Expected |
|---|------|----------|
| 7.1 | Visit `/admin` | Dashboard tiles: Products, Orders, Analytics |
| 7.2 | Click **Products** → `/admin/products` | Product list table renders |
| 7.3 | Click **New Product** | Form renders with all fields |
| 7.4 | Fill in form, upload an image, click **Save** | Product created; new row visible in list |
| 7.5 | Visit `/shop` (storefront) | New product appears within ~60 seconds (ISR revalidation) |
| 7.6 | Click **Edit** on a product | Form pre-filled with current values |
| 7.7 | Change price, click **Save** | Price updated on product list + storefront |
| 7.8 | Click **Deactivate** | Product removed from public storefront, still in admin list |
| 7.9 | Click **Activate** | Product reappears on storefront |
| 7.10 | Click **Delete** | Product removed from list and DB |

---

### 8. Admin Portal — Orders & Analytics

| # | Step | Expected |
|---|------|----------|
| 8.1 | Visit `/admin/orders` | Orders table renders; filter by date/status works |
| 8.2 | Visit `/admin/analytics` | KPI cards render (Revenue, AOV, Order Count) |
| 8.3 | After a paid test order | Revenue and order count reflect the new order; top products table updates |

---

### 9. Security Checks

| # | Step | Expected |
|---|------|----------|
| 9.1 | Call `GET /api/admin/products` with no auth cookie | `401 Unauthorized` |
| 9.2 | Call `POST /api/admin/products` with non-admin session | `403 Forbidden` |
| 9.3 | Call `POST /api/admin/revalidate` without `x-revalidate-secret` header | `401 Unauthorized` |
| 9.4 | Call `POST /api/webhooks/yoco` with invalid signature | `400 Bad Request` |

---

### 10. Known Gaps

| # | Issue | Notes |
|---|-------|-------|
| 10.1 | **Yoco redirect URL field name unverified** | Adapter tries `data.redirectUrl ?? data.paymentUrl ?? data.url` — confirm against Yoco docs with a live test |
| 10.2 | **No guest order status page** | No way to check order status without logging in |
| 10.3 | **ADMIN_EMAIL_ALLOWLIST placeholder** | If `.env.local` still has `you@yourdomain.com`, admin portal is inaccessible |

---

### Quick Smoke Test (5 minutes)

```bash
# Homepage
curl -s -o /dev/null -w "/ → %{http_code}\n" http://localhost:3000

# Shop
curl -s -o /dev/null -w "/shop → %{http_code}\n" http://localhost:3000/shop

# Admin redirect (should be 307 when not logged in)
curl -s -o /dev/null -w "/admin → %{http_code}\n" http://localhost:3000/admin

# Checkout with empty cart → expect {"error":"Cart is empty"}
curl -s -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"items":[]}' | python3 -m json.tool

# Webhook with bad signature → expect 400
curl -s -X POST http://localhost:3000/api/webhooks/yoco \
  -H "Content-Type: application/json" \
  -H "webhook-id: test" \
  -H "webhook-timestamp: 0" \
  -H "webhook-signature: v1,invalidsig" \
  -d '{}' | python3 -m json.tool
```

