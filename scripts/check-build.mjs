import { access, readFile, readdir } from 'node:fs/promises';

const pages = [
  'index.html',
  '404.html',
  'cookies.html',
  'privacidad.html',
  'reclamos.html',
  'terminos-de-compra.html',
  'terminos-y-condiciones.html',
  'admin/index.html',
  'admin/login.html',
  'admin/perfumes.html',
  'admin/combos.html',
  'admin/settings.html'
];

for (const page of pages) {
  await access(`dist/${page}`);
  const html = await readFile(`dist/${page}`, 'utf8');
  if (!html.includes('<!doctype html>')) throw new Error(`${page} no contiene un documento HTML completo.`);
}

for (const asset of [
  'dist/assets/img/brand/logo-smell.webp',
  'dist/assets/img/products/product-071.webp',
  'dist/assets/img/combos/combo-smell.webp',
  'dist/data/catalog.json',
  'dist/data/combos.json'
]) await access(asset);

const appFiles = await readdir('dist/_app');
if (!appFiles.some(file => file.endsWith('.js'))) throw new Error('La compilación no generó JavaScript.');
if (!appFiles.some(file => file.endsWith('.css'))) throw new Error('La compilación no generó CSS.');

console.log(`Compilación válida: ${pages.length} páginas y ${appFiles.length} recursos generados.`);
