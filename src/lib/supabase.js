import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export const STORAGE_BUCKET = 'catalog-media';

export function normalizeImageUrl(path) {
  if (!path) return '/assets/img/brand/logo-smell.webp';
  if (/^https:\/\//i.test(path)) return path;

  const normalized = String(path).replace(/\\/g, '/');
  if (normalized.startsWith('/assets/img/')) return normalized;
  if (normalized.startsWith('assets/img/')) return `/${normalized}`;
  if (normalized.startsWith('/assets/products/')) return normalized.replace('/assets/products/', '/assets/img/products/');
  if (normalized.startsWith('/assets/combos/')) return normalized.replace('/assets/combos/', '/assets/img/combos/');
  if (normalized.startsWith('uploads/')) return `/${normalized}`;
  return `/assets/img/${normalized.replace(/^\/+/, '').replace(/^assets\//, '')}`;
}

export function getPublicStorageUrl(path) {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
