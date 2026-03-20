-- ============================================================
-- Dexarium Supabase Setup Verification
-- Run after bootstrap.sql (or after the individual schema/migration files).
-- ============================================================

-- Core tables should exist.
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('products', 'orders', 'order_items', 'carts')
ORDER BY table_name;

-- Provider-agnostic order columns should exist.
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

-- Product catalog enhancements should exist.
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'products'
  AND column_name IN ('print_type', 'faction', 'role')
ORDER BY column_name;

-- Seed catalog should be present.
SELECT COUNT(*) AS product_count FROM products;
SELECT brand, COUNT(*) AS products_per_brand
FROM products
GROUP BY brand
ORDER BY brand;

-- RLS should be enabled on all app tables.
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname IN ('products', 'orders', 'order_items', 'carts')
ORDER BY relname;
