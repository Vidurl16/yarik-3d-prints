-- Run this in Supabase Dashboard → SQL Editor
-- Creates the preorder_reservations table and adds shipping_address to orders

-- Preorder reservations: tracks who reserved what
CREATE TABLE IF NOT EXISTS preorder_reservations (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  message     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_preorder_reservations_product
  ON preorder_reservations (product_id);

CREATE INDEX IF NOT EXISTS idx_preorder_reservations_email
  ON preorder_reservations (email);

-- Unique: one reservation per email per product (idempotent reserve)
CREATE UNIQUE INDEX IF NOT EXISTS idx_preorder_reservations_unique
  ON preorder_reservations (product_id, email);

-- Enable RLS (service role bypasses it; anon cannot read reservations)
ALTER TABLE preorder_reservations ENABLE ROW LEVEL SECURITY;

-- Shipping address column for orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shipping_address JSONB;
