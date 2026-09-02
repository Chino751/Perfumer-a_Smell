import { publicSelect } from './supabase.js';

(() => {
  'use strict';

  const DEFAULTS = Object.freeze({
    whatsapp: '59175631782',
    maps_url: 'https://maps.app.goo.gl/DAhQgRibsNEDLpxC8',
    hours: '08:00 a 22:00',
    discount_text: 'Descuento especial desde 3 decants',
    instagram_url: 'https://www.instagram.com/perfumeria._smell',
    tiktok_url: 'https://www.tiktok.com/@perfumeria.smell_',
  });
  const ATTENTION_MESSAGE = 'Hola, Perfumería Smell 👋 Necesito atención y quisiera hacer una consulta.';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = value => `${new Intl.NumberFormat('es-BO', { maximumFractionDigits: 2 }).format(Number(value) || 0)} Bs`;
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[char]));
  const normalizeText = value => String(value ?? '').trim().toLocaleLowerCase('es');

  let whatsapp = DEFAULTS.whatsapp;
  let cart = [];
  let visible = 12;

  function readCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem('smell-cart') || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(item => item && typeof item.key === 'string' && typeof item.name === 'string')
        .map(item => ({ ...item, quantity: Math.min(99, Math.max(1, Number(item.quantity) || 1)) }));
    } catch {
      return [];
    }
  }

  function resolveImage(path) {
    const value = String(path || '').trim();
    if (/^https:\/\//i.test(value)) return value;
    if (/^\/assets\/products\//i.test(value)) return value.replace('/assets/products/', 'assets/img/products/');
    if (/^\/assets\/combos\//i.test(value)) return value.replace('/assets/combos/', 'assets/img/combos/');
    if (/^\/assets\/img\//i.test(value)) return value.slice(1);
    if (/^assets\//i.test(value)) return value;
    return 'assets/img/brand/logo-smell.webp';
  }

  async function fetchJson(path) {
    const response = await fetch(path, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
    return response.json();
  }

  async function loadPerfumes() {
    try {
      const rows = await publicSelect('perfumes', 'select=id,slide,name,brand,price_5,price_10,image,full_bottle,preserve_exact,active&active=eq.true&order=id.asc');
      if (rows.length) return { source: 'supabase', data: rows.map(row => ({
        id: row.id,
        slide: row.slide,
        name: row.name,
        brand: row.brand,
        price5: Number(row.price_5),
        price10: Number(row.price_10),
        image: resolveImage(row.image),
        fullBottle: Boolean(row.full_bottle),
        preserveExact: Boolean(row.preserve_exact),
      })) };
    } catch (error) {
      console.warn('Catálogo remoto no disponible; se usará el respaldo local.', error.message);
    }
    const fallback = await fetchJson('data/catalog.json');
    return { source: 'local', data: fallback.map(item => ({ ...item, image: resolveImage(item.image) })) };
  }

  async function loadCombos() {
    try {
      const rows = await publicSelect('combos', 'select=id,slug,name,type,price,image,items_json,active&active=eq.true&order=id.asc');
      if (rows.length) return { source: 'supabase', data: rows.map(row => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        type: row.type,
        price: Number(row.price),
        image: resolveImage(row.image),
        items: Array.isArray(row.items_json) ? row.items_json : [],
      })) };
    } catch (error) {
      console.warn('Combos remotos no disponibles; se usará el respaldo local.', error.message);
    }
    const fallback = await fetchJson('data/combos.json');
    return { source: 'local', data: fallback.map(item => ({ ...item, image: resolveImage(item.image) })) };
  }

  async function loadSettings() {
    try {
      const rows = await publicSelect('settings', 'select=setting_key,setting_value&order=setting_key.asc');
      const values = Object.fromEntries(rows.map(row => [row.setting_key, row.setting_value]));
      return { source: 'supabase', data: { ...DEFAULTS, ...values } };
    } catch (error) {
      console.warn('Configuración remota no disponible; se usarán valores seguros.', error.message);
      return { source: 'local', data: { ...DEFAULTS } };
    }
  }

  function applySettings(settings) {
    whatsapp = String(settings.whatsapp || DEFAULTS.whatsapp).replace(/\D/g, '') || DEFAULTS.whatsapp;
    document.body.dataset.whatsapp = whatsapp;
    $$('[data-setting-text]').forEach(node => {
      const value = settings[node.dataset.settingText];
      if (value) node.textContent = value;
    });
    $$('[data-setting-link]').forEach(node => {
      const value = settings[node.dataset.settingLink];
      if (value) node.href = value;
    });
    $$('[data-whatsapp-link]').forEach(node => {
      const message = node.dataset.message || ATTENTION_MESSAGE;
      node.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    });
    $$('[data-whatsapp-display]').forEach(node => {
      node.textContent = `+${whatsapp.slice(0, 3)} ${whatsapp.slice(3)}`;
    });
  }

  function renderCombos(combos) {
    const grid = $('#combo-grid');
    if (!grid) return;
    grid.innerHTML = combos.map(combo => {
      const payload = {
        key: `combo-${combo.slug || combo.id}`,
        kind: 'combo',
        name: combo.name,
        presentation: 'Combo',
        price: Number(combo.price),
        image: resolveImage(combo.image),
      };
      const items = (Array.isArray(combo.items) ? combo.items : []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
      return `<article class="combo-card">
        <img src="${escapeHtml(resolveImage(combo.image))}" alt="${escapeHtml(combo.name)}" loading="lazy" data-image-fallback>
        <div class="combo-card-body">
          <div><span>${escapeHtml(combo.type)}</span><h3>${escapeHtml(combo.name)}</h3></div>
          <strong>${money(combo.price)}</strong>
          <ul>${items}</ul>
          <button class="btn" type="button" data-add='${escapeHtml(JSON.stringify(payload))}'>+ Agregar combo</button>
        </div>
      </article>`;
    }).join('');
  }

  function renderPerfumes(perfumes) {
    const grid = $('#product-grid');
    const brandFilter = $('#brand-filter');
    if (!grid || !brandFilter) return;
    const brands = [...new Set(perfumes.map(item => String(item.brand || '').trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
    brandFilter.innerHTML = '<option value="">Todas las marcas</option>'
      + brands.map(brand => `<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`).join('');

    grid.innerHTML = perfumes.map((perfume, index) => {
      const image = resolveImage(perfume.image);
      const base = { name: perfume.name, brand: perfume.brand, image };
      const five = { ...base, key: `perfume-${perfume.id}-5`, kind: 'decant', presentation: '5 ml', price: Number(perfume.price5) };
      const ten = { ...base, key: `perfume-${perfume.id}-10`, kind: 'decant', presentation: '10 ml', price: Number(perfume.price10) };
      const full = { ...base, key: `perfume-${perfume.id}-full`, kind: 'bottle', presentation: 'Perfume completo', price: null };
      const fullButton = perfume.fullBottle === false ? ''
        : `<button class="full-bottle" type="button" data-add='${escapeHtml(JSON.stringify(full))}'>+ Pedir perfume completo</button>`;
      return `<article class="product-card" data-product data-name="${escapeHtml(normalizeText(`${perfume.name} ${perfume.brand}`))}" data-brand="${escapeHtml(perfume.brand)}" data-index="${index}" hidden>
        <div class="product-image-wrap">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(`${perfume.name} de ${perfume.brand}`)}" loading="lazy" data-image-fallback>
          ${perfume.preserveExact ? '<span class="exact-badge">Precio del catálogo</span>' : ''}
        </div>
        <div class="product-body">
          <p>${escapeHtml(perfume.brand)}</p>
          <h3>${escapeHtml(perfume.name)}</h3>
          <div class="price-row"><span>5 ml <strong>${money(perfume.price5)}</strong></span><span>10 ml <strong>${money(perfume.price10)}</strong></span></div>
          <div class="product-actions"><button type="button" data-add='${escapeHtml(JSON.stringify(five))}'>+ 5 ml</button><button type="button" data-add='${escapeHtml(JSON.stringify(ten))}'>+ 10 ml</button></div>
          ${fullButton}
        </div>
      </article>`;
    }).join('');

    const heroCount = $('#hero-perfume-count');
    if (heroCount) heroCount.textContent = perfumes.length;
  }

  function setStatus(message = '', kind = '') {
    const status = $('#catalog-status');
    if (!status) return;
    status.textContent = message;
    status.dataset.kind = kind;
    status.hidden = !message;
  }

  function openCart() {
    const panel = $('#cart-panel');
    const overlay = $('[data-close-cart].drawer-overlay');
    if (!panel || !overlay) return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    overlay.hidden = false;
    document.body.classList.add('no-scroll');
  }

  function closeCart() {
    const panel = $('#cart-panel');
    const overlay = $('[data-close-cart].drawer-overlay');
    panel?.classList.remove('open');
    panel?.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.hidden = true;
    document.body.classList.remove('no-scroll');
  }

  function saveCart() {
    try { localStorage.setItem('smell-cart', JSON.stringify(cart)); } catch {}
    renderCart();
  }

  function addItem(item) {
    if (!item?.key || !item?.name) return;
    const found = cart.find(entry => entry.key === item.key);
    if (found) found.quantity = Math.min(99, found.quantity + 1);
    else cart.push({ ...item, quantity: 1 });
    saveCart();
    openCart();
  }

  function renderCart() {
    const content = $('#cart-content');
    const footer = $('#cart-footer');
    const description = $('#cart-description');
    const subtotalNode = $('#cart-subtotal');
    if (!content || !footer || !description || !subtotalNode) return;
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
    const decantCount = cart.filter(item => item.kind === 'decant').reduce((sum, item) => sum + item.quantity, 0);
    $$('[data-cart-count]').forEach(badge => {
      badge.textContent = itemCount;
      badge.hidden = itemCount === 0;
    });
    description.textContent = itemCount
      ? `${itemCount} producto${itemCount === 1 ? '' : 's'} seleccionado${itemCount === 1 ? '' : 's'}`
      : 'Agrega perfumes o combos para comenzar.';
    footer.hidden = itemCount === 0;
    subtotalNode.textContent = money(subtotal);
    if (!itemCount) {
      content.innerHTML = '<div class="cart-empty"><b>▢</b><h3>Tu selección está vacía</h3><p>Elige decants, perfumes completos o uno de nuestros combos.</p><a class="btn" href="#catalogo" data-close-cart>Explorar perfumes</a></div>';
      return;
    }

    const items = cart.map(item => `<article class="cart-item">
      <img src="${escapeHtml(resolveImage(item.image))}" alt="" data-image-fallback>
      <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.presentation)}</span><em>${item.price === null ? 'A cotizar' : money(item.price)}</em>
        <div class="quantity"><button type="button" data-quantity="-1" data-key="${escapeHtml(item.key)}" aria-label="Quitar una unidad">−</button><span>${item.quantity}</span><button type="button" data-quantity="1" data-key="${escapeHtml(item.key)}" aria-label="Agregar una unidad">+</button></div>
      </div>
      <button class="remove-item" type="button" data-remove="${escapeHtml(item.key)}" aria-label="Eliminar ${escapeHtml(item.name)}">×</button>
    </article>`).join('');
    const discount = decantCount >= 3
      ? `<div class="discount-notice"><b>✦</b><div><strong>¡Aplica descuento!</strong><span>Seleccionaste ${decantCount} decants. Confirmaremos el precio final por WhatsApp.</span></div></div>`
      : '';
    content.innerHTML = `<div class="cart-items">${items}</div>${discount}<div class="checkout-form">
      <label>Tu nombre<input id="customer-name" maxlength="100" autocomplete="name" placeholder="Nombre para el pedido"></label>
      <label>Forma de pago preferida<select id="payment"><option>Por definir</option><option>QR</option><option>Efectivo</option><option>Transferencia</option></select></label>
      <label>Consulta adicional<textarea id="customer-notes" maxlength="500" rows="3" placeholder="Ej.: deseo confirmar disponibilidad…"></textarea></label>
      <label class="terms-check"><input id="accept-purchase-terms" type="checkbox"><span>He leído y acepto los <a href="terminos-y-condiciones" target="_blank" rel="noopener">términos y condiciones</a> y los <a href="terminos-de-compra" target="_blank" rel="noopener">términos de compra</a>.</span></label>
      <p class="checkout-error" id="checkout-error" role="alert" hidden></p>
    </div>`;
  }

  function filterCatalog() {
    const search = $('#catalog-search');
    const brandFilter = $('#brand-filter');
    if (!search || !brandFilter) return;
    const query = normalizeText(search.value);
    const brand = brandFilter.value;
    const cards = $$('[data-product]');
    const matches = cards.filter(card => (!query || card.dataset.name.includes(query)) && (!brand || card.dataset.brand === brand));
    cards.forEach(card => { card.hidden = true; });
    matches.slice(0, visible).forEach(card => { card.hidden = false; });
    if ($('#result-count')) $('#result-count').textContent = matches.length;
    if ($('#load-more')) $('#load-more').hidden = matches.length <= visible;
    if ($('#empty-state')) $('#empty-state').hidden = matches.length > 0;
    if ($('#clear-search')) $('#clear-search').hidden = !query;
  }

  function sendOrder() {
    if (!cart.length) return;
    const checkoutError = $('#checkout-error');
    if (!$('#accept-purchase-terms')?.checked) {
      if (checkoutError) {
        checkoutError.textContent = 'Debes aceptar los términos y condiciones y los términos de compra antes de continuar a WhatsApp.';
        checkoutError.hidden = false;
      }
      return;
    }
    if (checkoutError) checkoutError.hidden = true;
    const name = ($('#customer-name')?.value || '').trim();
    const payment = $('#payment')?.value || 'Por definir';
    const notes = ($('#customer-notes')?.value || '').trim();
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
    const decants = cart.filter(item => item.kind === 'decant').reduce((sum, item) => sum + item.quantity, 0);
    const lines = cart.map((item, index) => `${index + 1}. ${item.name}${item.brand ? ` – ${item.brand}` : ''}\n   ${item.presentation} × ${item.quantity} – ${item.price === null ? 'precio a cotizar' : money(Number(item.price) * item.quantity)}`);
    const message = [
      'Hola, Perfumería Smell 👋',
      'Quiero solicitar esta cotización:',
      '', ...lines, '',
      `Subtotal conocido: ${money(subtotal)}`,
      decants >= 3 ? `✅ Seleccioné ${decants} decants: aplica descuento especial.` : `Decants seleccionados: ${decants}.`,
      'Entrega: retiro en tienda.',
      `Forma de pago preferida: ${payment}.`,
      name ? `Nombre: ${name}.` : '',
      notes ? `Consulta adicional: ${notes}` : '',
      '', 'Quedo atento/a al precio final y a la confirmación del pedido.',
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const add = event.target.closest('[data-add]');
      if (add) {
        try { addItem(JSON.parse(add.dataset.add)); } catch { setStatus('No se pudo agregar ese producto. Recarga la página.', 'error'); }
        return;
      }
      if (event.target.closest('[data-open-cart]')) { openCart(); return; }
      if (event.target.closest('[data-close-cart]')) { closeCart(); return; }
      const quantity = event.target.closest('[data-quantity]');
      if (quantity) {
        const item = cart.find(entry => entry.key === quantity.dataset.key);
        if (item) item.quantity = Math.min(99, item.quantity + Number(quantity.dataset.quantity));
        cart = cart.filter(entry => entry.quantity > 0);
        saveCart();
        return;
      }
      const remove = event.target.closest('[data-remove]');
      if (remove) {
        cart = cart.filter(item => item.key !== remove.dataset.remove);
        saveCart();
        return;
      }
      if (event.target.closest('[data-menu-toggle]')) {
        const panel = $('[data-mobile-menu]');
        if (!panel) return;
        const open = !panel.classList.contains('open');
        panel.classList.toggle('open', open);
        panel.setAttribute('aria-hidden', String(!open));
        return;
      }
      if (event.target.closest('[data-mobile-menu] a')) {
        const panel = $('[data-mobile-menu]');
        panel?.classList.remove('open');
        panel?.setAttribute('aria-hidden', 'true');
      }
    });

    $('#catalog-search')?.addEventListener('input', () => { visible = 12; filterCatalog(); });
    $('#brand-filter')?.addEventListener('change', () => { visible = 12; filterCatalog(); });
    $('#clear-search')?.addEventListener('click', () => { $('#catalog-search').value = ''; visible = 12; filterCatalog(); });
    $('#reset-filters')?.addEventListener('click', () => {
      $('#catalog-search').value = '';
      $('#brand-filter').value = '';
      visible = 12;
      filterCatalog();
    });
    $('#load-more')?.addEventListener('click', () => { visible += 12; filterCatalog(); });
    $('#clear-cart')?.addEventListener('click', () => { cart = []; saveCart(); });
    $('#send-whatsapp')?.addEventListener('click', sendOrder);
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
    document.addEventListener('error', event => {
      const image = event.target.closest?.('img[data-image-fallback]');
      if (image && !image.dataset.fallbackApplied) {
        image.dataset.fallbackApplied = 'true';
        image.src = 'assets/img/brand/logo-smell.webp';
      }
    }, true);

    const cookieBanner = $('#cookie-banner');
    try {
      if (cookieBanner && localStorage.getItem('smell-cookie-notice') !== 'accepted') cookieBanner.hidden = false;
    } catch {
      if (cookieBanner) cookieBanner.hidden = false;
    }
    $('#accept-cookies')?.addEventListener('click', () => {
      try { localStorage.setItem('smell-cookie-notice', 'accepted'); } catch {}
      if (cookieBanner) cookieBanner.hidden = true;
    });
  }

  async function initialize() {
    cart = readCart();
    bindEvents();
    renderCart();
    $$('[data-current-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
    setStatus('Cargando catálogo…', 'loading');
    try {
      const [perfumeResult, comboResult, settingResult] = await Promise.all([
        loadPerfumes(), loadCombos(), loadSettings(),
      ]);
      applySettings(settingResult.data);
      renderCombos(comboResult.data);
      renderPerfumes(perfumeResult.data);
      visible = 12;
      filterCatalog();
      const usedFallback = [perfumeResult, comboResult, settingResult].some(result => result.source === 'local');
      setStatus(usedFallback ? 'Catálogo disponible. Algunos datos se cargaron desde el respaldo local.' : '', usedFallback ? 'notice' : '');
    } catch (error) {
      console.error(error);
      setStatus('No fue posible cargar el catálogo. Intenta recargar la página.', 'error');
    }
  }

  initialize();
})();
