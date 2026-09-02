import { hydrateSettings, loadSettings } from './lib/data.js';

const whatsappIcon = '<svg class="whatsapp-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C8.83 3 3 8.83 3 16c0 2.54.75 5.02 2.15 7.15L3.5 28.5l5.48-1.61A12.95 12.95 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16 3zm0 23.6c-2.16 0-4.28-.58-6.14-1.67l-.44-.26-3.25.96.98-3.16-.29-.46A10.55 10.55 0 1 1 16 26.6z"></path></svg>';

function renderShell() {
  const header = document.querySelector('[data-legal-header]');
  const footer = document.querySelector('[data-legal-footer]');
  if (header) {
    header.innerHTML = `<div class="announcement"><span>✦ Perfumería Smell</span><span class="announcement-hours">◷ Atención de <span data-setting="hours">08:00 a 22:00</span></span></div>
      <header class="site-header legal-header">
        <a class="brand" href="/#inicio"><img src="/assets/img/brand/logo-smell.webp" alt="Logo de Perfumería Smell"><span><strong>Perfumería</strong><em>SMELL</em></span></a>
        <nav class="desktop-nav legal-nav"><a href="/#inicio">Inicio</a><a href="/#combos">Combos</a><a href="/#catalogo">Perfumes</a><a href="/reclamos">Reclamos</a></nav>
        <a class="btn legal-attention" data-whatsapp-link href="https://wa.me/59175631782" target="_blank" rel="noopener">Atención por WhatsApp</a>
      </header>`;
  }
  if (footer) {
    footer.innerHTML = `<footer class="legal-footer">
      <div class="footer-brand"><img src="/assets/img/brand/logo-smell.webp" alt="Perfumería Smell"><div><strong>PERFUMERÍA SMELL</strong><span>Tu aroma habla antes que tú.</span></div></div>
      <div><strong>Información legal</strong><a href="/terminos-y-condiciones">Términos y condiciones</a><a href="/privacidad">Privacidad</a><a href="/cookies">Cookies</a><a href="/terminos-de-compra">Términos de compra</a></div>
      <div><strong>Atención</strong><a href="/reclamos">Reclamos</a><a data-whatsapp-link href="https://wa.me/59175631782" target="_blank" rel="noopener">${whatsappIcon} WhatsApp</a><span data-setting="hours">08:00 a 22:00</span></div>
      <div><strong>Encuéntranos</strong><a data-setting-link="maps_url" href="https://maps.app.goo.gl/DAhQgRibsNEDLpxC8" target="_blank" rel="noopener">Montero, Bolivia</a><a data-setting-link="instagram_url" href="https://www.instagram.com/perfumeria._smell" target="_blank" rel="noopener">Instagram</a><a data-setting-link="tiktok_url" href="https://www.tiktok.com/@perfumeria.smell_" target="_blank" rel="noopener">TikTok</a></div>
      <p>© 2026 Perfumería Smell. Información sujeta a confirmación por WhatsApp.</p>
    </footer>`;
  }
}

export async function initializeLegalShell() {
  renderShell();
  try {
    return hydrateSettings(await loadSettings());
  } catch (error) {
    console.error('No se pudieron actualizar los datos del negocio.', error);
    return hydrateSettings();
  }
}

export const legalSettingsPromise = initializeLegalShell();
