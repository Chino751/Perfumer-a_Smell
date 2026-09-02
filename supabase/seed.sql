begin;

insert into public.perfumes
  (id, slide, name, brand, price_5, price_10, image, full_bottle, preserve_exact)
values
  (1, 1, 'Le Beau Le Parfum', 'Jean Paul Gaultier', 100.00, 190.00, '/assets/img/products/product-001.webp', true, false),
  (2, 1, 'Invictus Victory Elixir', 'Rabanne', 85.00, 160.00, '/assets/img/products/product-002.webp', true, false),
  (3, 2, '9PM Rebel', 'Afnan', 55.00, 100.00, '/assets/img/products/product-003.webp', true, false),
  (4, 2, '9PM Night Out', 'Afnan', 65.00, 120.00, '/assets/img/products/product-004.webp', true, false),
  (5, 3, 'Khamrah', 'Lattafa', 45.00, 80.00, '/assets/img/products/product-005.webp', true, false),
  (6, 3, 'Khamrah Qahwa', 'Lattafa', 45.00, 80.00, '/assets/img/products/product-006.webp', true, false),
  (7, 4, 'Liquid Brun', 'French Avenue', 55.00, 100.00, '/assets/img/products/product-007.webp', true, false),
  (8, 4, '9PM Elixir', 'Afnan', 55.00, 100.00, '/assets/img/products/product-008.webp', true, false),
  (9, 5, 'Odyssey Mandarin Sky', 'Armaf', 50.00, 90.00, '/assets/img/products/product-009.webp', true, false),
  (10, 5, 'Odyssey Candee', 'Armaf', 50.00, 90.00, '/assets/img/products/product-010.webp', true, false),
  (11, 6, 'Odyssey Go Mango', 'Armaf', 55.00, 100.00, '/assets/img/products/product-011.webp', true, false),
  (12, 6, 'Odyssey Aqua Edition', 'Armaf', 50.00, 90.00, '/assets/img/products/product-012.webp', true, false),
  (13, 7, 'Vintage Radio', 'Lattafa', 55.00, 100.00, '/assets/img/products/product-013.webp', true, false),
  (14, 7, 'Eros Flame', 'Versace', 80.00, 150.00, '/assets/img/products/product-014.webp', true, false),
  (15, 8, 'Fakhar Black', 'Lattafa', 45.00, 80.00, '/assets/img/products/product-015.webp', true, false),
  (16, 8, 'Fakhar Platin', 'Lattafa', 45.00, 80.00, '/assets/img/products/product-016.webp', true, false),
  (17, 9, 'Le Beau Paradise Garden', 'Jean Paul Gaultier', 95.00, 180.00, '/assets/img/products/product-017.webp', true, false),
  (18, 9, 'Scandal Pour Homme Absolu', 'Jean Paul Gaultier', 90.00, 170.00, '/assets/img/products/product-018.webp', true, false),
  (19, 10, 'Asad Bourbon', 'Lattafa', 50.00, 90.00, '/assets/img/products/product-019.webp', true, false),
  (20, 10, 'Yara', 'Lattafa', 45.00, 80.00, '/assets/img/products/product-020.webp', true, false),
  (21, 11, 'Le Male Elixir', 'Jean Paul Gaultier', 95.00, 180.00, '/assets/img/products/product-021.webp', true, false),
  (22, 11, 'Le Male Le Parfum', 'Jean Paul Gaultier', 95.00, 180.00, '/assets/img/products/product-022.webp', true, false),
  (23, 12, 'Hawas for Him', 'Rasasi', 50.00, 90.00, '/assets/img/products/product-023.webp', true, false),
  (24, 12, 'Hawas Ice', 'Rasasi', 55.00, 100.00, '/assets/img/products/product-024.webp', true, false),
  (25, 13, 'Erba Pura', 'Xerjoff', 230.00, 390.00, '/assets/img/products/product-025.webp', true, false),
  (26, 13, 'Amber Oud Aqua Dubai', 'Al Haramain', 55.00, 100.00, '/assets/img/products/product-026.webp', true, false),
  (27, 14, 'Born in Roma Intense', 'Valentino', 135.00, 250.00, '/assets/img/products/product-027.webp', true, false),
  (28, 14, 'Amber Oud Gold Edition', 'Al Haramain', 55.00, 100.00, '/assets/img/products/product-028.webp', true, false),
  (29, 15, 'Arabians Tonka', 'Montale', 110.00, 210.00, '/assets/img/products/product-029.webp', true, false),
  (30, 15, 'Scandal Pour Homme Le Parfum', 'Jean Paul Gaultier', 85.00, 160.00, '/assets/img/products/product-030.webp', true, false),
  (31, 16, 'Hawas Tropical', 'Rasasi', 55.00, 100.00, '/assets/img/products/product-031.webp', true, false),
  (32, 16, 'Odyssey Bahamas', 'Armaf', 55.00, 100.00, '/assets/img/products/product-032.webp', true, false),
  (33, 17, 'Cloud', 'Ariana Grande', 80.00, 150.00, '/assets/img/products/product-033.webp', true, false),
  (34, 17, 'Fakhar Rose', 'Lattafa', 45.00, 90.00, '/assets/img/products/product-034.webp', true, false),
  (35, 18, '9AM Dive', 'Afnan', 45.00, 80.00, '/assets/img/products/product-035.webp', true, false),
  (36, 18, '9PM', 'Afnan', 45.00, 80.00, '/assets/img/products/product-036.webp', true, false),
  (37, 19, 'Hawas Fire', 'Rasasi', 60.00, 110.00, '/assets/img/products/product-037.webp', true, false),
  (38, 19, 'Vulcan Feu', 'French Avenue', 55.00, 100.00, '/assets/img/products/product-038.webp', true, false),
  (39, 20, 'Bade’e Al Oud Honor & Glory', 'Lattafa', 45.00, 80.00, '/assets/img/products/product-039.webp', true, false),
  (40, 20, 'Yara Moi', 'Lattafa', 45.00, 80.00, '/assets/img/products/product-040.webp', true, false),
  (41, 21, 'Hawas Black', 'Rasasi', 50.00, 90.00, '/assets/img/products/product-041.webp', true, false),
  (42, 21, 'Eclaire Pistache', 'Lattafa', 90.00, 50.00, '/assets/img/products/product-042.webp', true, true),
  (43, 22, 'Atlas', 'Lattafa', 80.00, 150.00, '/assets/img/products/product-043.webp', true, false),
  (44, 22, 'Turathi Blue', 'Afnan', 55.00, 100.00, '/assets/img/products/product-044.webp', true, false),
  (45, 23, 'The Most Wanted', 'Azzaro', 80.00, 150.00, '/assets/img/products/product-045.webp', true, false),
  (46, 23, 'Asad Elixir', 'Lattafa', 50.00, 90.00, '/assets/img/products/product-046.webp', true, false),
  (47, 24, 'Stronger With You Intensely', 'Giorgio Armani', 95.00, 180.00, '/assets/img/products/product-047.webp', true, false),
  (48, 24, 'Tropical Vibe', 'Rayhaan', 110.00, 60.00, '/assets/img/products/product-048.webp', true, true),
  (49, 25, 'Hawas Malibu', 'Rasasi', 55.00, 100.00, '/assets/img/products/product-049.webp', true, false),
  (50, 25, 'Hawas Verde', 'Rasasi', 100.00, 55.00, '/assets/img/products/product-050.webp', true, true),
  (51, 26, 'La Bomba', 'Carolina Herrera', 100.00, 190.00, '/assets/img/products/product-051.webp', true, false),
  (52, 26, 'Eclaire', 'Lattafa', 90.00, 50.00, '/assets/img/products/product-052.webp', true, true),
  (53, 27, 'Bad Boy Extreme', 'Carolina Herrera', 80.00, 150.00, '/assets/img/products/product-053.webp', true, false),
  (54, 27, 'His Confession', 'Lattafa', 50.00, 90.00, '/assets/img/products/product-054.webp', true, false),
  (55, 28, 'Sauvage Parfum', 'Dior', 120.00, 220.00, '/assets/img/products/product-055.webp', true, false),
  (56, 28, 'Art of Universe', 'Lattafa', 55.00, 100.00, '/assets/img/products/product-056.webp', true, false),
  (57, 29, 'World Cup Eau de Parfum', 'Zakat', 80.00, 150.00, '/assets/img/products/product-057.webp', true, false),
  (58, 29, 'Hawas Kobra', 'Rasasi', 55.00, 100.00, '/assets/img/products/product-058.webp', true, false),
  (59, 30, 'Layton', 'Parfums de Marly', 230.00, 450.00, '/assets/img/products/product-059.webp', true, false),
  (60, 30, 'Uomo Born in Roma Purple', 'Valentino', 130.00, 250.00, '/assets/img/products/product-060.webp', true, false),
  (61, 31, 'Hawas Elixir', 'Rasasi', 55.00, 100.00, '/assets/img/products/product-061.webp', true, false),
  (62, 31, 'Amber Rouge', 'Orientica', 75.00, 140.00, '/assets/img/products/product-062.webp', true, false),
  (63, 32, 'Odyssey Mega', 'Armaf', 50.00, 90.00, '/assets/img/products/product-063.webp', true, false),
  (64, 32, 'Tag Him Uomo Rosso', 'Armaf', 50.00, 90.00, '/assets/img/products/product-064.webp', true, false),
  (65, 33, 'Club de Nuit Women EDP', 'Armaf', 50.00, 90.00, '/assets/img/products/product-065.webp', true, false),
  (66, 33, 'Burberry Her', 'Burberry', 100.00, 190.00, '/assets/img/products/product-066.webp', true, false),
  (67, 34, 'Club de Nuit Urban Elixir', 'Armaf', 50.00, 90.00, '/assets/img/products/product-067.webp', true, false),
  (68, 34, 'Khamrah Waha', 'Lattafa', 75.00, 140.00, '/assets/img/products/product-068.webp', true, false),
  (69, 35, 'Yara Tous', 'Lattafa', 45.00, 80.00, '/assets/img/products/product-069.webp', true, false),
  (70, 35, 'Eclaire Banoffi', 'Lattafa', 50.00, 90.00, '/assets/img/products/product-070.webp', true, false),
  (71, 36, 'Acqua di Gio Pour Homme', 'Giorgio Armani', 80.00, 150.00, '/assets/img/products/product-071.webp', true, false)
on conflict (id) do nothing;

select setval(
  pg_get_serial_sequence('public.perfumes', 'id'),
  greatest((select coalesce(max(id), 1) from public.perfumes), 1),
  true
);

insert into public.combos (slug, name, type, price, image, items_json)
values
  ('lujo', 'Combo Lujo', '3 decants de 10 ml', 630.00, '/assets/img/combos/combo-lujo.webp', '["Arabians Tonka","Erba Pura","Born in Roma Intense"]'::jsonb),
  ('diva-decants', 'Combo Diva', '3 decants de 10 ml', 400.00, '/assets/img/combos/combo-diva-decants.webp', '["Burberry Her","La Bomba","Eclaire Pistache"]'::jsonb),
  ('cholero', 'Combo Cholero', '3 decants de 10 ml', 400.00, '/assets/img/combos/combo-cholero.webp', '["The Most Wanted","Le Male Elixir","Scandal Pour Homme Le Parfum"]'::jsonb),
  ('escuela', 'Combo Escuela', '3 decants de 10 ml', 220.00, '/assets/img/combos/combo-escuela.webp', '["Hawas Ice","Odyssey Aqua Edition","Turathi Blue"]'::jsonb),
  ('dubai', 'Combo Dubai', '3 decants de 10 ml', 250.00, '/assets/img/combos/combo-dubai.webp', '["Odyssey Mandarin Sky","9PM Night Out","Liquid Brun"]'::jsonb),
  ('magnate', 'Combo Magnate', '3 decants de 10 ml', 480.00, '/assets/img/combos/combo-magnate.webp', '["Le Male Le Parfum","Stronger With You Intensely","Bleu de Chanel Le Parfum"]'::jsonb),
  ('smell', 'Combo Smell', '3 perfumes completos de 100 ml', 1080.00, '/assets/img/combos/combo-smell.webp', '["9PM Dive","Odyssey Mandarin Sky","Khamrah"]'::jsonb),
  ('gringo', 'Combo Gringo', '1 perfume de 125 ml y 2 de 100 ml', 3350.00, '/assets/img/combos/combo-gringo.webp', '["Le Male Elixir · 125 ml","Scandal Pour Homme Le Parfum · 100 ml","Acqua di Giò · 100 ml"]'::jsonb),
  ('arabe', 'Combo Árabe', '3 perfumes completos de 100 ml', 1380.00, '/assets/img/combos/combo-arabe.webp', '["Hawas Ice","9PM Rebel","9AM Dive"]'::jsonb),
  ('amo-santa-cruz', 'Combo Amo Santa Cruz', '3 perfumes completos de 100 ml', 1400.00, '/assets/img/combos/combo-amo-santa-cruz.webp', '["Hawas Fire","Odyssey Aqua Edition","Art of Universe"]'::jsonb),
  ('diva', 'Combo Diva', '3 perfumes completos de 100 ml', 1100.00, '/assets/img/combos/combo-diva.webp', '["Yara Rosa","Odyssey Candee","Eclaire Pistache"]'::jsonb)
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
