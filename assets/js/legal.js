import { publicSelect } from './supabase.js';

const DEFAULTS = Object.freeze({
  whatsapp: '59175631782',
  maps_url: 'https://maps.app.goo.gl/DAhQgRibsNEDLpxC8',
  hours: '08:00 a 22:00',
  instagram_url: 'https://www.instagram.com/perfumeria._smell',
  tiktok_url: 'https://www.tiktok.com/@perfumeria.smell_',
});
const ATTENTION_MESSAGE = 'Hola, Perfumería Smell 👋 Necesito atención y quisiera hacer una consulta.';
let whatsapp = DEFAULTS.whatsapp;

function applySettings(settings) {
  whatsapp = String(settings.whatsapp || DEFAULTS.whatsapp).replace(/\D/g, '') || DEFAULTS.whatsapp;
  document.querySelectorAll('[data-setting-text]').forEach(node => {
    const value = settings[node.dataset.settingText];
    if (value) node.textContent = value;
  });
  document.querySelectorAll('[data-setting-link]').forEach(node => {
    const value = settings[node.dataset.settingLink];
    if (value) node.href = value;
  });
  document.querySelectorAll('[data-whatsapp-link]').forEach(node => {
    const message = node.dataset.message || ATTENTION_MESSAGE;
    node.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  });
  document.querySelectorAll('[data-current-year]').forEach(node => {
    node.textContent = new Date().getFullYear();
  });
  const claimForm = document.getElementById('claim-form');
  if (claimForm) claimForm.dataset.whatsapp = whatsapp;
}

async function loadSettings() {
  try {
    const rows = await publicSelect('settings', 'select=setting_key,setting_value&order=setting_key.asc');
    applySettings({ ...DEFAULTS, ...Object.fromEntries(rows.map(row => [row.setting_key, row.setting_value])) });
  } catch (error) {
    console.warn('Se usará la configuración local de contacto.', error.message);
    applySettings(DEFAULTS);
  }
}

function bindClaimForm() {
  const form = document.getElementById('claim-form');
  const error = document.getElementById('claim-error');
  if (!form || !error) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    error.hidden = true;
    const name = document.getElementById('claim-name').value.trim();
    const type = document.getElementById('claim-type').value.trim();
    const order = document.getElementById('claim-order').value.trim();
    const detail = document.getElementById('claim-detail').value.trim();
    const confirmed = document.getElementById('claim-confirm').checked;

    if (name.length < 2 || !type || detail.length < 10 || !confirmed) {
      error.textContent = 'Completa nombre, tipo, detalle (mínimo 10 caracteres) y la confirmación antes de continuar.';
      error.hidden = false;
      return;
    }

    const lines = [
      'Hola, Perfumería Smell 👋',
      'Quiero registrar una solicitud de atención/reclamo:',
      '',
      `Nombre: ${name}`,
      `Tipo: ${type}`,
      order ? `Pedido o referencia: ${order}` : '',
      `Detalle: ${detail}`,
      '',
      'Quedo atento/a a su respuesta.',
    ].filter(Boolean);
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
  });
}

bindClaimForm();
loadSettings();
