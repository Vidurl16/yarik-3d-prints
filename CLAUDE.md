## Project Overview
A production-ready POC for a Warhammer 40K 3D printing e-commerce store.
Deployed to a subdomain of vidur.co.za (e.g. yarik.vidur.co.za) via CNAME.
Goal: impress client Yarik and convince him to go custom (Medusa.js + Stripe) over WordPress.

## Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Payments**: Stripe (test mode — no real charges)
- **Deployment**: Vercel (free tier) — CNAME yarik.vidur.co.za → vercel deployment URL
- **Images**: Next/Image with placeholder product images from picsum.photos
- **State**: Zustand for cart state (persisted to localStorage)
- **Animations**: Framer Motion

## Deployment Instructions (for agent to follow after build)
1. `git init` and push to a GitHub repo
2. Connect repo to Vercel (vercel.com → Import Project)
3. Vercel will auto-detect Next.js and deploy
4. In Vercel project settings → Domains → Add `yarik.vidur.co.za`
5. Vercel will provide a CNAME value (e.g. `cname.vercel-dns.com`)
6. Add that CNAME in Host Africa DNS for vidur.co.za:
   - Type: CNAME
   - Name: yarik
   - Value: (provided by Vercel)
7. Site goes live at yarik.vidur.co.za within ~15 min

## Aesthetic Rules — NON NEGOTIABLE
- Background: void black `#0a0a0a`
- Accents: blood red `#8b0000`, aged gold `#c9a84c`
- Fonts: Cinzel Decorative (headings), Rajdhani (body) — load via next/font/google
- Feel: dark, gritty, gothic industrial — like Games Workshop meets luxury streetwear
- NEVER use: Inter, Roboto, purple gradients, white backgrounds, generic layouts
- Noise texture overlay on all pages (SVG filter or CSS)
- Subtle animated geometric cog on hero (CSS keyframes)

## Project Structure
```
/app
  /page.tsx              → Hero landing page
  /shop/page.tsx         → Faction grid
  /shop/[faction]/page.tsx → Faction product listing
  /builder/page.tsx      → Part selector / bundle builder
  /cart/page.tsx         → Cart + checkout preview
  /layout.tsx            → Root layout with nav + cart provider
/components
  /Nav.tsx
  /CartDrawer.tsx
  /FactionCard.tsx
  /ProductCard.tsx
  /BundleBuilder.tsx
/store
  /cartStore.ts          → Zustand cart store with localStorage persistence
/lib
  /products.ts           → All hardcoded product/faction data
  /stripe.ts             → Stripe test mode checkout session creator
```

## Pages Required

### 1. Hero (/)
- Full viewport dark hero
- Animated rotating cog watermark (CSS, very subtle)
- Red radial glow from bottom
- Headline: "FORGE YOUR ARMY" — Cinzel Decorative, massive
- Subheading: "Medical-grade resin & multicolour FDM printing. Built to battlefield standard."
- Two CTAs: SHOP BY FACTION (gold border) | BUILD A BUNDLE (blood red fill)

### 2. Faction Grid (/shop)
- 6 faction cards in a dramatic grid
- Each card: faction name, flavour text, product count, hover glow effect
- Factions:
  | Faction | Flavour Text | Color Accent |
  |---|---|---|
  | Space Marines | The Emperor's finest. Unyielding. Eternal. | cobalt + gold |
  | Orks | Brutal. Loud. Unstoppable. WAAAGH! | rust + green |
  | Tyranids | The Great Devourer consumes all. | purple + bone |
  | Chaos Space Marines | Sworn to the dark gods. Corrupted. Deadly. | corruption red |
  | Custom Projects | Your vision. Our printers. Anything goes. | steel grey |
  | Pokémon Merch | Gotta catch 'em all — in glorious resin. | yellow + white |

### 3. Faction Product Listing (/shop/[faction])
- Breadcrumb navigation
- Filter sidebar: All, Infantry, Vehicles, Characters, Terrain
- 3-column product grid
- Each product card:
  - Product name, price in ZAR (R)
  - Print type badge: RESIN / FDM / MULTICOLOUR
  - ADD TO CART button
- Space Marines products (use for all factions, vary names):
  - Intercessor Squad x5 — R350 — RESIN
  - Primaris Captain — R180 — RESIN
  - Land Raider Tank — R650 — FDM MULTICOLOUR
  - Librarian in Phobos Armour — R220 — RESIN
  - Drop Pod — R480 — FDM
  - Chapter Banner Bearer — R160 — RESIN

### 4. Bundle Builder (/builder)
- Headline: "BUILD YOUR WARBAND"
- Two columns: parts checklist (left) + live order summary (right, sticky)
- Parts list with checkboxes and individual prices
- Live JS logic:
  - Subtotal updates on every check/uncheck
  - If 3+ parts selected → apply 15% discount, show discount badge
- Ork Warband parts:
  - Ork Boyz x5 — R120
  - Ork Nob Leader — R95
  - Warbike — R180
  - Deff Dread — R320
  - Gretchin x10 — R85
  - Warboss — R210
- ADD WARBAND TO CART button adds all selected items

### 5. Cart (/cart)
- Line items with quantity controls (+/−) and remove (×)
- Live subtotal, discount line (if applicable), total in ZAR
- PROCEED TO CHECKOUT button → calls Stripe test mode checkout session API route
- Stripe test card: 4242 4242 4242 4242 (show this as a hint on the page for demo purposes)
- Empty cart state: dramatic message + CTA back to shop

## Stripe Integration
- Create `/app/api/checkout/route.ts`
- Uses Stripe test mode secret key (store in `.env.local` as `STRIPE_SECRET_KEY`)
- Creates a Stripe Checkout Session with line items from cart
- Redirects to Stripe hosted checkout
- Success URL: `/cart?success=true`
- On success URL, show order confirmation message

## Environment Variables (add to Vercel project settings)
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Business Logic
- Currency: ZAR (R) — format as `R 1,234`
- Bundle discount: 15% off when 3+ parts selected in builder
- Cart persists via Zustand + localStorage
- Nav shows live cart item count badge

## Client Context
- Client: Yarik — 3D printing business, Warhammer 40K miniatures + Pokémon merch + custom projects
- Printers: medical-grade dental resin + Bambu Lab multicolour FDM enclosed printers
- Was on Shopify (too expensive), considering WordPress
- We are pitching this custom stack as a better long-term solution
- This POC should feel more professional than anything WordPress could produce

## Do Not
- Use WordPress or WooCommerce anything
- Use class-based React components
- Commit .env.local to git
- Ask clarifying questions — make decisions and build
- Use placeholder grey boxes for images — use picsum.photos with consistent seeds per product

---

## Phase 2: Functional Production Website

### New Routes Added
- `/login` — Supabase Auth email+password login/signup (Dexarium theme)
- `/account` — User profile + order history (Dexarium theme, protected)
- `/admin` — Admin dashboard (server-protected by ADMIN_EMAIL_ALLOWLIST)
- `/admin/products` — Product list with activate/deactivate/delete
- `/admin/products/new` — Create product with image upload
- `/admin/products/[id]/edit` — Edit product
- `/admin/orders` — Orders list with date/status filters
- `/admin/analytics` — Revenue KPIs + top products tables

### New API Routes
- `POST /api/checkout` — Provider-agnostic checkout (creates Order first, then provider session)
- `POST /api/webhooks/stripe` — Stripe webhook (sets paid only after verified webhook)
- `GET /api/admin/products` — List all products (admin only)
- `POST /api/admin/products` — Create product (admin only)
- `PATCH /api/admin/products/[id]` — Update product (admin only)
- `DELETE /api/admin/products/[id]` — Delete product (admin only)
- `POST /api/admin/upload-image` — Upload product image to Supabase Storage (admin only)
- `GET /api/admin/orders` — List orders with filters (admin only)
- `GET /api/admin/analytics` — Sales analytics (admin only)
- `POST /api/admin/revalidate` — Purge ISR cache for product pages

### Payment Architecture
- `PaymentProvider` interface in `src/lib/payments/types.ts`
- `StripeProvider` adapter in `src/lib/payments/stripe.ts`
- Factory in `src/lib/payments/index.ts` — controlled by `PAYMENT_PROVIDER` env var
- Orders created with `payment_provider`, `payment_session_id`, `payment_status`, `payment_metadata`, `paid_at`
- Orders only marked `paid` after verified webhook (not on redirect)

### DB Migration
- Run `supabase/migration_phase2.sql` in Supabase SQL Editor
- Removes `stripe_session_id`, `stripe_payment_intent_id` from orders
- Adds `user_id`, `payment_provider`, `payment_session_id`, `payment_status`, `payment_event_ids`, `payment_metadata`, `paid_at`
- Adds `carts` table for user cart persistence
- Adds RLS policies for all tables
- Creates `product-images` storage bucket

### Key Files
- `src/middleware.ts` — Auth cookie refresh + admin/account route protection
- `src/lib/auth/getSession.ts` — SSR session retrieval
- `src/lib/auth/isAdmin.ts` — Admin allowlist check (server-side only)
- `src/lib/payments/` — Provider adapter interface + Stripe implementation
- `src/lib/storage/uploadImage.ts` — Image upload to Supabase Storage
- `src/store/cartStore.ts` — Cart with localStorage (guest) + Supabase sync (user)
