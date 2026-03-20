-- ============================================================
-- Dexarium Phase 3 Product Catalog Enhancements
-- Adds storefront metadata so all purchasable products can come from DB.
-- ============================================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS print_type text,
  ADD COLUMN IF NOT EXISTS faction text,
  ADD COLUMN IF NOT EXISTS role text;

CREATE INDEX IF NOT EXISTS products_faction_idx ON products(faction);
CREATE INDEX IF NOT EXISTS products_role_idx ON products(role);

UPDATE products
SET
  print_type = CASE slug
    WHEN 'gf-intercessor-squad' THEN 'RESIN'
    WHEN 'gf-primaris-captain' THEN 'RESIN'
    WHEN 'gf-land-raider' THEN 'MULTICOLOUR'
    WHEN 'gf-librarian-phobos' THEN 'RESIN'
    WHEN 'gf-drop-pod' THEN 'FDM'
    WHEN 'gf-ork-boyz' THEN 'RESIN'
    WHEN 'gf-warboss' THEN 'RESIN'
    WHEN 'gf-termagant-brood' THEN 'RESIN'
    WHEN 'af-spearmen-regiment' THEN 'RESIN'
    WHEN 'af-archmage-dragon' THEN 'MULTICOLOUR'
    WHEN 'af-silver-helm-cavalry' THEN 'RESIN'
    WHEN 'af-skeleton-warriors' THEN 'RESIN'
    WHEN 'af-lich-king' THEN 'RESIN'
    WHEN 'af-black-knights' THEN 'RESIN'
    WHEN 'pk-charizard-statue' THEN 'MULTICOLOUR'
    WHEN 'pk-pikachu-figurine' THEN 'RESIN'
    WHEN 'pk-mewtwo-bust' THEN 'RESIN'
    WHEN 'pk-gengar-figure' THEN 'RESIN'
    WHEN 'pk-eevee-collection' THEN 'RESIN'
    WHEN 'pk-snorlax-display' THEN 'FDM'
    WHEN 'bas-urban-rubble' THEN 'RESIN'
    WHEN 'bas-cobblestone' THEN 'RESIN'
    WHEN 'bas-lava-crater' THEN 'RESIN'
    WHEN 'bas-dead-forest' THEN 'RESIN'
    WHEN 'bas-scatter-rubble' THEN 'RESIN'
    WHEN 'bas-explosion-markers' THEN 'MULTICOLOUR'
    WHEN 'ter-gothic-building' THEN 'MULTICOLOUR'
    WHEN 'ter-industrial-pipes' THEN 'FDM'
    WHEN 'ter-trench-system' THEN 'FDM'
    WHEN 'ter-dice-tray' THEN 'RESIN'
    WHEN 'ter-token-set' THEN 'RESIN'
    WHEN 'ter-foam-insert' THEN 'FDM'
    ELSE print_type
  END,
  faction = CASE slug
    WHEN 'gf-intercessor-squad' THEN 'space-marines'
    WHEN 'gf-primaris-captain' THEN 'space-marines'
    WHEN 'gf-land-raider' THEN 'space-marines'
    WHEN 'gf-librarian-phobos' THEN 'space-marines'
    WHEN 'gf-drop-pod' THEN 'space-marines'
    WHEN 'gf-ork-boyz' THEN 'orks'
    WHEN 'gf-warboss' THEN 'orks'
    WHEN 'gf-termagant-brood' THEN 'tyranids'
    WHEN 'af-spearmen-regiment' THEN 'high-elves'
    WHEN 'af-archmage-dragon' THEN 'high-elves'
    WHEN 'af-silver-helm-cavalry' THEN 'high-elves'
    WHEN 'af-skeleton-warriors' THEN 'undead'
    WHEN 'af-lich-king' THEN 'undead'
    WHEN 'af-black-knights' THEN 'undead'
    WHEN 'pk-charizard-statue' THEN 'pokemon-merch'
    WHEN 'pk-pikachu-figurine' THEN 'pokemon-merch'
    WHEN 'pk-mewtwo-bust' THEN 'pokemon-merch'
    WHEN 'pk-gengar-figure' THEN 'pokemon-merch'
    WHEN 'pk-eevee-collection' THEN 'pokemon-merch'
    WHEN 'pk-snorlax-display' THEN 'pokemon-merch'
    ELSE faction
  END,
  role = CASE slug
    WHEN 'gf-intercessor-squad' THEN 'Battleline'
    WHEN 'gf-primaris-captain' THEN 'HQ'
    WHEN 'gf-land-raider' THEN 'Vehicles'
    WHEN 'gf-librarian-phobos' THEN 'HQ'
    WHEN 'gf-drop-pod' THEN 'Transports'
    WHEN 'gf-ork-boyz' THEN 'Battleline'
    WHEN 'gf-warboss' THEN 'HQ'
    WHEN 'gf-termagant-brood' THEN 'Battleline'
    WHEN 'af-spearmen-regiment' THEN 'Battleline'
    WHEN 'af-archmage-dragon' THEN 'HQ'
    WHEN 'af-silver-helm-cavalry' THEN 'Cavalry'
    WHEN 'af-skeleton-warriors' THEN 'Battleline'
    WHEN 'af-lich-king' THEN 'HQ'
    WHEN 'af-black-knights' THEN 'Cavalry'
    ELSE role
  END
WHERE print_type IS NULL OR faction IS NULL OR role IS NULL;
