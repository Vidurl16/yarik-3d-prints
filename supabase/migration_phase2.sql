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
