import { DEFAULT_SETTINGS } from '../lib/data.js';
import { hideNotice, initializeAdmin, showNotice, supabase } from './shared.js';

const notice = document.querySelector('#settings-notice');
const form = document.querySelector('#settings-form');

async function loadSettings() {
  const { data, error } = await supabase.from('settings').select('setting_key,setting_value');
  if (error) throw error;
  const values = { ...DEFAULT_SETTINGS };
  for (const row of data) values[row.setting_key] = row.setting_value;
  for (const [key, value] of Object.entries(values)) if (form.elements[key]) form.elements[key].value = value;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  hideNotice(notice);
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Guardando…';
  try {
    const values = Object.fromEntries(new FormData(form));
    values.whatsapp = String(values.whatsapp).replace(/\D/g, '');
    for (const key of ['maps_url', 'instagram_url', 'tiktok_url']) {
      const url = new URL(values[key]);
      if (url.protocol !== 'https:') throw new Error('Todos los enlaces deben comenzar con HTTPS.');
    }
    if (values.whatsapp.length < 8 || !values.hours.trim() || !values.discount_text.trim()) throw new Error('Revisa los datos ingresados.');
    const rows = Object.entries(values).map(([setting_key, setting_value]) => ({ setting_key, setting_value: String(setting_value).trim() }));
    const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'setting_key' });
    if (error) throw error;
    showNotice(notice, 'ok', 'Datos del negocio actualizados.');
  } catch (error) {
    console.error(error);
    showNotice(notice, 'error', error.message || 'No se pudieron guardar los datos.');
  } finally {
    submit.disabled = false;
    submit.textContent = 'Guardar información';
  }
});

if (await initializeAdmin('settings')) {
  try { await loadSettings(); }
  catch (error) { console.error(error); showNotice(notice, 'error', 'No se pudieron cargar los datos del negocio.'); }
}
