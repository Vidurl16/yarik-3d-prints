-- migration_fix_roles.sql
-- Corrects role values in the products table to match the Army Builder section labels exactly.
-- Run AFTER reviewing diagnostic_role_audit.sql output.
-- DO NOT execute automatically — owner runs this manually in Supabase SQL Editor.
--
-- Summary of corrections:
--   Grimdark Future: HQ → Characters, Infantry → Infantry/Mounted, Cavalry → Infantry/Mounted,
--                    Vehicle → Vehicles, Monster → Monsters, Transport → Transports
--   Age of Fantasy:  HQ → Heroes, War Machine → Warmachines, Monster → Monsters, Spell → Spells

-- Grimdark Future role corrections
UPDATE products SET role = 'Characters'       WHERE brand = 'grimdark-future' AND role = 'HQ';
UPDATE products SET role = 'Infantry/Mounted' WHERE brand = 'grimdark-future' AND role = 'Infantry';
UPDATE products SET role = 'Infantry/Mounted' WHERE brand = 'grimdark-future' AND role = 'Cavalry';
UPDATE products SET role = 'Vehicles'         WHERE brand = 'grimdark-future' AND role = 'Vehicle';
UPDATE products SET role = 'Monsters'         WHERE brand = 'grimdark-future' AND role = 'Monster';
UPDATE products SET role = 'Transports'       WHERE brand = 'grimdark-future' AND role = 'Transport';

-- Age of Fantasy role corrections
UPDATE products SET role = 'Heroes'      WHERE brand = 'age-of-fantasy' AND role = 'HQ';
UPDATE products SET role = 'Warmachines' WHERE brand = 'age-of-fantasy' AND role = 'War Machine';
UPDATE products SET role = 'Monsters'    WHERE brand = 'age-of-fantasy' AND role = 'Monster';
UPDATE products SET role = 'Spells'      WHERE brand = 'age-of-fantasy' AND role = 'Spell';
-- Infantry and Cavalry keep their names as they already match the filter labels

-- After running this migration, re-run diagnostic_role_audit.sql to verify the corrections.
