-- ============================================================
-- Dexarium Supabase Bootstrap
-- Fresh-project setup for an empty Supabase database.
-- Run this whole file in the Supabase SQL Editor for a brand-new project.
-- It applies the base schema, provider-agnostic payment/cart migration,
-- product-catalog enhancements, and seed catalog data.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- Dexarium Phase 1 Schema
-- ============================================================

-- Products
CREATE TABLE IF NOT EXISTS products (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  brand           text not null,
  type            text not null,
  print_type      text,
  faction         text,
  role            text,
  price_cents     integer not null,
  currency        text default 'ZAR',
  tags            text[] default '{}',
  image_url       text,
  is_preorder     boolean default false,
  is_new          boolean default false,
  is_active       boolean default true,
  preorder_date   text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

CREATE INDEX IF NOT EXISTS products_brand_idx       ON products(brand);
CREATE INDEX IF NOT EXISTS products_faction_idx     ON products(faction);
CREATE INDEX IF NOT EXISTS products_role_idx        ON products(role);
CREATE INDEX IF NOT EXISTS products_is_new_idx      ON products(is_new);
CREATE INDEX IF NOT EXISTS products_is_preorder_idx ON products(is_preorder);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id                        uuid primary key default gen_random_uuid(),
  stripe_session_id         text unique not null,
  stripe_payment_intent_id  text,
  email                     text,
  currency                  text,
  total_amount_cents        integer,
  status                    text,
  created_at                timestamptz default now()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid references orders(id) on delete cascade,
  product_id        uuid references products(id),
  name_snapshot     text,
  quantity          integer,
  unit_amount_cents integer,
  created_at        timestamptz default now()
);


-- ============================================================
-- Dexarium Phase 2 Migration
-- Provider-agnostic payments, auth, cart persistence, admin
-- ============================================================

-- ─── Extend orders table ─────────────────────────────────────
-- Drop old stripe-specific columns and add provider-agnostic ones.
-- Run this in Supabase SQL Editor.

-- 1) Remove stripe-specific columns
ALTER TABLE orders DROP COLUMN IF EXISTS stripe_session_id;
ALTER TABLE orders DROP COLUMN IF EXISTS stripe_payment_intent_id;

-- 2) Add provider-agnostic payment columns
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS user_id           uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS payment_provider  text,
  ADD COLUMN IF NOT EXISTS payment_session_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS payment_status    text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_event_ids text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS payment_metadata  jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS paid_at           timestamptz;

CREATE INDEX IF NOT EXISTS orders_user_id_idx          ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_payment_session_idx  ON orders(payment_session_id);
CREATE INDEX IF NOT EXISTS orders_payment_status_idx   ON orders(payment_status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx       ON orders(created_at);

-- ─── Carts table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carts (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  cart_json  jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

-- ─── RLS: Enable ────────────────────────────────────────────
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts      ENABLE ROW LEVEL SECURITY;

-- ─── RLS: Products ───────────────────────────────────────────
-- Public can read active products
DROP POLICY IF EXISTS "products_public_read" ON products;
CREATE POLICY "products_public_read"
  ON products FOR SELECT
  USING (is_active = true);

-- Service role has full access (bypasses RLS automatically)

-- ─── RLS: Orders ─────────────────────────────────────────────
-- Logged-in users can read their own orders
DROP POLICY IF EXISTS "orders_user_read_own" ON orders;
CREATE POLICY "orders_user_read_own"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- ─── RLS: Order Items ────────────────────────────────────────
-- Users can read items for their own orders
DROP POLICY IF EXISTS "order_items_user_read_own" ON order_items;
CREATE POLICY "order_items_user_read_own"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND o.user_id = auth.uid()
    )
  );

-- ─── RLS: Carts ──────────────────────────────────────────────
DROP POLICY IF EXISTS "carts_user_read_own" ON carts;
CREATE POLICY "carts_user_read_own"
  ON carts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "carts_user_write_own" ON carts;
CREATE POLICY "carts_user_write_own"
  ON carts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Supabase Storage: product-images bucket ─────────────────
-- Note: buckets are usually created via dashboard or API.
-- This SQL is for reference; run in SQL Editor or via Supabase CLI.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: public read
DROP POLICY IF EXISTS "product_images_public_read" ON storage.objects;
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Storage RLS: only service role can insert/update/delete (handled server-side)

-- ─── Helper: updated_at trigger ──────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- Dexarium Phase 3 Product Catalog Enhancements
-- Adds storefront metadata so all purchasable products can come from DB.
-- ============================================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS print_type text,
  ADD COLUMN IF NOT EXISTS faction text,
  ADD COLUMN IF NOT EXISTS role text;

CREATE INDEX IF NOT EXISTS products_faction_idx ON products(faction);
CREATE INDEX IF NOT EXISTS products_role_idx ON products(role);

UPDATE products
SET
  print_type = CASE slug
    WHEN 'gf-intercessor-squad' THEN 'RESIN'
    WHEN 'gf-primaris-captain' THEN 'RESIN'
    WHEN 'gf-land-raider' THEN 'MULTICOLOUR'
    WHEN 'gf-librarian-phobos' THEN 'RESIN'
    WHEN 'gf-drop-pod' THEN 'FDM'
    WHEN 'gf-ork-boyz' THEN 'RESIN'
    WHEN 'gf-warboss' THEN 'RESIN'
    WHEN 'gf-termagant-brood' THEN 'RESIN'
    WHEN 'af-spearmen-regiment' THEN 'RESIN'
    WHEN 'af-archmage-dragon' THEN 'MULTICOLOUR'
    WHEN 'af-silver-helm-cavalry' THEN 'RESIN'
    WHEN 'af-skeleton-warriors' THEN 'RESIN'
    WHEN 'af-lich-king' THEN 'RESIN'
    WHEN 'af-black-knights' THEN 'RESIN'
    WHEN 'pk-charizard-statue' THEN 'MULTICOLOUR'
    WHEN 'pk-pikachu-figurine' THEN 'RESIN'
    WHEN 'pk-mewtwo-bust' THEN 'RESIN'
    WHEN 'pk-gengar-figure' THEN 'RESIN'
    WHEN 'pk-eevee-collection' THEN 'RESIN'
    WHEN 'pk-snorlax-display' THEN 'FDM'
    WHEN 'bas-urban-rubble' THEN 'RESIN'
    WHEN 'bas-cobblestone' THEN 'RESIN'
    WHEN 'bas-lava-crater' THEN 'RESIN'
    WHEN 'bas-dead-forest' THEN 'RESIN'
    WHEN 'bas-scatter-rubble' THEN 'RESIN'
    WHEN 'bas-explosion-markers' THEN 'MULTICOLOUR'
    WHEN 'ter-gothic-building' THEN 'MULTICOLOUR'
    WHEN 'ter-industrial-pipes' THEN 'FDM'
    WHEN 'ter-trench-system' THEN 'FDM'
    WHEN 'ter-dice-tray' THEN 'RESIN'
    WHEN 'ter-token-set' THEN 'RESIN'
    WHEN 'ter-foam-insert' THEN 'FDM'
    ELSE print_type
  END,
  faction = CASE slug
    WHEN 'gf-intercessor-squad' THEN 'space-marines'
    WHEN 'gf-primaris-captain' THEN 'space-marines'
    WHEN 'gf-land-raider' THEN 'space-marines'
    WHEN 'gf-librarian-phobos' THEN 'space-marines'
    WHEN 'gf-drop-pod' THEN 'space-marines'
    WHEN 'gf-ork-boyz' THEN 'orks'
    WHEN 'gf-warboss' THEN 'orks'
    WHEN 'gf-termagant-brood' THEN 'tyranids'
    WHEN 'af-spearmen-regiment' THEN 'high-elves'
    WHEN 'af-archmage-dragon' THEN 'high-elves'
    WHEN 'af-silver-helm-cavalry' THEN 'high-elves'
    WHEN 'af-skeleton-warriors' THEN 'undead'
    WHEN 'af-lich-king' THEN 'undead'
    WHEN 'af-black-knights' THEN 'undead'
    WHEN 'pk-charizard-statue' THEN 'pokemon-merch'
    WHEN 'pk-pikachu-figurine' THEN 'pokemon-merch'
    WHEN 'pk-mewtwo-bust' THEN 'pokemon-merch'
    WHEN 'pk-gengar-figure' THEN 'pokemon-merch'
    WHEN 'pk-eevee-collection' THEN 'pokemon-merch'
    WHEN 'pk-snorlax-display' THEN 'pokemon-merch'
    ELSE faction
  END,
  role = CASE slug
    WHEN 'gf-intercessor-squad' THEN 'Battleline'
    WHEN 'gf-primaris-captain' THEN 'HQ'
    WHEN 'gf-land-raider' THEN 'Vehicles'
    WHEN 'gf-librarian-phobos' THEN 'HQ'
    WHEN 'gf-drop-pod' THEN 'Transports'
    WHEN 'gf-ork-boyz' THEN 'Battleline'
    WHEN 'gf-warboss' THEN 'HQ'
    WHEN 'gf-termagant-brood' THEN 'Battleline'
    WHEN 'af-spearmen-regiment' THEN 'Battleline'
    WHEN 'af-archmage-dragon' THEN 'HQ'
    WHEN 'af-silver-helm-cavalry' THEN 'Cavalry'
    WHEN 'af-skeleton-warriors' THEN 'Battleline'
    WHEN 'af-lich-king' THEN 'HQ'
    WHEN 'af-black-knights' THEN 'Cavalry'
    ELSE role
  END
WHERE print_type IS NULL OR faction IS NULL OR role IS NULL;


-- ============================================================
-- Dexarium Phase 1 Seed Data
-- At least 3 products per brand. Repeatable (uses INSERT ... ON CONFLICT DO NOTHING).
-- ============================================================

INSERT INTO products (slug, name, brand, type, price_cents, tags, image_url, is_new, is_preorder, preorder_date)
VALUES

-- ── GRIMDARK FUTURE ─────────────────────────────────────────
('gf-intercessor-squad',   'Intercessor Squad ×5',          'grimdark-future', 'infantry',  35000, ARRAY['Infantry','Battleline','bolter','power-armour'], NULL, true,  false, NULL),
('gf-primaris-captain',    'Primaris Captain',               'grimdark-future', 'character', 18000, ARRAY['Character','HQ','leader'],                       NULL, false, false, NULL),
('gf-land-raider',         'Land Raider Tank',               'grimdark-future', 'vehicle',   65000, ARRAY['Vehicle','tank','transport','heavy'],             NULL, false, false, NULL),
('gf-librarian-phobos',    'Librarian in Phobos Armour',     'grimdark-future', 'character', 22000, ARRAY['Character','HQ','psyker','elite'],                NULL, false, false, NULL),
('gf-drop-pod',            'Drop Pod',                       'grimdark-future', 'vehicle',   48000, ARRAY['Vehicle','Transports','transport','deployment'],  NULL, false, false, NULL),
('gf-ork-boyz',            'Ork Boyz ×10',                   'grimdark-future', 'infantry',  35000, ARRAY['Infantry','Battleline','greenskin'],              NULL, true,  false, NULL),
('gf-warboss',             'Warboss',                        'grimdark-future', 'character', 21000, ARRAY['Character','HQ','leader','greenskin'],            NULL, false, false, NULL),
('gf-termagant-brood',     'Termagant Brood ×10',            'grimdark-future', 'infantry',  35000, ARRAY['Infantry','Battleline','swarm','xenos'],          NULL, true,  false, NULL),

-- ── AGE OF FANTASY ──────────────────────────────────────────
('af-spearmen-regiment',   'Spearmen Regiment ×10',          'age-of-fantasy',  'infantry',  32000, ARRAY['Infantry','Battleline','spear','elves'],          NULL, true,  false, NULL),
('af-archmage-dragon',     'Archmage on Dragon',             'age-of-fantasy',  'vehicle',   78000, ARRAY['Vehicle','Character','HQ','dragon','magic'],      NULL, false, true,  'May 2025'),
('af-silver-helm-cavalry', 'Silver Helm Cavalry ×5',         'age-of-fantasy',  'infantry',  42000, ARRAY['Cavalry','elite','elves'],                       NULL, false, false, NULL),
('af-skeleton-warriors',   'Skeleton Warriors ×20',          'age-of-fantasy',  'infantry',  28000, ARRAY['Infantry','Battleline','undead','skeleton'],      NULL, false, false, NULL),
('af-lich-king',           'Lich King',                      'age-of-fantasy',  'character', 34000, ARRAY['Character','HQ','magic','undead'],                NULL, false, true,  'June 2025'),
('af-black-knights',       'Black Knights ×5',               'age-of-fantasy',  'infantry',  46000, ARRAY['Cavalry','undead','elite'],                      NULL, true,  false, NULL),

-- ── POKEMON ─────────────────────────────────────────────────
('pk-charizard-statue',    'Charizard Statue',               'pokemon',         'character', 65000, ARRAY['Character','fire','dragon','statue'],             NULL, true,  false, NULL),
('pk-pikachu-figurine',    'Pikachu Figurine',               'pokemon',         'character', 18000, ARRAY['Character','electric','cute'],                   NULL, false, false, NULL),
('pk-mewtwo-bust',         'Mewtwo Bust',                    'pokemon',         'character', 35000, ARRAY['Character','psychic','legendary'],                NULL, false, false, NULL),
('pk-gengar-figure',       'Gengar Figure',                  'pokemon',         'character', 22000, ARRAY['Character','ghost'],                             NULL, false, false, NULL),
('pk-eevee-collection',    'Eevee Collection Set',           'pokemon',         'character', 42000, ARRAY['Character','collection','set'],                  NULL, false, true,  'April 2025'),
('pk-snorlax-display',     'Snorlax Display',                'pokemon',         'character', 48000, ARRAY['Character','display'],                           NULL, true,  false, NULL),

-- ── BASING & BATTLE EFFECTS ─────────────────────────────────
('bas-urban-rubble',       'Urban Rubble Base Set ×5 (32mm)', 'basing-battle-effects', 'terrain', 12000, ARRAY['Terrain','base','urban','32mm'],            NULL, false, false, NULL),
('bas-cobblestone',        'Cobblestone Base Set ×5 (32mm)', 'basing-battle-effects', 'terrain', 11000, ARRAY['Terrain','base','cobblestone','32mm'],        NULL, false, false, NULL),
('bas-lava-crater',        'Lava Crater Base Set ×5 (40mm)', 'basing-battle-effects', 'terrain', 15000, ARRAY['Terrain','base','lava','40mm'],               NULL, true,  false, NULL),
('bas-dead-forest',        'Dead Forest Base Set ×5 (50mm)', 'basing-battle-effects', 'terrain', 18000, ARRAY['Terrain','base','nature','50mm'],             NULL, false, false, NULL),
('bas-scatter-rubble',     'Scatter Rubble & Debris Set',    'basing-battle-effects', 'terrain',  9500, ARRAY['Terrain','scatter','debris'],                NULL, false, false, NULL),
('bas-explosion-markers',  'Battle Effects Explosion ×3',    'basing-battle-effects', 'terrain', 14000, ARRAY['Terrain','marker','explosion','effects'],     NULL, true,  false, NULL),

-- ── GAMING ACCESSORIES & TERRAIN ────────────────────────────
('ter-gothic-building',    'Ruined Gothic Building',         'gaming-accessories-terrain', 'terrain',  65000, ARRAY['Terrain','gothic','ruin'],           NULL, false, false, NULL),
('ter-industrial-pipes',   'Industrial Pipes & Walkways',    'gaming-accessories-terrain', 'terrain',  48000, ARRAY['Terrain','industrial','modular'],    NULL, true,  false, NULL),
('ter-trench-system',      'Trench System Modular Set',      'gaming-accessories-terrain', 'terrain',  56000, ARRAY['Terrain','trench','modular'],        NULL, false, false, NULL),
('ter-dice-tray',          'Custom Dice Tray',               'gaming-accessories-terrain', 'terrain',  22000, ARRAY['Terrain','accessory','dice','tray'], NULL, false, false, NULL),
('ter-token-set',          'Magnetised Token Set ×20',       'gaming-accessories-terrain', 'terrain',  16000, ARRAY['Terrain','accessory','token'],       NULL, false, false, NULL),
('ter-foam-insert',        'Army Transport Foam Insert',     'gaming-accessories-terrain', 'terrain',  34000, ARRAY['Terrain','accessory','transport'],   NULL, false, true,  'May 2025')

ON CONFLICT (slug) DO NOTHING;

UPDATE products
SET
  print_type = CASE slug
    WHEN 'gf-intercessor-squad' THEN 'RESIN'
    WHEN 'gf-primaris-captain' THEN 'RESIN'
    WHEN 'gf-land-raider' THEN 'MULTICOLOUR'
    WHEN 'gf-librarian-phobos' THEN 'RESIN'
    WHEN 'gf-drop-pod' THEN 'FDM'
    WHEN 'gf-ork-boyz' THEN 'RESIN'
    WHEN 'gf-warboss' THEN 'RESIN'
    WHEN 'gf-termagant-brood' THEN 'RESIN'
    WHEN 'af-spearmen-regiment' THEN 'RESIN'
    WHEN 'af-archmage-dragon' THEN 'MULTICOLOUR'
    WHEN 'af-silver-helm-cavalry' THEN 'RESIN'
    WHEN 'af-skeleton-warriors' THEN 'RESIN'
    WHEN 'af-lich-king' THEN 'RESIN'
    WHEN 'af-black-knights' THEN 'RESIN'
    WHEN 'pk-charizard-statue' THEN 'MULTICOLOUR'
    WHEN 'pk-pikachu-figurine' THEN 'RESIN'
    WHEN 'pk-mewtwo-bust' THEN 'RESIN'
    WHEN 'pk-gengar-figure' THEN 'RESIN'
    WHEN 'pk-eevee-collection' THEN 'RESIN'
    WHEN 'pk-snorlax-display' THEN 'FDM'
    WHEN 'bas-urban-rubble' THEN 'RESIN'
    WHEN 'bas-cobblestone' THEN 'RESIN'
    WHEN 'bas-lava-crater' THEN 'RESIN'
    WHEN 'bas-dead-forest' THEN 'RESIN'
    WHEN 'bas-scatter-rubble' THEN 'RESIN'
    WHEN 'bas-explosion-markers' THEN 'MULTICOLOUR'
    WHEN 'ter-gothic-building' THEN 'MULTICOLOUR'
    WHEN 'ter-industrial-pipes' THEN 'FDM'
    WHEN 'ter-trench-system' THEN 'FDM'
    WHEN 'ter-dice-tray' THEN 'RESIN'
    WHEN 'ter-token-set' THEN 'RESIN'
    WHEN 'ter-foam-insert' THEN 'FDM'
    ELSE print_type
  END,
  faction = CASE slug
    WHEN 'gf-intercessor-squad' THEN 'space-marines'
    WHEN 'gf-primaris-captain' THEN 'space-marines'
    WHEN 'gf-land-raider' THEN 'space-marines'
    WHEN 'gf-librarian-phobos' THEN 'space-marines'
    WHEN 'gf-drop-pod' THEN 'space-marines'
    WHEN 'gf-ork-boyz' THEN 'orks'
    WHEN 'gf-warboss' THEN 'orks'
    WHEN 'gf-termagant-brood' THEN 'tyranids'
    WHEN 'af-spearmen-regiment' THEN 'high-elves'
    WHEN 'af-archmage-dragon' THEN 'high-elves'
    WHEN 'af-silver-helm-cavalry' THEN 'high-elves'
    WHEN 'af-skeleton-warriors' THEN 'undead'
    WHEN 'af-lich-king' THEN 'undead'
    WHEN 'af-black-knights' THEN 'undead'
    WHEN 'pk-charizard-statue' THEN 'pokemon-merch'
    WHEN 'pk-pikachu-figurine' THEN 'pokemon-merch'
    WHEN 'pk-mewtwo-bust' THEN 'pokemon-merch'
    WHEN 'pk-gengar-figure' THEN 'pokemon-merch'
    WHEN 'pk-eevee-collection' THEN 'pokemon-merch'
    WHEN 'pk-snorlax-display' THEN 'pokemon-merch'
    ELSE faction
  END,
  role = CASE slug
    WHEN 'gf-intercessor-squad' THEN 'Battleline'
    WHEN 'gf-primaris-captain' THEN 'HQ'
    WHEN 'gf-land-raider' THEN 'Vehicles'
    WHEN 'gf-librarian-phobos' THEN 'HQ'
    WHEN 'gf-drop-pod' THEN 'Transports'
    WHEN 'gf-ork-boyz' THEN 'Battleline'
    WHEN 'gf-warboss' THEN 'HQ'
    WHEN 'gf-termagant-brood' THEN 'Battleline'
    WHEN 'af-spearmen-regiment' THEN 'Battleline'
    WHEN 'af-archmage-dragon' THEN 'HQ'
    WHEN 'af-silver-helm-cavalry' THEN 'Cavalry'
    WHEN 'af-skeleton-warriors' THEN 'Battleline'
    WHEN 'af-lich-king' THEN 'HQ'
    WHEN 'af-black-knights' THEN 'Cavalry'
    ELSE role
  END
WHERE TRUE;

INSERT INTO products (
  slug, name, brand, type, print_type, faction, role, price_cents, tags, image_url, is_new, is_preorder, preorder_date
)
VALUES
('gf-chapter-banner-bearer', 'Chapter Banner Bearer', 'grimdark-future', 'character', 'RESIN', 'space-marines', 'Support', 16000, ARRAY['Character','support'], NULL, false, false, NULL),
('gf-battlewagon', 'Battlewagon', 'grimdark-future', 'vehicle', 'MULTICOLOUR', 'orks', 'Vehicles', 65000, ARRAY['Vehicle','tank','heavy','looted'], NULL, false, false, NULL),
('gf-weirdboy-warphead', 'Weirdboy Warphead', 'grimdark-future', 'character', 'RESIN', 'orks', 'HQ', 22000, ARRAY['Character','HQ','psyker','greenskin'], NULL, false, false, NULL),
('gf-looted-wagon', 'Looted Wagon', 'grimdark-future', 'vehicle', 'FDM', 'orks', 'Transports', 48000, ARRAY['Vehicle','transport','looted'], NULL, false, false, NULL),
('gf-nob-banner', 'Nob with Waaagh Banner', 'grimdark-future', 'character', 'RESIN', 'orks', 'Support', 16000, ARRAY['Character','support','greenskin'], NULL, false, false, NULL),
('gf-hive-tyrant', 'Hive Tyrant', 'grimdark-future', 'character', 'MULTICOLOUR', 'tyranids', 'HQ', 62000, ARRAY['Character','HQ','monster','xenos'], NULL, false, false, NULL),
('gf-tyrannofex', 'Tyrannofex', 'grimdark-future', 'vehicle', 'FDM', 'tyranids', 'Vehicles', 48000, ARRAY['Vehicle','monster','heavy','xenos'], NULL, false, false, NULL),
('gf-broodlord', 'Broodlord', 'grimdark-future', 'character', 'RESIN', 'tyranids', 'HQ', 22000, ARRAY['Character','HQ','elite','xenos'], NULL, false, false, NULL),
('gf-trygon-prime', 'Trygon Prime', 'grimdark-future', 'vehicle', 'RESIN', 'tyranids', 'Vehicles', 45000, ARRAY['Vehicle','monster','deepstrike','xenos'], NULL, false, false, NULL),
('gf-venomthrope', 'Venomthrope', 'grimdark-future', 'character', 'RESIN', 'tyranids', 'Support', 16000, ARRAY['Character','support','xenos'], NULL, false, false, NULL),
('gf-chaos-legionaries', 'Chaos Legionaries ×5', 'grimdark-future', 'infantry', 'RESIN', 'chaos-space-marines', 'Battleline', 35000, ARRAY['Infantry','Battleline','chaos','power-armour'], NULL, false, false, NULL),
('gf-chaos-lord', 'Chaos Lord', 'grimdark-future', 'character', 'RESIN', 'chaos-space-marines', 'HQ', 18000, ARRAY['Character','HQ','leader','chaos'], NULL, false, false, NULL),
('gf-chaos-rhino', 'Chaos Rhino', 'grimdark-future', 'vehicle', 'FDM', 'chaos-space-marines', 'Transports', 48000, ARRAY['Vehicle','transport','chaos'], NULL, false, false, NULL),
('gf-chaos-sorcerer', 'Sorcerer in Terminator Armour', 'grimdark-future', 'character', 'RESIN', 'chaos-space-marines', 'HQ', 22000, ARRAY['Character','HQ','psyker','chaos'], NULL, false, false, NULL),
('gf-chaos-predator', 'Chaos Predator', 'grimdark-future', 'vehicle', 'MULTICOLOUR', 'chaos-space-marines', 'Vehicles', 65000, ARRAY['Vehicle','tank','heavy','chaos'], NULL, false, false, NULL),
('gf-dark-apostle', 'Dark Apostle', 'grimdark-future', 'character', 'RESIN', 'chaos-space-marines', 'Support', 16000, ARRAY['Character','support','chaos'], NULL, false, false, NULL),
('af-white-lions', 'White Lions ×10', 'age-of-fantasy', 'infantry', 'RESIN', 'high-elves', 'Infantry', 38000, ARRAY['Infantry','elite','elves'], NULL, false, false, NULL),
('af-eagle-chariot', 'Eagle Chariot', 'age-of-fantasy', 'vehicle', 'MULTICOLOUR', 'high-elves', 'Vehicles', 56000, ARRAY['Vehicle','chariot','fast'], NULL, false, false, NULL),
('af-loremaster-hoeth', 'Loremaster of Hoeth', 'age-of-fantasy', 'character', 'RESIN', 'high-elves', 'Support', 24000, ARRAY['Character','magic','support'], NULL, false, false, NULL),
('af-zombie-dragon', 'Zombie Dragon', 'age-of-fantasy', 'vehicle', 'MULTICOLOUR', 'undead', 'Vehicles', 72000, ARRAY['Vehicle','monster','dragon','undead'], NULL, false, false, NULL),
('af-spirit-hosts', 'Spirit Hosts ×3', 'age-of-fantasy', 'infantry', 'RESIN', 'undead', 'Support', 18000, ARRAY['Infantry','support','spirit','undead'], NULL, false, false, NULL),
('af-necromancer', 'Necromancer', 'age-of-fantasy', 'character', 'RESIN', 'undead', 'Support', 16000, ARRAY['Character','magic','support','undead'], NULL, false, false, NULL)
ON CONFLICT (slug) DO NOTHING;
