-- Phase 6: Add product description field
-- Run in Supabase SQL Editor

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS description TEXT DEFAULT NULL;
