-- Initial data for a NEW Perfumería Smell Supabase project.
-- This script is intentionally non-destructive: existing rows are not overwritten.
-- Run only after database/supabase-schema.sql.

begin;

insert into public.perfumes
  (id, slide, name, brand, price_5, price_10, image, full_bottle, preserve_exact, stock_5, stock_10, stock_full, active)
overriding system value
values
  (1, 1, 'Le Beau Le Parfum', 'Jean Paul Gaultier', 100.00, 190.00, '/assets/products/product-001.webp', true, false, 0, 0, 0, true),
  (2, 1, 'Invictus Victory Elixir', 'Rabanne', 85.00, 160.00, '/assets/products/product-002.webp', true, false, 0, 0, 0, true),
  (3, 2, '9PM Rebel', 'Afnan', 55.00, 100.00, '/assets/products/product-003.webp', true, false, 0, 0, 0, true),
  (4, 2, '9PM Night Out', 'Afnan', 65.00, 120.00, '/assets/products/product-004.webp', true, false, 0, 0, 0, true),
  (5, 3, 'Khamrah', 'Lattafa', 45.00, 80.00, '/assets/products/product-005.webp', true, false, 0, 0, 0, true),
  (6, 3, 'Khamrah Qahwa', 'Lattafa', 45.00, 80.00, '/assets/products/product-006.webp', true, false, 0, 0, 0, true),
  (7, 4, 'Liquid Brun', 'French Avenue', 55.00, 100.00, '/assets/products/product-007.webp', true, false, 0, 0, 0, true),
  (8, 4, '9PM Elixir', 'Afnan', 55.00, 100.00, '/assets/products/product-008.webp', true, false, 0, 0, 0, true),
  (9, 5, 'Odyssey Mandarin Sky', 'Armaf', 50.00, 90.00, '/assets/products/product-009.webp', true, false, 0, 0, 0, true),
  (10, 5, 'Odyssey Candee', 'Armaf', 50.00, 90.00, '/assets/products/product-010.webp', true, false, 0, 0, 0, true),
  (11, 6, 'Odyssey Go Mango', 'Armaf', 55.00, 100.00, '/assets/products/product-011.webp', true, false, 0, 0, 0, true),
  (12, 6, 'Odyssey Aqua Edition', 'Armaf', 50.00, 90.00, '/assets/products/product-012.webp', true, false, 0, 0, 0, true),
  (13, 7, 'Vintage Radio', 'Lattafa', 55.00, 100.00, '/assets/products/product-013.webp', true, false, 0, 0, 0, true),
  (14, 7, 'Eros Flame', 'Versace', 80.00, 150.00, '/assets/products/product-014.webp', true, false, 0, 0, 0, true),
  (15, 8, 'Fakhar Black', 'Lattafa', 45.00, 80.00, '/assets/products/product-015.webp', true, false, 0, 0, 0, true),
  (16, 8, 'Fakhar Platin', 'Lattafa', 45.00, 80.00, '/assets/products/product-016.webp', true, false, 0, 0, 0, true),
  (17, 9, 'Le Beau Paradise Garden', 'Jean Paul Gaultier', 95.00, 180.00, '/assets/products/product-017.webp', true, false, 0, 0, 0, true),
  (18, 9, 'Scandal Pour Homme Absolu', 'Jean Paul Gaultier', 90.00, 170.00, '/assets/products/product-018.webp', true, false, 0, 0, 0, true),
  (19, 10, 'Asad Bourbon', 'Lattafa', 50.00, 90.00, '/assets/products/product-019.webp', true, false, 0, 0, 0, true),
  (20, 10, 'Yara', 'Lattafa', 45.00, 80.00, '/assets/products/product-020.webp', true, false, 0, 0, 0, true),
  (21, 11, 'Le Male Elixir', 'Jean Paul Gaultier', 95.00, 180.00, '/assets/products/product-021.webp', true, false, 0, 0, 0, true),
  (22, 11, 'Le Male Le Parfum', 'Jean Paul Gaultier', 95.00, 180.00, '/assets/products/product-022.webp', true, false, 0, 0, 0, true),
  (23, 12, 'Hawas for Him', 'Rasasi', 50.00, 90.00, '/assets/products/product-023.webp', true, false, 0, 0, 0, true),
  (24, 12, 'Hawas Ice', 'Rasasi', 55.00, 100.00, '/assets/products/product-024.webp', true, false, 0, 0, 0, true),
  (25, 13, 'Erba Pura', 'Xerjoff', 230.00, 390.00, '/assets/products/product-025.webp', true, false, 0, 0, 0, true),
  (26, 13, 'Amber Oud Aqua Dubai', 'Al Haramain', 55.00, 100.00, '/assets/products/product-026.webp', true, false, 0, 0, 0, true),
  (27, 14, 'Born in Roma Intense', 'Valentino', 135.00, 250.00, '/assets/products/product-027.webp', true, false, 0, 0, 0, true),
  (28, 14, 'Amber Oud Gold Edition', 'Al Haramain', 55.00, 100.00, '/assets/products/product-028.webp', true, false, 0, 0, 0, true),
  (29, 15, 'Arabians Tonka', 'Montale', 110.00, 210.00, '/assets/products/product-029.webp', true, false, 0, 0, 0, true),
  (30, 15, 'Scandal Pour Homme Le Parfum', 'Jean Paul Gaultier', 85.00, 160.00, '/assets/products/product-030.webp', true, false, 0, 0, 0, true),
  (31, 16, 'Hawas Tropical', 'Rasasi', 55.00, 100.00, '/assets/products/product-031.webp', true, false, 0, 0, 0, true),
  (32, 16, 'Odyssey Bahamas', 'Armaf', 55.00, 100.00, '/assets/products/product-032.webp', true, false, 0, 0, 0, true),
  (33, 17, 'Cloud', 'Ariana Grande', 80.00, 150.00, '/assets/products/product-033.webp', true, false, 0, 0, 0, true),
  (34, 17, 'Fakhar Rose', 'Lattafa', 45.00, 90.00, '/assets/products/product-034.webp', true, false, 0, 0, 0, true),
  (35, 18, '9AM Dive', 'Afnan', 45.00, 80.00, '/assets/products/product-035.webp', true, false, 0, 0, 0, true),
  (36, 18, '9PM', 'Afnan', 45.00, 80.00, '/assets/products/product-036.webp', true, false, 0, 0, 0, true),
  (37, 19, 'Hawas Fire', 'Rasasi', 60.00, 110.00, '/assets/products/product-037.webp', true, false, 0, 0, 0, true),
  (38, 19, 'Vulcan Feu', 'French Avenue', 55.00, 100.00, '/assets/products/product-038.webp', true, false, 0, 0, 0, true),
  (39, 20, 'Bade’e Al Oud Honor & Glory', 'Lattafa', 45.00, 80.00, '/assets/products/product-039.webp', true, false, 0, 0, 0, true),
  (40, 20, 'Yara Moi', 'Lattafa', 45.00, 80.00, '/assets/products/product-040.webp', true, false, 0, 0, 0, true),
  (41, 21, 'Hawas Black', 'Rasasi', 50.00, 90.00, '/assets/products/product-041.webp', true, false, 0, 0, 0, true),
  (42, 21, 'Eclaire Pistache', 'Lattafa', 90.00, 50.00, '/assets/products/product-042.webp', true, true, 0, 0, 0, true),
  (43, 22, 'Atlas', 'Lattafa', 80.00, 150.00, '/assets/products/product-043.webp', true, false, 0, 0, 0, true),
  (44, 22, 'Turathi Blue', 'Afnan', 55.00, 100.00, '/assets/products/product-044.webp', true, false, 0, 0, 0, true),
  (45, 23, 'The Most Wanted', 'Azzaro', 80.00, 150.00, '/assets/products/product-045.webp', true, false, 0, 0, 0, true),
  (46, 23, 'Asad Elixir', 'Lattafa', 50.00, 90.00, '/assets/products/product-046.webp', true, false, 0, 0, 0, true),
  (47, 24, 'Stronger With You Intensely', 'Giorgio Armani', 95.00, 180.00, '/assets/products/product-047.webp', true, false, 0, 0, 0, true),
  (48, 24, 'Tropical Vibe', 'Rayhaan', 110.00, 60.00, '/assets/products/product-048.webp', true, true, 0, 0, 0, true),
  (49, 25, 'Hawas Malibu', 'Rasasi', 55.00, 100.00, '/assets/products/product-049.webp', true, false, 0, 0, 0, true),
  (50, 25, 'Hawas Verde', 'Rasasi', 100.00, 55.00, '/assets/products/product-050.webp', true, true, 0, 0, 0, true),
  (51, 26, 'La Bomba', 'Carolina Herrera', 100.00, 190.00, '/assets/products/product-051.webp', true, false, 0, 0, 0, true),
  (52, 26, 'Eclaire', 'Lattafa', 90.00, 50.00, '/assets/products/product-052.webp', true, true, 0, 0, 0, true),
  (53, 27, 'Bad Boy Extreme', 'Carolina Herrera', 80.00, 150.00, '/assets/products/product-053.webp', true, false, 0, 0, 0, true),
  (54, 27, 'His Confession', 'Lattafa', 50.00, 90.00, '/assets/products/product-054.webp', true, false, 0, 0, 0, true),
  (55, 28, 'Sauvage Parfum', 'Dior', 120.00, 220.00, '/assets/products/product-055.webp', true, false, 0, 0, 0, true),
  (56, 28, 'Art of Universe', 'Lattafa', 55.00, 100.00, '/assets/products/product-056.webp', true, false, 0, 0, 0, true),
  (57, 29, 'World Cup Eau de Parfum', 'Zakat', 80.00, 150.00, '/assets/products/product-057.webp', true, false, 0, 0, 0, true),
  (58, 29, 'Hawas Kobra', 'Rasasi', 55.00, 100.00, '/assets/products/product-058.webp', true, false, 0, 0, 0, true),
  (59, 30, 'Layton', 'Parfums de Marly', 230.00, 450.00, '/assets/products/product-059.webp', true, false, 0, 0, 0, true),
  (60, 30, 'Uomo Born in Roma Purple', 'Valentino', 130.00, 250.00, '/assets/products/product-060.webp', true, false, 0, 0, 0, true),
  (61, 31, 'Hawas Elixir', 'Rasasi', 55.00, 100.00, '/assets/products/product-061.webp', true, false, 0, 0, 0, true),
  (62, 31, 'Amber Rouge', 'Orientica', 75.00, 140.00, '/assets/products/product-062.webp', true, false, 0, 0, 0, true),
  (63, 32, 'Odyssey Mega', 'Armaf', 50.00, 90.00, '/assets/products/product-063.webp', true, false, 0, 0, 0, true),
  (64, 32, 'Tag Him Uomo Rosso', 'Armaf', 50.00, 90.00, '/assets/products/product-064.webp', true, false, 0, 0, 0, true),
  (65, 33, 'Club de Nuit Women EDP', 'Armaf', 50.00, 90.00, '/assets/products/product-065.webp', true, false, 0, 0, 0, true),
  (66, 33, 'Burberry Her', 'Burberry', 100.00, 190.00, '/assets/products/product-066.webp', true, false, 0, 0, 0, true),
  (67, 34, 'Club de Nuit Urban Elixir', 'Armaf', 50.00, 90.00, '/assets/products/product-067.webp', true, false, 0, 0, 0, true),
  (68, 34, 'Khamrah Waha', 'Lattafa', 75.00, 140.00, '/assets/products/product-068.webp', true, false, 0, 0, 0, true),
  (69, 35, 'Yara Tous', 'Lattafa', 45.00, 80.00, '/assets/products/product-069.webp', true, false, 0, 0, 0, true),
  (70, 35, 'Eclaire Banoffi', 'Lattafa', 50.00, 90.00, '/assets/products/product-070.webp', true, false, 0, 0, 0, true),
  (71, 36, 'Acqua di Gio Pour Homme', 'Giorgio Armani', 80.00, 150.00, '/assets/products/product-071.webp', true, false, 0, 0, 0, true)
on conflict (id) do nothing;

select setval(
  pg_get_serial_sequence('public.perfumes', 'id'),
  greatest((select coalesce(max(id), 1) from public.perfumes), 1),
  true
);

insert into public.combos
  (id, slug, name, type, price, image, items_json, active)
overriding system value
values
  (NaN, 'undefined', 'Combo Lujo', '3 decants de 10 ml', 630.00, '/assets/combos/combo-lujo.webp', '["Arabians Tonka","Erba Pura","Born in Roma Intense"]'::jsonb, true),
  (NaN, 'undefined', 'Combo Diva', '3 decants de 10 ml', 400.00, '/assets/combos/combo-diva-decants.webp', '["Burberry Her","La Bomba","Eclaire Pistache"]'::jsonb, true),
  (NaN, 'undefined', 'Combo Cholero', '3 decants de 10 ml', 400.00, '/assets/combos/combo-cholero.webp', '["The Most Wanted","Le Male Elixir","Scandal Pour Homme Le Parfum"]'::jsonb, true),
  (NaN, 'undefined', 'Combo Escuela', '3 decants de 10 ml', 220.00, '/assets/combos/combo-escuela.webp', '["Hawas Ice","Odyssey Aqua Edition","Turathi Blue"]'::jsonb, true),
  (NaN, 'undefined', 'Combo Dubai', '3 decants de 10 ml', 250.00, '/assets/combos/combo-dubai.webp', '["Odyssey Mandarin Sky","9PM Night Out","Liquid Brun"]'::jsonb, true),
  (NaN, 'undefined', 'Combo Magnate', '3 decants de 10 ml', 480.00, '/assets/combos/combo-magnate.webp', '["Le Male Le Parfum","Stronger With You Intensely","Bleu de Chanel Le Parfum"]'::jsonb, true),
  (NaN, 'undefined', 'Combo Smell', '3 perfumes completos de 100 ml', 1080.00, '/assets/combos/combo-smell.webp', '["9PM Dive","Odyssey Mandarin Sky","Khamrah"]'::jsonb, true),
  (NaN, 'undefined', 'Combo Gringo', '1 perfume de 125 ml y 2 de 100 ml', 3350.00, '/assets/combos/combo-gringo.webp', '["Le Male Elixir · 125 ml","Scandal Pour Homme Le Parfum · 100 ml","Acqua di Giò · 100 ml"]'::jsonb, true),
  (NaN, 'undefined', 'Combo Árabe', '3 perfumes completos de 100 ml', 1380.00, '/assets/combos/combo-arabe.webp', '["Hawas Ice","9PM Rebel","9AM Dive"]'::jsonb, true),
  (NaN, 'undefined', 'Combo Amo Santa Cruz', '3 perfumes completos de 100 ml', 1400.00, '/assets/combos/combo-amo-santa-cruz.webp', '["Hawas Fire","Odyssey Aqua Edition","Art of Universe"]'::jsonb, true),
  (NaN, 'undefined', 'Combo Diva', '3 perfumes completos de 100 ml', 1100.00, '/assets/combos/combo-diva.webp', '["Yara Rosa","Odyssey Candee","Eclaire Pistache"]'::jsonb, true)
on conflict (slug) do nothing;

select setval(
  pg_get_serial_sequence('public.combos', 'id'),
  greatest((select coalesce(max(id), 1) from public.combos), 1),
  true
);

insert into public.settings (setting_key, setting_value)
values
  ('whatsapp', '59175631782'),
  ('maps_url', 'https://maps.app.goo.gl/DAhQgRibsNEDLpxC8'),
  ('hours', '08:00 a 22:00'),
  ('discount_text', 'Descuento especial desde 3 decants'),
  ('instagram_url', 'https://www.instagram.com/perfumeria._smell'),
  ('tiktok_url', 'https://www.tiktok.com/@perfumeria.smell_')
on conflict (setting_key) do nothing;

commit;

