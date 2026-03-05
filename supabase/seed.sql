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
