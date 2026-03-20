# YARIK 3D Prints — QA Testing Guide

Complete manual testing checklist for the entire site. Run through every section before each production release.

---

## Prerequisites

| Item | Detail |
|---|---|
| Test account | A registered user account (non-admin) |
| Admin account | An account whose email is in `ADMIN_EMAIL_ALLOWLIST` |
| Test card | Yoco sandbox card `4111 1111 1111 1111`, exp any future, CVV `123` |
| Browser | Chrome + Firefox (mobile viewport in DevTools for mobile checks) |
| Base URL | Current Vercel Preview/Production URL (for example `https://yarik3d.co.za`) |
| Database bootstrap | Run `supabase/bootstrap.sql` for a fresh Supabase project, then `supabase/verify_setup.sql` |

---

## 1. Navigation & Header

### 1.1 Logo
- [ ] Click the logo — lands on `/`
- [ ] Logo is visible on all viewport sizes

### 1.2 Desktop Nav (≥ 1024px)
- [ ] **SHOP** dropdown opens on hover — shows all 5 brand tiles plus "VIEW ALL →"
- [ ] Each brand tile in the dropdown links to the correct brand route (e.g. `/grimdark-future`, `/pokemon`)
- [ ] "VIEW ALL →" links to `/shop`
- [ ] **NEW** links to `/new-arrivals`
- [ ] **PREORDERS** links to `/preorders`
- [ ] **ARMY BUILDER** links to `/builder`
- [ ] **CONTACT** links to `/contact`
- [ ] Login link visible when logged out; "Account" link visible when logged in
- [ ] Cart icon shows correct item count badge when items are in cart
- [ ] Clicking cart icon opens the cart drawer

### 1.3 Mobile Nav (< 1024px)
- [ ] Hamburger menu opens the mobile nav
- [ ] All links present and functional
- [ ] Menu closes after tapping a link

### 1.4 Cart Drawer
- [ ] Drawer slides in from the right when cart icon is clicked
- [ ] Shows all cart items with name, quantity, and price
- [ ] "VIEW CART" button navigates to `/cart`
- [ ] Drawer closes when clicking the backdrop or close button

---

## 2. Homepage (`/`)

- [ ] Page loads without errors
- [ ] Hero section renders with logo, headline, and two CTA buttons (`SHOP ALL` → `/shop`, `ARMY BUILDER` → `/builder`)
- [ ] 5 brand category tiles are displayed — each links to its brand route
- [ ] "NEW ARRIVALS" preview section shows up to 4 products
- [ ] "PREORDERS" preview section shows up to 4 products
- [ ] Each product card in previews shows name, price, print type badge
- [ ] No layout overflow on mobile

---

## 3. Shop Index (`/shop`)

- [ ] All 5 brand tiles render with correct name, description, and icon
- [ ] "HOME" breadcrumb link at top returns to `/`
- [ ] Hovering "HOME" breadcrumb changes colour (client component HoverLink)
- [ ] Each tile navigates to the correct brand page when clicked

---

## 4. Brand Pages (`/grimdark-future`, `/age-of-fantasy`, `/pokemon`, `/basing-battle-effects`, `/gaming-accessories-terrain`)

Run these steps for **each brand**:

### 4.1 Hero Section
- [ ] Themed hero image loads
- [ ] Brand name and tagline displayed correctly
- [ ] Theme accent colours applied (red for Grimdark, green for Fantasy, gold for Pokémon, etc.)
- [ ] "ARMY BUILDER →" button visible on brands that support it (Grimdark Future, Age of Fantasy); hidden on others
- [ ] "← ALL CATEGORIES" button links to `/`

### 4.2 Filter Bar
Verify the **correct, brand-specific** filters appear — no generic cross-brand filters:

| Brand | Expected filter tabs |
|---|---|
| Grimdark Future | Infantry · Characters · Vehicles |
| Age of Fantasy | Warbands · Cavalry · Heroes & Wizards · Monsters & Mounts |
| Pokémon | Statues · Figurines · Busts · Collections |
| Basing & Battle Effects | Bases · Scatter & Debris · Battle Effects |
| Gaming Accessories & Terrain | Terrain · Accessories |

- [ ] **"All" is always the first tab** and selected by default
- [ ] Pokémon page does **not** show "Infantry" or "Vehicles"
- [ ] Tabs with zero matching products do not appear
- [ ] Clicking a filter tab updates the product grid to show only matching products
- [ ] Product count label updates correctly when a filter is applied
- [ ] "SHOW ALL" reset button appears when a filter returns zero results
- [ ] Filter bar sticks to the top of the viewport when scrolling

### 4.3 Product Grid
- [ ] Products display in a 2-column (mobile) / 3-column (tablet) / 4-column (desktop) grid
- [ ] Each card shows: product image, name, price, print type badge (RESIN / FDM / MULTICOLOUR)
- [ ] "NEW" badge visible on new arrival products
- [ ] "PREORDER" badge visible on preorder products
- [ ] Add to cart button on each card works — cart count in header increments
- [ ] "PRODUCTS COMING SOON" placeholder shown if brand has no DB products yet

### 4.4 Add-ons & Extras Section
- [ ] Cross-sell section at bottom shows 2 relevant brand tiles
- [ ] Each tile links to the correct brand route

---

## 5. Shop — Faction Pages (`/shop/[faction]`)

- [ ] `/shop/grimdark-future` loads all Grimdark products
- [ ] `/shop/pokemon` loads all Pokémon products — shows Statues / Figurines / Busts / Collections filters (not Infantry)
- [ ] `/shop/space-marines` loads only Space Marines products
- [ ] Breadcrumb: HOME › SHOP › [Faction Name]
- [ ] Breadcrumb links work correctly
- [ ] Product count shown in hero (`X Models Available`)
- [ ] Faction sub-filter chips render for site categories (decorative, shows which factions are present)
- [ ] Filter buttons only appear for categories that have products in the current set
- [ ] Add to cart works from product cards

---

## 6. New Arrivals (`/new-arrivals`)

- [ ] Page loads and shows only products flagged as new arrivals
- [ ] Each card has a "NEW" badge
- [ ] Add to cart works

---

## 7. Preorders (`/preorders`)

- [ ] Page loads and shows only preorder products
- [ ] Each card shows expected date (e.g. "Available May 2025")
- [ ] "RESERVE" button links to `/contact`

---

## 8. Army Builder — Brand-scoped (`/[brand]/army-builder`)

Available at `/grimdark-future/army-builder` and `/age-of-fantasy/army-builder`.

- [ ] Page loads the `ArmyBuilderClient` component
- [ ] Only units from the relevant brand are shown (no cross-brand mixing)
- [ ] Units can be selected / deselected
- [ ] Basing upsell options appear below unit list
- [ ] "ADD TO CART" adds the whole bundle to the cart
- [ ] Navigating to `/pokemon/army-builder` — confirm it either redirects or shows a sensible fallback (army builder is only valid for wargaming brands)

---

## 9. Global Army Builder (`/builder`)

- [ ] Page loads the `BundleBuilder` component
- [ ] Multiple factions available to browse
- [ ] Select fewer than 3 units — **no** discount shown
- [ ] Select 3 or more units — **15% warband discount** activates and is displayed
- [ ] "ADD BUNDLE TO CART" button works
- [ ] Cart reflects correct discounted price

---

## 10. Cart (`/cart`)

### 10.1 Empty Cart
- [ ] Shows "YOUR CART IS EMPTY" message with link back to shop

### 10.2 Populated Cart
- [ ] All items listed with name, quantity, and line total
- [ ] `+` button increases quantity; `-` decreases; at 1, `-` removes item
- [ ] Trash / remove button removes item completely
- [ ] Subtotal updates correctly when quantities change
- [ ] 3+ items → **15% bundle discount** line item appears and reduces total
- [ ] Order summary shows correct final total

### 10.3 Checkout Flow
- [ ] Fill in email field (shown for guest users)
- [ ] Click "PROCEED TO PAYMENT" → redirected to Yoco payment page
- [ ] Complete payment with test card `4111 1111 1111 1111`
- [ ] After successful payment, redirected back to `/cart?success=true`
- [ ] Success screen displays "Order Confirmed" message
- [ ] Cart is cleared after success
- [ ] Order confirmation email arrives in the inbox provided

### 10.4 Cancelled Payment
- [ ] On payment page, click "Cancel" / go back
- [ ] Redirected to `/cart?cancelled=true`
- [ ] Banner shows payment-cancelled message
- [ ] Cart items are still present

---

## 11. Contact Page (`/contact`)

- [ ] Page loads with email address and WhatsApp number
- [ ] Email link (`mailto:`) opens mail client
- [ ] WhatsApp link opens WhatsApp (or `wa.me` URL) with correct number
- [ ] Enquiry types listed (custom orders, bulk, etc.)
- [ ] CTA to army builder present and functional

---

## 12. Authentication

### 12.1 Sign Up
- [ ] Go to `/login`
- [ ] Toggle to "Sign Up" mode
- [ ] Enter a new email + password (min 6 chars) → account created
- [ ] Redirected to home or `?next=` destination after success
- [ ] Confirm email arrives if Supabase email confirmation is enabled

### 12.2 Login
- [ ] Go to `/login`
- [ ] Enter valid credentials → redirected to `/` (or `?next=` param destination)
- [ ] Invalid credentials → error message displayed (no crash)
- [ ] After login, nav shows "Account" link instead of "Login"

### 12.3 Cart Merge on Login
- [ ] Add items to cart while logged out
- [ ] Log in
- [ ] Cart items from the session are preserved / merged correctly

### 12.4 Logout
- [ ] From `/account`, click "Sign Out"
- [ ] Redirected to `/`
- [ ] Nav shows "Login" again
- [ ] `/account` redirects to `/login?next=/account` when accessed logged out

---

## 13. Account Page (`/account`)

- [ ] Access `/account` while logged out → redirect to `/login?next=/account`
- [ ] Log in → redirected back to `/account`
- [ ] User email displayed
- [ ] Order history table shown (empty state if no orders)
- [ ] After completing a test checkout, the order appears in the table with status `paid`
- [ ] Status badges render correctly (paid = green, pending = amber, failed = red)

---

## 14. Admin Panel (admin account required)

### 14.1 Auth Guard
- [ ] Access `/admin` while logged out → redirect to `/login?next=/admin`
- [ ] Access `/admin` with a non-admin account → redirect to `/`
- [ ] Access `/admin` with an admin account → dashboard loads

### 14.2 Admin Dashboard (`/admin`)
- [ ] 3 tiles visible: Products, Orders, Analytics
- [ ] Each tile links to the correct sub-page

### 14.3 Products (`/admin/products`)
- [ ] Product table loads all products
- [ ] Each row shows: name, brand, price, active toggle, tags, Edit link
- [ ] **Toggle active/inactive:** click toggle — product status updates without page reload
- [ ] **Delete:** click delete on a product → confirm dialog → product removed from table
- [ ] Edit link navigates to `/admin/products/[id]/edit`

### 14.4 New Product (`/admin/products/new`)
- [ ] Form loads empty
- [ ] Fill all required fields (name, brand, price, type, tags)
- [ ] Upload an image — preview appears
- [ ] Submit → product created, appears in products list
- [ ] ISR cache revalidated — product visible on brand page within 60s

### 14.5 Edit Product (`/admin/products/[id]/edit`)
- [ ] Form pre-populated with existing product data
- [ ] Update the name → save → changes reflected in products table and on brand page
- [ ] Navigating to a non-existent ID → 404

### 14.6 Orders (`/admin/orders`)
- [ ] Orders table loads with test order visible
- [ ] **Date filter:** set a date range → click Apply → table filters correctly
- [ ] **Status filter:** filter by `paid` → only paid orders shown
- [ ] Columns: date, order ID, email, payment provider, total, status badge

### 14.7 Analytics (`/admin/analytics`)
- [ ] KPI cards load: Total Revenue, Order Count, Average Order Value
- [ ] Top 10 products by revenue table populated
- [ ] Top 10 products by quantity table populated
- [ ] **Date range filter:** change dates → Apply → KPIs and tables update

---

## 15. Webhooks & Emails

- [ ] Complete a test checkout with a real email address
- [ ] Yoco fires webhook → order status in DB changes to `paid`
- [ ] Order confirmation email received (from `orders@yarik3d.co.za`)
- [ ] Email contains: order reference ID, itemised list, total in ZAR
- [ ] Email renders correctly in Gmail and Apple Mail (dark background, gold accents)

---

## 16. Theming & CSS Variables

- [ ] **Grimdark Future** theme: dark red (`#8b0000`) accents
- [ ] **Age of Fantasy** theme: forest green (`#2a5a3a`) accents
- [ ] **Pokémon** theme: gold (`#c9a84c`) accents
- [ ] **Basing & Battle Effects** theme: earthy brown accents
- [ ] **Gaming Accessories & Terrain** theme: steel blue accents
- [ ] Theme applies correctly when navigating directly to a brand URL
- [ ] Theme does **not** bleed across to other brand pages

---

## 17. Performance & SEO

- [ ] Each page has a unique `<title>` tag
- [ ] Homepage, shop, brand pages load in < 3s on a 4G throttle (Chrome DevTools)
- [ ] Images use Next.js `<Image>` component (no layout shift)
- [ ] No console errors on any page in production
- [ ] `robots.txt` present and not blocking product pages

---

## 18. Mobile Responsiveness

Check every section above at **375px** (iPhone SE) and **768px** (iPad):

- [ ] Nav collapses to hamburger below 1024px
- [ ] Product grids reflow to 1-column (375px) / 2-column (768px)
- [ ] Filter tabs scroll horizontally without overflow
- [ ] Cart drawer fills full width on mobile
- [ ] Forms (login, checkout email) are usable with on-screen keyboard
- [ ] Army builder is scrollable and usable on mobile

---

## 19. Edge Cases

- [ ] Add the maximum quantity of a product — confirm cart handles it gracefully
- [ ] Navigate directly to `/shop/nonexistent-slug` → 404 page renders
- [ ] Navigate directly to `/nonexistent-brand` — no crash (either 404 or graceful empty state)
- [ ] Open the site with JavaScript disabled — static pages (shop index, homepage) render content
- [ ] Rapid clicking of "Add to Cart" does not create duplicate line items — quantity increments instead

---

## Sign-off

| Tester | Date | Build / Commit | Pass / Fail | Notes |
|---|---|---|---|---|
| | | | | |
