(() => {
  'use strict';
  const form = document.getElementById('claim-form');
  if (!form) return;

  const error = document.getElementById('claim-error');
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
      'Quedo atento/a a su respuesta.'
    ].filter(Boolean);

    const url = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();
