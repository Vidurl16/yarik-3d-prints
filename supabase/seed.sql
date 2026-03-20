-- ============================================================
-- Dexarium Phase 1 Seed Data
-- At least 3 products per brand. Repeatable (uses INSERT ... ON CONFLICT DO NOTHING).
-- ============================================================

INSERT INTO products (slug, name, brand, type, price_cents, tags, image_url, is_new, is_preorder, preorder_date)
VALUES

-- ── GRIMDARK FUTURE ─────────────────────────────────────────
('gf-intercessor-squad',   'Intercessor Squad ×5',          'grimdark-future', 'infantry',  35000, ARRAY['Infantry','Battleline','bolter','power-armour'], NULL, true,  false, NULL),
('gf-primaris-captain',    'Primaris Captain',               'grimdark-future', 'character', 18000, ARRAY['Character','HQ','leader'],                       NULL, false, false, NULL),
('gf-land-raider',         'Land Raider Tank',               'grimdark-future', 'vehicle',   65000, ARRAY['Vehicle','tank','transport','heavy'],             NULL, false, false, NULL),
('gf-librarian-phobos',    'Librarian in Phobos Armour',     'grimdark-future', 'character', 22000, ARRAY['Character','HQ','psyker','elite'],                NULL, false, false, NULL),
('gf-drop-pod',            'Drop Pod',                       'grimdark-future', 'vehicle',   48000, ARRAY['Vehicle','Transports','transport','deployment'],  NULL, false, false, NULL),
('gf-ork-boyz',            'Ork Boyz ×10',                   'grimdark-future', 'infantry',  35000, ARRAY['Infantry','Battleline','greenskin'],              NULL, true,  false, NULL),
('gf-warboss',             'Warboss',                        'grimdark-future', 'character', 21000, ARRAY['Character','HQ','leader','greenskin'],            NULL, false, false, NULL),
('gf-termagant-brood',     'Termagant Brood ×10',            'grimdark-future', 'infantry',  35000, ARRAY['Infantry','Battleline','swarm','xenos'],          NULL, true,  false, NULL),

-- ── AGE OF FANTASY ──────────────────────────────────────────
('af-spearmen-regiment',   'Spearmen Regiment ×10',          'age-of-fantasy',  'infantry',  32000, ARRAY['Infantry','Battleline','spear','elves'],          NULL, true,  false, NULL),
('af-archmage-dragon',     'Archmage on Dragon',             'age-of-fantasy',  'vehicle',   78000, ARRAY['Vehicle','Character','HQ','dragon','magic'],      NULL, false, true,  'May 2025'),
('af-silver-helm-cavalry', 'Silver Helm Cavalry ×5',         'age-of-fantasy',  'infantry',  42000, ARRAY['Cavalry','elite','elves'],                       NULL, false, false, NULL),
('af-skeleton-warriors',   'Skeleton Warriors ×20',          'age-of-fantasy',  'infantry',  28000, ARRAY['Infantry','Battleline','undead','skeleton'],      NULL, false, false, NULL),
('af-lich-king',           'Lich King',                      'age-of-fantasy',  'character', 34000, ARRAY['Character','HQ','magic','undead'],                NULL, false, true,  'June 2025'),
('af-black-knights',       'Black Knights ×5',               'age-of-fantasy',  'infantry',  46000, ARRAY['Cavalry','undead','elite'],                      NULL, true,  false, NULL),

-- ── POKEMON ─────────────────────────────────────────────────
('pk-charizard-statue',    'Charizard Statue',               'pokemon',         'character', 65000, ARRAY['Character','fire','dragon','statue'],             NULL, true,  false, NULL),
('pk-pikachu-figurine',    'Pikachu Figurine',               'pokemon',         'character', 18000, ARRAY['Character','electric','cute'],                   NULL, false, false, NULL),
('pk-mewtwo-bust',         'Mewtwo Bust',                    'pokemon',         'character', 35000, ARRAY['Character','psychic','legendary'],                NULL, false, false, NULL),
('pk-gengar-figure',       'Gengar Figure',                  'pokemon',         'character', 22000, ARRAY['Character','ghost'],                             NULL, false, false, NULL),
('pk-eevee-collection',    'Eevee Collection Set',           'pokemon',         'character', 42000, ARRAY['Character','collection','set'],                  NULL, false, true,  'April 2025'),
('pk-snorlax-display',     'Snorlax Display',                'pokemon',         'character', 48000, ARRAY['Character','display'],                           NULL, true,  false, NULL),

-- ── BASING & BATTLE EFFECTS ─────────────────────────────────
('bas-urban-rubble',       'Urban Rubble Base Set ×5 (32mm)', 'basing-battle-effects', 'terrain', 12000, ARRAY['Terrain','base','urban','32mm'],            NULL, false, false, NULL),
('bas-cobblestone',        'Cobblestone Base Set ×5 (32mm)', 'basing-battle-effects', 'terrain', 11000, ARRAY['Terrain','base','cobblestone','32mm'],        NULL, false, false, NULL),
('bas-lava-crater',        'Lava Crater Base Set ×5 (40mm)', 'basing-battle-effects', 'terrain', 15000, ARRAY['Terrain','base','lava','40mm'],               NULL, true,  false, NULL),
('bas-dead-forest',        'Dead Forest Base Set ×5 (50mm)', 'basing-battle-effects', 'terrain', 18000, ARRAY['Terrain','base','nature','50mm'],             NULL, false, false, NULL),
('bas-scatter-rubble',     'Scatter Rubble & Debris Set',    'basing-battle-effects', 'terrain',  9500, ARRAY['Terrain','scatter','debris'],                NULL, false, false, NULL),
('bas-explosion-markers',  'Battle Effects Explosion ×3',    'basing-battle-effects', 'terrain', 14000, ARRAY['Terrain','marker','explosion','effects'],     NULL, true,  false, NULL),

-- ── GAMING ACCESSORIES & TERRAIN ────────────────────────────
('ter-gothic-building',    'Ruined Gothic Building',         'gaming-accessories-terrain', 'terrain',  65000, ARRAY['Terrain','gothic','ruin'],           NULL, false, false, NULL),
('ter-industrial-pipes',   'Industrial Pipes & Walkways',    'gaming-accessories-terrain', 'terrain',  48000, ARRAY['Terrain','industrial','modular'],    NULL, true,  false, NULL),
('ter-trench-system',      'Trench System Modular Set',      'gaming-accessories-terrain', 'terrain',  56000, ARRAY['Terrain','trench','modular'],        NULL, false, false, NULL),
('ter-dice-tray',          'Custom Dice Tray',               'gaming-accessories-terrain', 'terrain',  22000, ARRAY['Terrain','accessory','dice','tray'], NULL, false, false, NULL),
('ter-token-set',          'Magnetised Token Set ×20',       'gaming-accessories-terrain', 'terrain',  16000, ARRAY['Terrain','accessory','token'],       NULL, false, false, NULL),
('ter-foam-insert',        'Army Transport Foam Insert',     'gaming-accessories-terrain', 'terrain',  34000, ARRAY['Terrain','accessory','transport'],   NULL, false, true,  'May 2025')

ON CONFLICT (slug) DO NOTHING;

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
WHERE TRUE;

INSERT INTO products (
  slug, name, brand, type, print_type, faction, role, price_cents, tags, image_url, is_new, is_preorder, preorder_date
)
VALUES
('gf-chapter-banner-bearer', 'Chapter Banner Bearer', 'grimdark-future', 'character', 'RESIN', 'space-marines', 'Support', 16000, ARRAY['Character','support'], NULL, false, false, NULL),
('gf-battlewagon', 'Battlewagon', 'grimdark-future', 'vehicle', 'MULTICOLOUR', 'orks', 'Vehicles', 65000, ARRAY['Vehicle','tank','heavy','looted'], NULL, false, false, NULL),
('gf-weirdboy-warphead', 'Weirdboy Warphead', 'grimdark-future', 'character', 'RESIN', 'orks', 'HQ', 22000, ARRAY['Character','HQ','psyker','greenskin'], NULL, false, false, NULL),
('gf-looted-wagon', 'Looted Wagon', 'grimdark-future', 'vehicle', 'FDM', 'orks', 'Transports', 48000, ARRAY['Vehicle','transport','looted'], NULL, false, false, NULL),
('gf-nob-banner', 'Nob with Waaagh Banner', 'grimdark-future', 'character', 'RESIN', 'orks', 'Support', 16000, ARRAY['Character','support','greenskin'], NULL, false, false, NULL),
('gf-hive-tyrant', 'Hive Tyrant', 'grimdark-future', 'character', 'MULTICOLOUR', 'tyranids', 'HQ', 62000, ARRAY['Character','HQ','monster','xenos'], NULL, false, false, NULL),
('gf-tyrannofex', 'Tyrannofex', 'grimdark-future', 'vehicle', 'FDM', 'tyranids', 'Vehicles', 48000, ARRAY['Vehicle','monster','heavy','xenos'], NULL, false, false, NULL),
('gf-broodlord', 'Broodlord', 'grimdark-future', 'character', 'RESIN', 'tyranids', 'HQ', 22000, ARRAY['Character','HQ','elite','xenos'], NULL, false, false, NULL),
('gf-trygon-prime', 'Trygon Prime', 'grimdark-future', 'vehicle', 'RESIN', 'tyranids', 'Vehicles', 45000, ARRAY['Vehicle','monster','deepstrike','xenos'], NULL, false, false, NULL),
('gf-venomthrope', 'Venomthrope', 'grimdark-future', 'character', 'RESIN', 'tyranids', 'Support', 16000, ARRAY['Character','support','xenos'], NULL, false, false, NULL),
('gf-chaos-legionaries', 'Chaos Legionaries ×5', 'grimdark-future', 'infantry', 'RESIN', 'chaos-space-marines', 'Battleline', 35000, ARRAY['Infantry','Battleline','chaos','power-armour'], NULL, false, false, NULL),
('gf-chaos-lord', 'Chaos Lord', 'grimdark-future', 'character', 'RESIN', 'chaos-space-marines', 'HQ', 18000, ARRAY['Character','HQ','leader','chaos'], NULL, false, false, NULL),
('gf-chaos-rhino', 'Chaos Rhino', 'grimdark-future', 'vehicle', 'FDM', 'chaos-space-marines', 'Transports', 48000, ARRAY['Vehicle','transport','chaos'], NULL, false, false, NULL),
('gf-chaos-sorcerer', 'Sorcerer in Terminator Armour', 'grimdark-future', 'character', 'RESIN', 'chaos-space-marines', 'HQ', 22000, ARRAY['Character','HQ','psyker','chaos'], NULL, false, false, NULL),
('gf-chaos-predator', 'Chaos Predator', 'grimdark-future', 'vehicle', 'MULTICOLOUR', 'chaos-space-marines', 'Vehicles', 65000, ARRAY['Vehicle','tank','heavy','chaos'], NULL, false, false, NULL),
('gf-dark-apostle', 'Dark Apostle', 'grimdark-future', 'character', 'RESIN', 'chaos-space-marines', 'Support', 16000, ARRAY['Character','support','chaos'], NULL, false, false, NULL),
('af-white-lions', 'White Lions ×10', 'age-of-fantasy', 'infantry', 'RESIN', 'high-elves', 'Infantry', 38000, ARRAY['Infantry','elite','elves'], NULL, false, false, NULL),
('af-eagle-chariot', 'Eagle Chariot', 'age-of-fantasy', 'vehicle', 'MULTICOLOUR', 'high-elves', 'Vehicles', 56000, ARRAY['Vehicle','chariot','fast'], NULL, false, false, NULL),
('af-loremaster-hoeth', 'Loremaster of Hoeth', 'age-of-fantasy', 'character', 'RESIN', 'high-elves', 'Support', 24000, ARRAY['Character','magic','support'], NULL, false, false, NULL),
('af-zombie-dragon', 'Zombie Dragon', 'age-of-fantasy', 'vehicle', 'MULTICOLOUR', 'undead', 'Vehicles', 72000, ARRAY['Vehicle','monster','dragon','undead'], NULL, false, false, NULL),
('af-spirit-hosts', 'Spirit Hosts ×3', 'age-of-fantasy', 'infantry', 'RESIN', 'undead', 'Support', 18000, ARRAY['Infantry','support','spirit','undead'], NULL, false, false, NULL),
('af-necromancer', 'Necromancer', 'age-of-fantasy', 'character', 'RESIN', 'undead', 'Support', 16000, ARRAY['Character','magic','support','undead'], NULL, false, false, NULL)
ON CONFLICT (slug) DO NOTHING;
