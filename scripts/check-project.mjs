import { access, readFile } from 'node:fs/promises';

const required = [
  'index.html',
  'admin/index.html',
  'admin/login.html',
  'src/lib/supabase.js',
  'src/storefront.js',
  'supabase/schema.sql',
  'supabase/seed.sql',
  'vercel.json'
];

for (const file of required) await access(file);

const envExample = await readFile('.env.example', 'utf8');
for (const key of ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY']) {
  if (!envExample.includes(`${key}=`)) throw new Error(`Falta ${key} en .env.example`);
}

const perfumes = JSON.parse(await readFile('data/catalog.json', 'utf8'));
const combos = JSON.parse(await readFile('data/combos.json', 'utf8'));
const localImage = image => image
  .replace(/^\//, '')
  .replace(/^assets\/products\//, 'assets/img/products/')
  .replace(/^assets\/combos\//, 'assets/img/combos/');

if (perfumes.length !== 71) throw new Error(`Se esperaban 71 perfumes; hay ${perfumes.length}.`);
if (combos.length !== 11) throw new Error(`Se esperaban 11 combos; hay ${combos.length}.`);

const perfumeIds = new Set(perfumes.map(perfume => perfume.id));
const comboSlugs = new Set(combos.map(combo => combo.id ?? combo.slug));
if (perfumeIds.size !== perfumes.length) throw new Error('Hay IDs de perfumes duplicados.');
if (comboSlugs.size !== combos.length) throw new Error('Hay identificadores de combos duplicados.');

for (const perfume of perfumes) {
  if (!perfume.name || !perfume.brand || !Number.isFinite(Number(perfume.price5)) || !Number.isFinite(Number(perfume.price10))) {
    throw new Error(`Perfume inválido: ${JSON.stringify(perfume)}`);
  }
  await access(localImage(perfume.image));
}

for (const combo of combos) {
  if (!combo.name || !Array.isArray(combo.items) || !combo.items.length || !Number.isFinite(Number(combo.price))) {
    throw new Error(`Combo inválido: ${JSON.stringify(combo)}`);
  }
  await access(localImage(combo.image));
}

const schema = await readFile('supabase/schema.sql', 'utf8');
for (const fragment of [
  'enable row level security',
  'admin_profiles',
  'perfumes_authenticated_read',
  'combos_authenticated_read',
  'protect_exact_perfume_prices'
]) {
  if (!schema.includes(fragment)) throw new Error(`El esquema no contiene ${fragment}.`);
}

console.log(`Proyecto válido: ${perfumes.length} perfumes, ${combos.length} combos y ${required.length} archivos esenciales.`);
