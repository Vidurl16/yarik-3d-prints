# Yarik 3D Prints — Testing Guide

> This is the practical testing runbook for the site in its **current** state.
>
> Use this guide in order. It is written to make it clear what is already done, what you can test right now, and what is still intentionally deferred.

---

## 1. Current project state

### Already done

- [x] Supabase project created
- [x] `supabase/bootstrap.sql` run in Supabase SQL Editor
- [x] `supabase/verify_setup.sql` run in Supabase SQL Editor
- [x] Supabase Email auth is enabled
- [x] Local `.env.local` has Supabase URL, anon key, service role key
- [x] Local `.env.local` has a real `REVALIDATE_SECRET`
- [x] Local `.env.local` has an admin allowlist entry
- [x] `npm run lint` passes
- [x] `npm run build` passes

### Not being done right now

- [ ] Yoco webhook testing
- [ ] Hosted checkout testing
- [ ] Order confirmation email testing

That means the **database, auth, cart persistence, and admin/product flows can be tested now**, but the **payment/webhook/email path is still deferred**.

---

## 2. Clear list of what is still needed

### Needed before payment testing

- [ ] Add the real `PAYMENT_WEBHOOK_SECRET`
- [ ] Point the Yoco webhook to the correct public deployment URL
- [ ] Run a real sandbox checkout and confirm webhook delivery

### Needed before email testing

- [ ] Add a real `RESEND_API_KEY`
- [ ] Confirm the sender/domain is valid for `RESEND_FROM_EMAIL`

### Needed before visual / release sign-off

- [ ] Replace placeholder / internal QA art with final approved assets
- [ ] Finalize Dexarium homepage hero direction
- [ ] Confirm all reference images are cleared for production use

### Needed before final production sign-off

- [ ] Run the full end-to-end pass on the deployed Vercel URL
- [ ] Re-test admin flows against production env values
- [ ] Re-test checkout once Yoco webhook secret is configured

---

## 3. Test order to follow

Do the tests in this order:

1. **Database sanity checks**
2. **App smoke test**
3. **Authentication**
4. **Cart persistence**
5. **Admin product CRUD**
6. **Admin orders and analytics**
7. **Optional / deferred payment tests later**

If an earlier section fails, stop and fix that before moving forward.

---

## 4. Database sanity checks

Run these checks first in Supabase.

### 4.1 Confirm the core tables exist

Run:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('products', 'orders', 'order_items', 'carts')
ORDER BY table_name;
```

Expected result:

- `carts`
- `order_items`
- `orders`
- `products`

### 4.2 Confirm provider-agnostic payment columns exist

Run:

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'orders'
  AND column_name IN (
    'user_id',
    'payment_provider',
    'payment_session_id',
    'payment_status',
    'payment_event_ids',
    'payment_metadata',
    'paid_at'
  )
ORDER BY column_name;
```

Expected result:

- all 7 columns are returned

### 4.3 Confirm catalog metadata columns exist

Run:

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'products'
  AND column_name IN ('print_type', 'faction', 'role')
ORDER BY column_name;
```

Expected result:

- `faction`
- `print_type`
- `role`

### 4.4 Confirm products were seeded

Run:

```sql
SELECT COUNT(*) AS product_count FROM products;

SELECT brand, COUNT(*) AS products_per_brand
FROM products
GROUP BY brand
ORDER BY brand;
```

Expected result:

- `product_count` should be greater than `0`
- each major brand should have products

### 4.5 Confirm RLS is enabled

Run:

```sql
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname IN ('products', 'orders', 'order_items', 'carts')
ORDER BY relname;
```

Expected result:

- `rls_enabled = true` for all four tables

If all five checks pass, the DB setup is good enough to move into app testing.

---

## 5. Local app smoke test

From the repo root:

```bash
npm run dev
```

Then in a second terminal:

```bash
curl -s -o /dev/null -w "/ -> %{http_code}\n" http://localhost:3000
curl -s -o /dev/null -w "/shop -> %{http_code}\n" http://localhost:3000/shop
curl -s -o /dev/null -w "/login -> %{http_code}\n" http://localhost:3000/login
curl -s -o /dev/null -w "/admin -> %{http_code}\n" http://localhost:3000/admin
```

Expected:

- `/` returns `200`
- `/shop` returns `200`
- `/login` returns `200`
- `/admin` returns a redirect when logged out

Also run:

```bash
npm run preflight
npm run section12
```

Expected in the **current** state:

- DB is no longer the blocker
- Yoco webhook secret will still show as blocked

---

## 6. Authentication tests

### 6.1 Sign up

1. Go to `/login`
2. Switch to **Sign up**
3. Create a new test user

Expected:

- account creation succeeds
- user appears in Supabase Auth users

### 6.2 Log in

1. Log in with the new user

Expected:

- redirect succeeds
- nav shows **Account**
- `/account` is accessible

### 6.3 Admin guard

1. While logged out, visit `/admin`
2. Log in with a non-admin user and try `/admin`
3. Log in with the admin allowlisted email and try `/admin`

Expected:

- logged out user is redirected
- non-admin is denied
- admin can access dashboard

---

## 7. Cart and DB persistence tests

These are the most important DB-backed tests you can do right now.

### 7.1 Guest cart

1. While logged out, add products from `/shop`
2. Open `/cart`
3. Change quantities
4. Refresh the page

Expected:

- cart count updates
- totals update
- cart survives refresh through local storage

### 7.2 Logged-in cart sync

1. Add items while logged out
2. Log in
3. Add another item while logged in
4. Open Supabase Table Editor -> `carts`

Expected:

- local cart merges into the logged-in cart
- one `carts` row exists for the user
- `cart_json` matches the visible cart contents

### 7.3 Cross-session restore

1. Log out
2. Log back in
3. Open another browser/device if possible

Expected:

- cart restores from Supabase, not just local storage

---

## 8. Storefront product tests

### 8.1 Public storefront

Check:

- `/`
- `/shop`
- `/new-arrivals`
- `/preorders`
- `/contact`

Expected:

- pages render
- products appear
- no 500s in browser console / network

### 8.2 Brand pages

Test each:

- `/grimdark-future`
- `/age-of-fantasy`
- `/pokemon`
- `/basing-battle-effects`
- `/gaming-accessories-terrain`

Expected:

- themed hero loads
- correct filters appear for the brand
- products display
- add-to-cart works

### 8.3 Faction pages

Check at least:

- `/shop/space-marines`
- `/shop/orks`
- `/shop/pokemon`

Expected:

- only matching products appear
- breadcrumb works
- product counts make sense

---

## 9. Admin product CRUD tests

Log in as admin first.

### 9.1 Product list

Visit `/admin/products`

Expected:

- table renders
- products are listed

### 9.2 Create product

1. Click **New Product**
2. Fill the form
3. Save

Expected:

- product appears in admin list
- product appears on storefront after revalidation window

### 9.3 Edit product

1. Edit an existing product
2. Change name or price
3. Save

Expected:

- admin list updates
- storefront updates after revalidation

### 9.4 Activate / deactivate / delete

Expected:

- deactivated product disappears from public storefront
- activated product reappears
- deleted product is removed from DB and admin list

---

## 10. Admin orders and analytics tests

You can still do limited validation even before payment testing.

### 10.1 Orders page

Visit `/admin/orders`

Expected:

- page loads
- empty state or existing rows display correctly
- filters render

### 10.2 Analytics page

Visit `/admin/analytics`

Expected:

- KPI cards render
- tables render without crashing

Note: revenue accuracy cannot be fully validated until real paid orders exist.

---

## 11. Image storage tests

### 11.1 Valid image upload

1. Upload a product image through the admin form

Expected:

- upload succeeds
- image URL is saved
- image appears on storefront
- file appears in Supabase Storage bucket `product-images`

### 11.2 Oversized upload

1. Try a file larger than 5 MB

Expected:

- upload is rejected
- clear error message is shown

---

## 12. What to skip for now

Skip this section until you are ready to do payment work:

- hosted Yoco checkout
- webhook verification
- payment success / cancelled flow
- order confirmation email delivery

These depend on:

- real `PAYMENT_WEBHOOK_SECRET`
- public webhook URL
- optional `RESEND_API_KEY`

---

## 13. Exit criteria for the current phase

You can call the **database and app setup phase complete** when all of these are true:

- [ ] DB sanity checks all pass
- [ ] local app smoke test passes
- [ ] sign-up and login work
- [ ] cart persists for guest users
- [ ] cart syncs to Supabase for logged-in users
- [ ] admin can view products
- [ ] admin can create, edit, deactivate, and delete products
- [ ] admin orders and analytics pages load without errors
- [ ] image upload works

You should **not** call the full site complete yet unless the deferred payment/email/art tasks are also done.

