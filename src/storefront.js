import { hydrateSettings, loadStorefront } from './lib/data.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = value => `${new Intl.NumberFormat('es-BO').format(Number(value) || 0)} Bs`;
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[char]));
const escapeAttribute = value => escapeHtml(value).replace(/`/g, '&#96;');

let cart = [];
let visible = 12;
let settings = { whatsapp: '59175631782' };

try {
  cart = JSON.parse(localStorage.getItem('smell-cart') || '[]');
  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}

function productPayload(product, presentation, kind, price, suffix) {
  return {
    key: `perfume-${product.id}-${suffix}`,
    kind,
    name: product.name,
    brand: product.brand,
    presentation,
    price,
    image: product.image
  };
}

function renderCombos(combos) {
  const grid = $('#combo-grid');
  if (!grid) return;

  grid.innerHTML = combos.map(combo => {
    const payload = {
      key: `combo-${combo.slug}`,
      kind: 'combo',
      name: combo.name,
      presentation: 'Combo',
      price: combo.price,
      image: combo.image
    };
    return `<article class="combo-card">
      <img src="${escapeAttribute(combo.image)}" alt="${escapeAttribute(combo.name)}" loading="lazy">
      <div class="combo-card-body">
        <div><span>${escapeHtml(combo.type)}</span><h3>${escapeHtml(combo.name)}</h3></div>
        <strong>${money(combo.price)}</strong>
        <ul>${combo.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        <button class="btn" data-add="${escapeAttribute(JSON.stringify(payload))}">+ Agregar combo</button>
      </div>
    </article>`;
  }).join('');
}

function renderProducts(perfumes) {
  const grid = $('#product-grid');
  const brandFilter = $('#brand-filter');
  if (!grid || !brandFilter) return;

  const brands = [...new Set(perfumes.map(perfume => perfume.brand))]
    .sort((left, right) => left.localeCompare(right, 'es', { sensitivity: 'base' }));
  brandFilter.innerHTML = '<option value="">Todas las marcas</option>' + brands
    .map(brand => `<option value="${escapeAttribute(brand)}">${escapeHtml(brand)}</option>`)
    .join('');

  grid.innerHTML = perfumes.map((perfume, index) => {
    const five = productPayload(perfume, '5 ml', 'decant', perfume.price5, '5');
    const ten = productPayload(perfume, '10 ml', 'decant', perfume.price10, '10');
    const full = productPayload(perfume, 'Perfume completo', 'bottle', null, 'full');
    return `<article class="product-card" data-product data-name="${escapeAttribute(`${perfume.name} ${perfume.brand}`.toLocaleLowerCase('es'))}" data-brand="${escapeAttribute(perfume.brand)}" data-index="${index}">
      <div class="product-image-wrap">
        <img src="${escapeAttribute(perfume.image)}" alt="${escapeAttribute(`${perfume.name} de ${perfume.brand}`)}" loading="lazy">
        ${perfume.preserveExact ? '<span class="exact-badge">Precio del catálogo</span>' : ''}
      </div>
      <div class="product-body">
        <p>${escapeHtml(perfume.brand)}</p>
        <h3>${escapeHtml(perfume.name)}</h3>
        <div class="price-row"><span>5 ml <strong>${money(perfume.price5)}</strong></span><span>10 ml <strong>${money(perfume.price10)}</strong></span></div>
        <div class="product-actions"><button data-add="${escapeAttribute(JSON.stringify(five))}">+ 5 ml</button><button data-add="${escapeAttribute(JSON.stringify(ten))}">+ 10 ml</button></div>
        ${perfume.fullBottle ? `<button class="full-bottle" data-add="${escapeAttribute(JSON.stringify(full))}">+ Pedir perfume completo</button>` : ''}
      </div>
    </article>`;
  }).join('');

  const heroCount = $('[data-perfume-count]');
  if (heroCount) heroCount.textContent = perfumes.length;
  filterCatalog();
}

function saveCart() {
  localStorage.setItem('smell-cart', JSON.stringify(cart));
  renderCart();
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
  if (!panel || !overlay) return;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  overlay.hidden = true;
  document.body.classList.remove('no-scroll');
}

function addItem(item) {
  if (!item?.key || !item?.name) return;
  const found = cart.find(entry => entry.key === item.key);
  if (found) found.quantity += 1;
  else cart.push({ ...item, quantity: 1 });
  saveCart();
  openCart();
}

function renderCart() {
  const content = $('#cart-content');
  const footer = $('#cart-footer');
  if (!content || !footer) return;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
  const decantCount = cart.filter(item => item.kind === 'decant').reduce((sum, item) => sum + item.quantity, 0);
  $$('[data-cart-count]').forEach(badge => {
    badge.textContent = itemCount;
    badge.hidden = itemCount === 0;
  });
  $('#cart-description').textContent = itemCount
    ? `${itemCount} producto${itemCount === 1 ? '' : 's'} seleccionado${itemCount === 1 ? '' : 's'}`
    : 'Agrega perfumes o combos para comenzar.';
  footer.hidden = itemCount === 0;
  $('#cart-subtotal').textContent = money(subtotal);

  if (!itemCount) {
    content.innerHTML = '<div class="cart-empty"><b>▢</b><h3>Tu selección está vacía</h3><p>Elige decants, perfumes completos o uno de nuestros combos.</p><a class="btn" href="#catalogo" data-close-cart>Explorar perfumes</a></div>';
    return;
  }

  const items = cart.map(item => `<article class="cart-item">
    <img src="${escapeAttribute(item.image)}" alt="">
    <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.presentation)}</span><em>${item.price === null ? 'A cotizar' : money(item.price)}</em>
      <div class="quantity"><button data-quantity="-1" data-key="${escapeAttribute(item.key)}" aria-label="Quitar una unidad">−</button><span>${item.quantity}</span><button data-quantity="1" data-key="${escapeAttribute(item.key)}" aria-label="Agregar una unidad">+</button></div>
    </div>
    <button class="remove-item" data-remove="${escapeAttribute(item.key)}" aria-label="Eliminar ${escapeAttribute(item.name)}">×</button>
  </article>`).join('');
  const discount = decantCount >= 3
    ? `<div class="discount-notice"><b>✦</b><div><strong>¡Aplica descuento!</strong><span>Seleccionaste ${decantCount} decants. Confirmaremos el precio final por WhatsApp.</span></div></div>`
    : '';
  content.innerHTML = `<div class="cart-items">${items}</div>${discount}<div class="checkout-form">
    <label>Tu nombre<input id="customer-name" maxlength="100" autocomplete="name" placeholder="Nombre para el pedido"></label>
    <label>Forma de pago preferida<select id="payment"><option>Por definir</option><option>QR</option><option>Efectivo</option><option>Transferencia</option></select></label>
    <label>Consulta adicional<textarea id="customer-notes" maxlength="500" rows="3" placeholder="Ej.: deseo confirmar disponibilidad…"></textarea></label>
    <label class="terms-check"><input id="accept-purchase-terms" type="checkbox"><span>He leído y acepto los <a href="/terminos-y-condiciones" target="_blank" rel="noopener">términos y condiciones</a> y los <a href="/terminos-de-compra" target="_blank" rel="noopener">términos de compra</a>.</span></label>
    <p class="checkout-error" id="checkout-error" role="alert" hidden></p>
  </div>`;
}

function filterCatalog() {
  const search = $('#catalog-search');
  const select = $('#brand-filter');
  if (!search || !select) return;
  const query = search.value.trim().toLocaleLowerCase('es');
  const brand = select.value;
  const matches = $$('[data-product]').filter(card => (!query || card.dataset.name.includes(query)) && (!brand || card.dataset.brand === brand));
  $$('[data-product]').forEach(card => { card.hidden = true; });
  matches.slice(0, visible).forEach(card => { card.hidden = false; });
  $('#result-count').textContent = matches.length;
  $('#load-more').hidden = matches.length <= visible;
  $('#empty-state').hidden = matches.length > 0;
  $('#clear-search').hidden = !query;
}

function sendWhatsApp() {
  if (!cart.length) return;
  const accepted = $('#accept-purchase-terms')?.checked;
  const error = $('#checkout-error');
  if (!accepted) {
    error.textContent = 'Debes aceptar los términos y condiciones y los términos de compra antes de continuar a WhatsApp.';
    error.hidden = false;
    return;
  }
  error.hidden = true;
  const name = ($('#customer-name')?.value || '').trim();
  const payment = $('#payment')?.value || 'Por definir';
  const notes = ($('#customer-notes')?.value || '').trim();
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
  const decants = cart.filter(item => item.kind === 'decant').reduce((sum, item) => sum + item.quantity, 0);
  const lines = cart.map((item, index) => `${index + 1}. ${item.name}${item.brand ? ` – ${item.brand}` : ''}\n   ${item.presentation} × ${item.quantity} – ${item.price === null ? 'precio a cotizar' : money(Number(item.price) * item.quantity)}`);
  const message = [
    'Hola, Perfumería Smell 👋', 'Quiero solicitar esta cotización:', '', ...lines, '',
    `Subtotal conocido: ${money(subtotal)}`,
    decants >= 3 ? `✅ Seleccioné ${decants} decants: aplica descuento especial.` : `Decants seleccionados: ${decants}.`,
    'Entrega: retiro en tienda.', `Forma de pago preferida: ${payment}.`,
    name ? `Nombre: ${name}.` : '', notes ? `Consulta adicional: ${notes}` : '', '',
    'Quedo atento/a al precio final y a la confirmación del pedido.'
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

function bindEvents() {
  document.addEventListener('click', event => {
    const add = event.target.closest('[data-add]');
    if (add) {
      try { addItem(JSON.parse(add.dataset.add)); } catch { /* Datos inválidos: no agregar. */ }
      return;
    }
    if (event.target.closest('[data-open-cart]')) { openCart(); return; }
    if (event.target.closest('[data-close-cart]')) { closeCart(); return; }
    const quantity = event.target.closest('[data-quantity]');
    if (quantity) {
      const item = cart.find(entry => entry.key === quantity.dataset.key);
      if (item) item.quantity += Number(quantity.dataset.quantity);
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
    const toggle = event.target.closest('[data-menu-toggle]');
    if (toggle) {
      const panel = $('[data-mobile-menu]');
      const open = !panel.classList.contains('open');
      panel.classList.toggle('open', open);
      panel.setAttribute('aria-hidden', String(!open));
    }
    if (event.target.closest('[data-mobile-menu] a')) $('[data-mobile-menu]').classList.remove('open');
  });

  $('#catalog-search')?.addEventListener('input', () => { visible = 12; filterCatalog(); });
  $('#brand-filter')?.addEventListener('change', () => { visible = 12; filterCatalog(); });
  $('#clear-search')?.addEventListener('click', () => { $('#catalog-search').value = ''; visible = 12; filterCatalog(); });
  $('#reset-filters')?.addEventListener('click', () => { $('#catalog-search').value = ''; $('#brand-filter').value = ''; visible = 12; filterCatalog(); });
  $('#load-more')?.addEventListener('click', () => { visible += 12; filterCatalog(); });
  $('#clear-cart')?.addEventListener('click', () => { cart = []; saveCart(); });
  $('#send-whatsapp')?.addEventListener('click', sendWhatsApp);

  const cookieBanner = $('#cookie-banner');
  if (cookieBanner && localStorage.getItem('smell-cookie-notice') !== 'accepted') cookieBanner.hidden = false;
  $('#accept-cookies')?.addEventListener('click', () => {
    localStorage.setItem('smell-cookie-notice', 'accepted');
    cookieBanner.hidden = true;
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
}

async function bootstrap() {
  bindEvents();
  renderCart();
  try {
    const data = await loadStorefront();
    settings = hydrateSettings(data.settings);
    renderCombos(data.combos);
    renderProducts(data.perfumes);
    const status = $('#catalog-status');
    if (status) {
      status.textContent = data.usedFallback
        ? 'Mostrando el respaldo local mientras se restablece la conexión.'
        : '';
      status.hidden = !data.usedFallback;
    }
  } catch (error) {
    console.error('No se pudo cargar el catálogo.', error);
    const status = $('#catalog-status');
    if (status) {
      status.textContent = 'No pudimos cargar el catálogo. Intenta nuevamente en unos minutos.';
      status.hidden = false;
    }
    $('#combo-grid').innerHTML = '<p class="catalog-load-error">Los combos no están disponibles temporalmente.</p>';
    $('#product-grid').innerHTML = '<p class="catalog-load-error">Los perfumes no están disponibles temporalmente.</p>';
  }
}

bootstrap();
