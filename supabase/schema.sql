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
