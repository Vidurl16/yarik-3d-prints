-- migration_postnet_details.sql
-- Adds postnet_details column to orders table for PostNet delivery orders.
-- DO NOT execute automatically — owner runs this manually in Supabase SQL Editor.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS postnet_details jsonb;

COMMENT ON COLUMN orders.postnet_details IS 'PostNet branch name, PostNet number, and email for PostNet delivery orders. Null for non-PostNet orders.';
