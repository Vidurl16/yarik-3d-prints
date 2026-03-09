# Yarik 3D Prints — Manual Testing Guide

> Run these steps against `http://localhost:3000` (or your deployed URL) with the DB migration applied and Supabase Auth enabled.

---

## Prerequisites

Before testing, confirm:

- [ ] `supabase/migration_phase2.sql` has been run in the Supabase SQL Editor
- [ ] `.env.local` has real values for all keys (not placeholder `xxx`)
- [ ] `ADMIN_EMAIL_ALLOWLIST` contains the email you'll use to test admin
- [ ] Supabase Auth → Email provider is **enabled** (Dashboard → Auth → Providers)
- [ ] Dev server is running: `npm run dev` → `http://localhost:3000`

---

## 1. Storefront — Public Pages

| # | Step | Expected |
|---|------|----------|
| 1.1 | Visit `/` | Landing page loads with Dexarium theme, no errors |
| 1.2 | Visit `/shop` | Product grid renders; at least one product card visible |
| 1.3 | Click a brand tile (e.g. `/shop/warhammer`) | Brand page loads with brand theme |
| 1.4 | Visit `/new-arrivals` | Page renders (may be empty if no new products) |
| 1.5 | Visit `/preorders` | Page renders |
| 1.6 | Visit `/contact` | Contact page renders |
| 1.7 | Open DevTools → Network; reload any page | No `401` or `500` errors in Network tab |

---

## 2. Authentication

### 2a. Sign Up
| # | Step | Expected |
|---|------|----------|
| 2.1 | Visit `/login` | Login form renders |
| 2.2 | Click **"Sign up"** tab | Sign-up form appears |
| 2.3 | Enter a valid email + password (min 6 chars) and submit | Success message or redirect to `/account` |
| 2.4 | Check Supabase Dashboard → Auth → Users | New user row appears |

### 2b. Log In
| # | Step | Expected |
|---|------|----------|
| 2.5 | Visit `/login`, enter credentials, submit | Redirects to `/account` |
| 2.6 | Check nav bar | **ACCOUNT** link visible (not LOGIN) |
| 2.7 | Visit `/account` directly | Account page shows email + order history section |

### 2c. Sign Out
| # | Step | Expected |
|---|------|----------|
| 2.8 | Click **Sign out** on `/account` | Redirected to `/login` or `/` |
| 2.9 | Manually navigate to `/account` while logged out | Redirected to `/login` |

### 2d. Admin Access Guard
| # | Step | Expected |
|---|------|----------|
| 2.10 | While logged out, navigate to `/admin` | Redirected to `/login` |
| 2.11 | Log in with a NON-admin email, navigate to `/admin` | Redirected to `/` (access denied) |
| 2.12 | Log in with the admin email (in `ADMIN_EMAIL_ALLOWLIST`), navigate to `/admin` | Admin dashboard loads |

---

## 3. Cart — Guest Behaviour

| # | Step | Expected |
|---|------|----------|
| 3.1 | While **logged out**, add a product to cart from `/shop` | Cart count in nav increments |
| 3.2 | Navigate to `/cart` | Product line items visible with correct prices |
| 3.3 | Change quantity | Total updates instantly |
| 3.4 | Remove an item | Item disappears, total recalculates |
| 3.5 | Refresh page | Cart items still there (persisted in `localStorage`) |
| 3.6 | Open a second browser tab, navigate to `/cart` | Same cart state visible |

---

## 4. Cart — Logged-In Behaviour

| # | Step | Expected |
|---|------|----------|
| 4.1 | Add items to cart while **logged out** (guest) | Items stored in `localStorage` |
| 4.2 | Log in | Cart merges: local items + any Supabase-saved items combined |
| 4.3 | Add another item while logged in | Item count increases |
| 4.4 | In Supabase Dashboard → Table Editor → `carts` table | Row exists for your user ID with correct items JSON |
| 4.5 | Log out, log back in | Cart restores from Supabase (not empty) |

---

## 5. Checkout Flow (Yoco)

> **Note:** Requires real Yoco test keys in `.env.local`. Use Yoco test card numbers from https://developer.yoco.com/testing

| # | Step | Expected |
|---|------|----------|
| 5.1 | Add item(s) to cart, click **Checkout** | Redirected to Yoco hosted payment page |
| 5.2 | In Supabase `orders` table | New row created with `payment_status = pending` |
| 5.3 | Complete payment with Yoco test card | Redirected back to `/cart?success=true` |
| 5.4 | Cart success state | Shows **"PAYMENT PROCESSING"** (NOT "ORDER RECEIVED") |
| 5.5 | Cart items | Cart is cleared |
| 5.6 | Yoco fires webhook → `POST /api/webhooks/yoco` | Order row `payment_status` updates to `paid` |
| 5.7 | In Supabase `orders` table | `payment_status = paid`, `paid_at` timestamp populated, `payment_provider = yoco` |

> ⚠️ If the webhook doesn't fire locally, use [ngrok](https://ngrok.com) to expose localhost and configure the Yoco dashboard webhook URL to `https://<your-ngrok-url>/api/webhooks/yoco`

---

## 6. Admin Portal — Products CRUD

Log in with an admin email first.

| # | Step | Expected |
|---|------|----------|
| 6.1 | Visit `/admin` | Dashboard tiles: Products, Orders, Analytics |
| 6.2 | Click **Products** → `/admin/products` | Product list table renders |
| 6.3 | Click **New Product** | Form renders with fields: name, description, price, brand, category, stock, image |
| 6.4 | Fill in form, upload an image, click **Save** | Product created; returned to product list; new row visible |
| 6.5 | Visit `/shop` (storefront) | New product appears within ~60 seconds (ISR revalidation) |
| 6.6 | Click **Edit** on a product | Form pre-filled with current values |
| 6.7 | Change price, click **Save** | Price updated on product list + storefront |
| 6.8 | Click **Deactivate** on a product | Product removed from public storefront, still in admin list |
| 6.9 | Click **Activate** | Product reappears on storefront |
| 6.10 | Click **Delete** | Product removed from list and DB |

---

## 7. Admin Portal — Orders

| # | Step | Expected |
|---|------|----------|
| 7.1 | Visit `/admin/orders` | Orders table renders (filter by date/status) |
| 7.2 | Complete a test checkout (step 5) | Order appears in admin list |
| 7.3 | Filter by status `paid` | Shows only paid orders |
| 7.4 | Filter by status `pending` | Shows only pending orders |
| 7.5 | Filter by date range | Orders filtered correctly |

---

## 8. Admin Portal — Analytics

| # | Step | Expected |
|---|------|----------|
| 8.1 | Visit `/admin/analytics` | KPI cards render (Revenue, AOV, Order Count) |
| 8.2 | After completing a paid test order | Revenue and order count reflect the new order |
| 8.3 | Top Products table | Shows products sorted by revenue contribution |

---

## 9. Image Storage

| # | Step | Expected |
|---|------|----------|
| 9.1 | Upload product image via admin form | No error; image URL saved to product |
| 9.2 | Visit product on storefront | Image renders correctly |
| 9.3 | In Supabase Dashboard → Storage → `product-images` bucket | Image file visible |
| 9.4 | Try uploading a file > 5MB | Error message shown; upload rejected |

---

## 10. Security Checks

| # | Step | Expected |
|---|------|----------|
| 10.1 | Call `GET /api/admin/products` with no auth cookie | `401 Unauthorized` |
| 10.2 | Call `POST /api/admin/products` with non-admin session | `403 Forbidden` |
| 10.3 | Call `GET /api/admin/analytics` with no auth | `401 Unauthorized` |
| 10.4 | Call `POST /api/admin/revalidate` without `x-revalidate-secret` header | `401 Unauthorized` |
| 10.5 | Call `POST /api/webhooks/yoco` with invalid signature | `400 Bad Request` |
| 10.6 | Check browser DevTools → Network: any response | No secret keys visible in response payloads |

---

## 11. ISR / Cache Revalidation

| # | Step | Expected |
|---|------|----------|
| 11.1 | Edit a product price in admin | Admin calls revalidate API automatically |
| 11.2 | Visit the product page on storefront | Updated price visible within 60 seconds |
| 11.3 | Manually call `POST /api/admin/revalidate` with correct secret header | `200 { revalidated: true }` |

---

## Known Limitations / Out of Scope (Phase 2)

- No discount/coupon codes
- No email notifications on order (Phase 3)
- Yoco webhook requires public URL — use ngrok for local testing
- Cart sync to Supabase requires a `CartSyncProvider` component to be wired in root layout (planned for Phase 3)

---

## Quick Smoke Test (5-minute check)

Run this after any deployment to confirm nothing is catastrophically broken:

```bash
# 1. Homepage
curl -s -o /dev/null -w "/ → %{http_code}\n" http://localhost:3000

# 2. Shop
curl -s -o /dev/null -w "/shop → %{http_code}\n" http://localhost:3000/shop

# 3. Login page
curl -s -o /dev/null -w "/login → %{http_code}\n" http://localhost:3000/login

# 4. Admin redirect (should be 307 when not logged in)
curl -s -o /dev/null -w "/admin → %{http_code}\n" http://localhost:3000/admin

# 5. Checkout with empty cart
curl -s -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"items":[]}' | python3 -m json.tool
# Expected: {"error":"Cart is empty"}

# 6. Webhook with bad signature
curl -s -X POST http://localhost:3000/api/webhooks/yoco \
  -H "Content-Type: application/json" \
  -H "webhook-id: test" \
  -H "webhook-timestamp: 0" \
  -H "webhook-signature: v1,invalidsig" \
  -d '{}' | python3 -m json.tool
# Expected: {"error":"Invalid webhook signature"} or similar 400
```
