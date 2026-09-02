import { legalSettingsPromise } from './legal.js';

const settings = await legalSettingsPromise;
const form = document.querySelector('#claim-form');
const errorBox = document.querySelector('#claim-error');

form?.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#claim-name').value.trim();
  const type = document.querySelector('#claim-type').value;
  const order = document.querySelector('#claim-order').value.trim();
  const detail = document.querySelector('#claim-detail').value.trim();
  const confirmed = document.querySelector('#claim-confirm').checked;

  if (!name || !type || !detail || !confirmed) {
    errorBox.textContent = 'Completa los campos obligatorios y confirma la información antes de continuar.';
    errorBox.hidden = false;
    return;
  }

  errorBox.hidden = true;
  const message = [
    'Hola, Perfumería Smell. Quiero registrar una solicitud:',
    `Nombre: ${name}`,
    `Tipo: ${type}`,
    order ? `Pedido o referencia: ${order}` : '',
    `Detalle: ${detail}`
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
