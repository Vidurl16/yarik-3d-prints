-- diagnostic_role_audit.sql
-- Run this to audit current role values per brand before running migration_fix_roles.sql.
-- DO NOT execute automatically — owner runs this manually in Supabase SQL Editor.

-- See all current role values per brand
SELECT brand, role, COUNT(*) as product_count
FROM products
WHERE brand IN ('grimdark-future', 'age-of-fantasy')
GROUP BY brand, role
ORDER BY brand, role;

-- Expected roles for Grimdark Future (after migration):
-- Characters, Battleline, Infantry/Mounted, Vehicles, Monsters, Transports

-- Expected roles for Age of Fantasy (after migration):
-- Heroes, Cavalry, Infantry, Monsters, Warmachines, Spells

-- Products with NULL or empty role (will fall into "Other" group in Army Builder):
SELECT id, name, brand, role
FROM products
WHERE brand IN ('grimdark-future', 'age-of-fantasy')
  AND (role IS NULL OR role = '');
