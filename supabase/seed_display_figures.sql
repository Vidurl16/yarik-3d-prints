-- ============================================================
-- Display Figures & Busts — Dummy seed products
-- Run in Supabase SQL Editor to populate the brand page for testing.
-- Replace image_url values with real images when available.
-- ============================================================

INSERT INTO products (slug, name, brand, faction, type, price_cents, tags, image_url, is_new, is_preorder, preorder_date)
VALUES

-- ── COMICS ──────────────────────────────────────────────────
('df-batman-bust',         'Batman Bust',                    'display-figures-busts', 'comics',  'character', 45000, ARRAY['busts','comics','dc'],                  'https://picsum.photos/seed/batman-bust/600/800',      true,  false, NULL),
('df-spider-man-figure',   'Spider-Man Display Figure',      'display-figures-busts', 'comics',  'character', 55000, ARRAY['single figures','comics','marvel'],      'https://picsum.photos/seed/spiderman-fig/600/800',   false, false, NULL),
('df-wolverine-diorama',   'Wolverine vs Sabretooth Diorama','display-figures-busts', 'comics',  'character', 89000, ARRAY['dioramas','comics','marvel'],            'https://picsum.photos/seed/wolverine-dio/600/800',   false, false, NULL),

-- ── GAMES ───────────────────────────────────────────────────
('df-geralt-bust',         'Geralt of Rivia Bust',           'display-figures-busts', 'games',   'character', 52000, ARRAY['busts','games','witcher'],               'https://picsum.photos/seed/geralt-bust/600/800',     true,  false, NULL),
('df-master-chief',        'Master Chief Display Figure',    'display-figures-busts', 'games',   'character', 65000, ARRAY['single figures','games','halo'],          'https://picsum.photos/seed/masterchief/600/800',     false, false, NULL),
('df-kratos-diorama',      'Kratos & Atreus Diorama',        'display-figures-busts', 'games',   'character', 95000, ARRAY['dioramas','games','god of war'],          'https://picsum.photos/seed/kratos-dio/600/800',      false, true,  'July 2025'),

-- ── MOVIES ──────────────────────────────────────────────────
('df-darth-vader-bust',    'Darth Vader Bust',               'display-figures-busts', 'movies',  'character', 58000, ARRAY['busts','movies','star wars'],             'https://picsum.photos/seed/darth-vader/600/800',     true,  false, NULL),
('df-gandalf-figure',      'Gandalf the White Figure',       'display-figures-busts', 'movies',  'character', 62000, ARRAY['single figures','movies','lotr'],         'https://picsum.photos/seed/gandalf-fig/600/800',     false, false, NULL),
('df-predator-diorama',    'Predator Trophy Wall Diorama',   'display-figures-busts', 'movies',  'character', 88000, ARRAY['dioramas','movies','limited edition'],    'https://picsum.photos/seed/predator-dio/600/800',    false, false, NULL),

-- ── OTHER ───────────────────────────────────────────────────
('df-dragon-bust',         'Eastern Dragon Bust',            'display-figures-busts', 'other',   'character', 48000, ARRAY['busts','other','fantasy'],                'https://picsum.photos/seed/dragon-bust/600/800',     false, false, NULL),
('df-angel-figure',        'Fallen Angel Display Figure',    'display-figures-busts', 'other',   'character', 72000, ARRAY['single figures','other','limited edition'],'https://picsum.photos/seed/angel-fig/600/800',      true,  false, NULL),
('df-samurai-diorama',     'Samurai Duel Diorama',           'display-figures-busts', 'other',   'character', 99000, ARRAY['dioramas','other','limited edition'],     'https://picsum.photos/seed/samurai-dio/600/800',     false, true,  'August 2025')

ON CONFLICT (slug) DO NOTHING;
