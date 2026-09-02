import { normalizeImageUrl, supabase } from './supabase.js';

export const DEFAULT_SETTINGS = Object.freeze({
  whatsapp: '59175631782',
  maps_url: 'https://maps.app.goo.gl/DAhQgRibsNEDLpxC8',
  hours: '08:00 a 22:00',
  discount_text: 'Descuento especial desde 3 decants',
  instagram_url: 'https://www.instagram.com/perfumeria._smell',
  tiktok_url: 'https://www.tiktok.com/@perfumeria.smell_'
});

async function fallbackJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  return response.json();
}

export function normalizePerfume(row) {
  return {
    id: Number(row.id),
    slide: Number(row.slide),
    name: row.name,
    brand: row.brand,
    price5: Number(row.price_5 ?? row.price5),
    price10: Number(row.price_10 ?? row.price10),
    image: normalizeImageUrl(row.image),
    fullBottle: Boolean(row.full_bottle ?? row.fullBottle),
    preserveExact: Boolean(row.preserve_exact ?? row.preserveExact),
    stock5: Number(row.stock_5 ?? 0),
    stock10: Number(row.stock_10 ?? 0),
    stockFull: Number(row.stock_full ?? 0),
    active: row.active !== false
  };
}

export function normalizeCombo(row) {
  return {
    id: Number(row.id || 0),
    slug: row.slug ?? row.id,
    name: row.name,
    type: row.type,
    price: Number(row.price),
    image: normalizeImageUrl(row.image),
    items: Array.isArray(row.items) ? row.items : Array.isArray(row.items_json) ? row.items_json : [],
    active: row.active !== false
  };
}

export async function loadStorefront() {
  const [perfumeResult, comboResult, settingsResult] = await Promise.all([
    supabase.from('perfumes').select('id,slide,name,brand,price_5,price_10,image,full_bottle,preserve_exact,stock_5,stock_10,stock_full,active').eq('active', true).order('id'),
    supabase.from('combos').select('id,slug,name,type,price,image,items_json,active').eq('active', true).order('id'),
    supabase.from('settings').select('setting_key,setting_value')
  ]);

  let perfumes;
  let combos;
  let usedFallback = false;

  if (perfumeResult.error || !perfumeResult.data?.length) {
    perfumes = (await fallbackJson('/data/catalog.json')).map(normalizePerfume);
    usedFallback = true;
  } else {
    perfumes = perfumeResult.data.map(normalizePerfume);
  }

  if (comboResult.error || !comboResult.data?.length) {
    combos = (await fallbackJson('/data/combos.json')).map(normalizeCombo);
    usedFallback = true;
  } else {
    combos = comboResult.data.map(normalizeCombo);
  }

  const settings = { ...DEFAULT_SETTINGS };
  if (!settingsResult.error) {
    for (const row of settingsResult.data ?? []) settings[row.setting_key] = row.setting_value;
  }

  return { perfumes, combos, settings, usedFallback };
}

export async function loadSettings() {
  const settings = { ...DEFAULT_SETTINGS };
  const { data, error } = await supabase.from('settings').select('setting_key,setting_value');
  if (error) return settings;
  for (const row of data ?? []) settings[row.setting_key] = row.setting_value;
  return settings;
}

export function hydrateSettings(settings = DEFAULT_SETTINGS) {
  document.body.dataset.whatsapp = settings.whatsapp;

  document.querySelectorAll('[data-setting]').forEach(element => {
    const value = settings[element.dataset.setting];
    if (typeof value === 'string') element.textContent = value;
  });

  document.querySelectorAll('[data-setting-link]').forEach(element => {
    const value = settings[element.dataset.settingLink];
    if (typeof value === 'string') element.href = value;
  });

  const attentionMessage = encodeURIComponent('Hola, Perfumería Smell 👋 Necesito atención y quisiera hacer una consulta.');
  document.querySelectorAll('[data-whatsapp-link]').forEach(element => {
    const message = element.dataset.whatsappMessage
      ? encodeURIComponent(element.dataset.whatsappMessage)
      : attentionMessage;
    element.href = `https://wa.me/${settings.whatsapp}?text=${message}`;
  });

  document.querySelectorAll('[data-whatsapp-number]').forEach(element => {
    element.textContent = `+${settings.whatsapp.slice(0, 3)} ${settings.whatsapp.slice(3)}`;
  });

  return settings;
}
