import { readFile, writeFile } from 'node:fs/promises';

const perfumes = JSON.parse(await readFile('data/catalog.json', 'utf8'));
const combos = JSON.parse(await readFile('data/combos.json', 'utf8'));
const quote = value => `'${String(value).replaceAll("'", "''")}'`;
const bool = value => value ? 'true' : 'false';

const perfumeRows = perfumes.map(item => `  (${[
  item.id,
  item.slide,
  quote(item.name),
  quote(item.brand),
  Number(item.price5).toFixed(2),
  Number(item.price10).toFixed(2),
  quote(item.image.replace('/assets/products/', '/assets/img/products/')),
  bool(item.fullBottle),
  bool(item.preserveExact)
].join(', ')})`).join(',\n');

const comboRows = combos.map(item => `  (${[
  quote(item.id),
  quote(item.name),
  quote(item.type),
  Number(item.price).toFixed(2),
  quote(item.image.replace('/assets/combos/', '/assets/img/combos/')),
  `${quote(JSON.stringify(item.items))}::jsonb`
].join(', ')})`).join(',\n');

const settings = {
  whatsapp: '59175631782',
  maps_url: 'https://maps.app.goo.gl/DAhQgRibsNEDLpxC8',
  hours: '08:00 a 22:00',
  discount_text: 'Descuento especial desde 3 decants',
  instagram_url: 'https://www.instagram.com/perfumeria._smell',
  tiktok_url: 'https://www.tiktok.com/@perfumeria.smell_'
};
const settingRows = Object.entries(settings).map(([key, value]) => `  (${quote(key)}, ${quote(value)})`).join(',\n');

const sql = `begin;

insert into public.perfumes
  (id, slide, name, brand, price_5, price_10, image, full_bottle, preserve_exact)
values
${perfumeRows}
on conflict (id) do nothing;

select setval(
  pg_get_serial_sequence('public.perfumes', 'id'),
  greatest((select coalesce(max(id), 1) from public.perfumes), 1),
  true
);

insert into public.combos (slug, name, type, price, image, items_json)
values
${comboRows}
on conflict (slug) do nothing;

select setval(
  pg_get_serial_sequence('public.combos', 'id'),
  greatest((select coalesce(max(id), 1) from public.combos), 1),
  true
);

insert into public.settings (setting_key, setting_value)
values
${settingRows}
on conflict (setting_key) do nothing;

commit;
`;

await writeFile('supabase/seed.sql', sql, 'utf8');
console.log(`Seed generado: ${perfumes.length} perfumes, ${combos.length} combos y ${Object.keys(settings).length} configuraciones.`);
