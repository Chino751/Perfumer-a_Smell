(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = value => `${new Intl.NumberFormat('es-BO').format(value)} Bs`;
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const whatsapp = document.body.dataset.whatsapp || '59175631782';
  let cart = [];
  let visible = 12;

  try { cart = JSON.parse(localStorage.getItem('smell-cart') || '[]'); } catch { cart = []; }

  const saveCart = () => {
    localStorage.setItem('smell-cart', JSON.stringify(cart));
    renderCart();
  };

  function openCart() {
    $('#cart-panel').classList.add('open');
    $('#cart-panel').setAttribute('aria-hidden', 'false');
    $('[data-close-cart].drawer-overlay').hidden = false;
    document.body.classList.add('no-scroll');
  }

  function closeCart() {
    $('#cart-panel').classList.remove('open');
    $('#cart-panel').setAttribute('aria-hidden', 'true');
    $('[data-close-cart].drawer-overlay').hidden = true;
    document.body.classList.remove('no-scroll');
  }

  function addItem(item) {
    const found = cart.find(entry => entry.key === item.key);
    if (found) found.quantity += 1;
    else cart.push({...item, quantity: 1});
    saveCart();
    openCart();
  }

  function renderCart() {
    const content = $('#cart-content');
    const footer = $('#cart-footer');
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
    const decantCount = cart.filter(item => item.kind === 'decant').reduce((sum, item) => sum + item.quantity, 0);
    $$('[data-cart-count]').forEach(badge => { badge.textContent = itemCount; badge.hidden = itemCount === 0; });
    $('#cart-description').textContent = itemCount ? `${itemCount} producto${itemCount === 1 ? '' : 's'} seleccionado${itemCount === 1 ? '' : 's'}` : 'Agrega perfumes o combos para comenzar.';
    footer.hidden = itemCount === 0;
    $('#cart-subtotal').textContent = money(subtotal);
    if (!itemCount) {
      content.innerHTML = '<div class="cart-empty"><b>▢</b><h3>Tu selección está vacía</h3><p>Elige decants, perfumes completos o uno de nuestros combos.</p><a class="btn" href="#catalogo" data-close-cart>Explorar perfumes</a></div>';
      return;
    }
    const items = cart.map(item => `<article class="cart-item"><img src="${escapeHtml(item.image)}" alt=""><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.presentation)}</span><em>${item.price === null ? 'A cotizar' : money(Number(item.price))}</em><div class="quantity"><button data-quantity="-1" data-key="${escapeHtml(item.key)}" aria-label="Quitar una unidad">−</button><span>${item.quantity}</span><button data-quantity="1" data-key="${escapeHtml(item.key)}" aria-label="Agregar una unidad">+</button></div></div><button class="remove-item" data-remove="${escapeHtml(item.key)}" aria-label="Eliminar ${escapeHtml(item.name)}">×</button></article>`).join('');
    const discount = decantCount >= 3 ? `<div class="discount-notice"><b>✦</b><div><strong>¡Aplica descuento!</strong><span>Seleccionaste ${decantCount} decants. Confirmaremos el precio final por WhatsApp.</span></div></div>` : '';
    content.innerHTML = `<div class="cart-items">${items}</div>${discount}<div class="checkout-form"><label>Tu nombre<input id="customer-name" maxlength="100" autocomplete="name" placeholder="Nombre para el pedido"></label><label>Forma de pago preferida<select id="payment"><option>Por definir</option><option>QR</option><option>Efectivo</option><option>Transferencia</option></select></label><label>Consulta adicional<textarea id="customer-notes" maxlength="500" rows="3" placeholder="Ej.: deseo confirmar disponibilidad…"></textarea></label><label class="terms-check"><input id="accept-purchase-terms" type="checkbox"><span>He leído y acepto los <a href="terminos-y-condiciones.php" target="_blank" rel="noopener">términos y condiciones</a> y los <a href="terminos-de-compra.php" target="_blank" rel="noopener">términos de compra</a>.</span></label><p class="checkout-error" id="checkout-error" role="alert" hidden></p></div>`;
  }

  function filterCatalog() {
    const query = ($('#catalog-search').value || '').trim().toLocaleLowerCase('es');
    const brand = $('#brand-filter').value;
    const matches = $$('[data-product]').filter(card => (!query || card.dataset.name.includes(query)) && (!brand || card.dataset.brand === brand));
    $$('[data-product]').forEach(card => card.hidden = true);
    matches.slice(0, visible).forEach(card => card.hidden = false);
    $('#result-count').textContent = matches.length;
    $('#load-more').hidden = matches.length <= visible;
    $('#empty-state').hidden = matches.length > 0;
    $('#clear-search').hidden = !query;
  }

  document.addEventListener('click', event => {
    const add = event.target.closest('[data-add]');
    if (add) { try { addItem(JSON.parse(add.dataset.add)); } catch {} return; }
    if (event.target.closest('[data-open-cart]')) { openCart(); return; }
    if (event.target.closest('[data-close-cart]')) { closeCart(); return; }
    const quantity = event.target.closest('[data-quantity]');
    if (quantity) {
      const item = cart.find(entry => entry.key === quantity.dataset.key);
      if (item) item.quantity += Number(quantity.dataset.quantity);
      cart = cart.filter(entry => entry.quantity > 0);
      saveCart(); return;
    }
    const remove = event.target.closest('[data-remove]');
    if (remove) { cart = cart.filter(item => item.key !== remove.dataset.remove); saveCart(); return; }
    const toggle = event.target.closest('[data-menu-toggle]');
    if (toggle) {
      const panel = $('[data-mobile-menu]');
      const open = !panel.classList.contains('open');
      panel.classList.toggle('open', open); panel.setAttribute('aria-hidden', String(!open));
    }
    if (event.target.closest('[data-mobile-menu] a')) $('[data-mobile-menu]').classList.remove('open');
  });

  $('#catalog-search').addEventListener('input', () => { visible = 12; filterCatalog(); });
  $('#brand-filter').addEventListener('change', () => { visible = 12; filterCatalog(); });
  $('#clear-search').addEventListener('click', () => { $('#catalog-search').value = ''; visible = 12; filterCatalog(); });
  $('#reset-filters').addEventListener('click', () => { $('#catalog-search').value = ''; $('#brand-filter').value = ''; visible = 12; filterCatalog(); });
  $('#load-more').addEventListener('click', () => { visible += 12; filterCatalog(); });
  $('#clear-cart').addEventListener('click', () => { cart = []; saveCart(); });
  $('#send-whatsapp').addEventListener('click', () => {
    if (!cart.length) return;
    const accepted = $('#accept-purchase-terms')?.checked;
    const checkoutError = $('#checkout-error');
    if (!accepted) {
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
    const message = ['Hola, Perfumería Smell 👋', 'Quiero solicitar esta cotización:', '', ...lines, '', `Subtotal conocido: ${money(subtotal)}`, decants >= 3 ? `✅ Seleccioné ${decants} decants: aplica descuento especial.` : `Decants seleccionados: ${decants}.`, 'Entrega: retiro en tienda.', `Forma de pago preferida: ${payment}.`, name ? `Nombre: ${name}.` : '', notes ? `Consulta adicional: ${notes}` : '', '', 'Quedo atento/a al precio final y a la confirmación del pedido.'].filter(Boolean).join('\n');
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });

  const cookieBanner = $('#cookie-banner');
  const acceptCookies = $('#accept-cookies');
  if (cookieBanner && localStorage.getItem('smell-cookie-notice') !== 'accepted') cookieBanner.hidden = false;
  acceptCookies?.addEventListener('click', () => {
    localStorage.setItem('smell-cookie-notice', 'accepted');
    cookieBanner.hidden = true;
  });

  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
  filterCatalog();
  renderCart();
})();
