-- Migration: add stock_quantity to products
-- Apply in: Supabase Dashboard → SQL Editor → Run
--
-- NULL  = unlimited stock (default for all existing products)
-- 0     = out of stock
-- N > 0 = N units remaining

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT NULL;

COMMENT ON COLUMN products.stock_quantity IS
  'NULL = unlimited. 0 = out of stock. Positive integer = units remaining. Decremented by webhook on paid order.';
