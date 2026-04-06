-- migration_seed_tags.sql
-- Assigns tags to products based on their current role values.
-- Run AFTER reviewing the diagnostic output from diagnostic_role_audit.sql.
-- DO NOT run blindly — review and adjust role mappings below to match actual data.
--
-- Check current role values first:
--   SELECT DISTINCT role FROM products WHERE brand IN ('age-of-fantasy','grimdark-future');

-- Age of Fantasy: assign tags based on current role values
UPDATE products SET tags = ARRAY['Heroes']      WHERE brand = 'age-of-fantasy' AND role = 'HQ';
UPDATE products SET tags = ARRAY['Cavalry']     WHERE brand = 'age-of-fantasy' AND role = 'Cavalry';
UPDATE products SET tags = ARRAY['Infantry']    WHERE brand = 'age-of-fantasy' AND role IN ('Infantry', 'Battleline');
UPDATE products SET tags = ARRAY['Monsters']    WHERE brand = 'age-of-fantasy' AND role = 'Monster';
UPDATE products SET tags = ARRAY['Warmachines'] WHERE brand = 'age-of-fantasy' AND role = 'War Machine';
UPDATE products SET tags = ARRAY['Spells']      WHERE brand = 'age-of-fantasy' AND role = 'Spell';

-- Grimdark Future: assign tags based on current role values
UPDATE products SET tags = ARRAY['Characters']       WHERE brand = 'grimdark-future' AND role = 'HQ';
UPDATE products SET tags = ARRAY['Battleline']       WHERE brand = 'grimdark-future' AND role = 'Battleline';
UPDATE products SET tags = ARRAY['Infantry/Mounted'] WHERE brand = 'grimdark-future' AND role IN ('Infantry', 'Cavalry');
UPDATE products SET tags = ARRAY['Vehicles']         WHERE brand = 'grimdark-future' AND role = 'Vehicle';
UPDATE products SET tags = ARRAY['Monsters']         WHERE brand = 'grimdark-future' AND role = 'Monster';
UPDATE products SET tags = ARRAY['Transports']       WHERE brand = 'grimdark-future' AND role = 'Transport';

-- NOTE: Review and adjust role values above to match actual data in the DB.
-- Run: SELECT DISTINCT role FROM products WHERE brand IN ('age-of-fantasy','grimdark-future');
-- to see all current role values before running this migration.
