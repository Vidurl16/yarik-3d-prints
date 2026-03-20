-- Migration Phase 5: Post-launch polish
-- Run this in the Supabase SQL Editor at https://supabase.com/dashboard
-- Safe to run multiple times (IF NOT EXISTS / DO blocks used throughout)

-- 1. Stock tracking on products
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT NULL;
COMMENT ON COLUMN products.stock_quantity IS 'NULL = unlimited stock; 0 = out of stock; >0 = units available';

-- 2. Shipping address on orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address jsonb DEFAULT NULL;
COMMENT ON COLUMN orders.shipping_address IS 'JSON: {name, line1, line2, city, province, postal_code, country}';

-- 3. Preorder reservations
CREATE TABLE IF NOT EXISTS preorder_reservations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid REFERENCES products(id) ON DELETE CASCADE,
  name        text NOT NULL,
  email       text NOT NULL,
  message     text DEFAULT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for looking up reservations by product
CREATE INDEX IF NOT EXISTS idx_preorder_reservations_product_id
  ON preorder_reservations (product_id);

-- Index for looking up reservations by email
CREATE INDEX IF NOT EXISTS idx_preorder_reservations_email
  ON preorder_reservations (email);

-- Enable Row Level Security (allow public inserts, admins can read all)
ALTER TABLE preorder_reservations ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT a reservation (no auth required)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'preorder_reservations' AND policyname = 'allow_public_insert'
  ) THEN
    CREATE POLICY allow_public_insert ON preorder_reservations
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Only service_role can SELECT (admin API uses service key)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'preorder_reservations' AND policyname = 'allow_service_select'
  ) THEN
    CREATE POLICY allow_service_select ON preorder_reservations
      FOR SELECT TO service_role
      USING (true);
  END IF;
END $$;
