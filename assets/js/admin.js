import {
  authSelect,
  authUpdate,
  authUpsert,
  requireAdminProfile,
  signOut,
  SupabaseRequestError,
  uploadCatalogImage,
} from './supabase.js';

const DEFAULT_SETTINGS = Object.freeze({
  whatsapp: '59175631782',
  maps_url: 'https://maps.app.goo.gl/DAhQgRibsNEDLpxC8',
  hours: '08:00 a 22:00',
  discount_text: 'Descuento especial desde 3 decants',
  instagram_url: 'https://www.instagram.com/perfumeria._smell',
  tiktok_url: 'https://www.tiktok.com/@perfumeria.smell_',
});
const TITLES = Object.freeze({
  summary: 'Resumen general',
  perfumes: 'Gestión de perfumes',
  combos: 'Gestión de combos',
  settings: 'Datos del negocio',
});
const state = { perfumes: [], combos: [], settings: { ...DEFAULT_SETTINGS } };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character]));
const normalize = value => String(value ?? '').trim().toLocaleLowerCase('es');
const money = value => `${new Intl.NumberFormat('es-BO', { maximumFractionDigits: 2 }).format(Number(value) || 0)} Bs`;

function resolveImage(path) {
  const value = String(path || '').trim();
  if (/^https:\/\//i.test(value)) return value;
  if (/^\/assets\/products\//i.test(value)) return value.replace('/assets/products/', '/assets/img/products/');
  if (/^\/assets\/combos\//i.test(value)) return value.replace('/assets/combos/', '/assets/img/combos/');
  if (/^assets\//i.test(value)) return `/${value}`;
  if (/^\/assets\//i.test(value)) return value;
  return '/assets/img/brand/logo-smell.webp';
}

function showNotice(message, kind = 'ok') {
  const notice = $('#admin-notice');
  notice.textContent = message;
  notice.className = `notice ${kind}`;
  notice.hidden = false;
  notice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  window.clearTimeout(showNotice.timer);
  showNotice.timer = window.setTimeout(() => { notice.hidden = true; }, 6000);
}

function friendlyError(error) {
  if (error?.status === 401) return 'La sesión terminó. Ingresa nuevamente.';
  if (error?.status === 403) return 'Tu cuenta no tiene permiso para realizar esta acción.';
  if (error?.status === 409) return 'El cambio entra en conflicto con un registro existente.';
  return error instanceof SupabaseRequestError ? error.message : 'Ocurrió un error inesperado. Intenta nuevamente.';
}

function integerValue(input, label) {
  const value = Number(input.value);
  if (!Number.isInteger(value) || value < 0) throw new Error(`${label} debe ser un número entero igual o mayor que cero.`);
  return value;
}

function decimalValue(input, label) {
  const value = Number(input.value);
  if (!Number.isFinite(value) || value < 0) throw new Error(`${label} debe ser un número válido igual o mayor que cero.`);
  return value;
}

function switchView(view, updateHash = true) {
  const selected = TITLES[view] ? view : 'summary';
  $$('[data-view]').forEach(section => { section.hidden = section.dataset.view !== selected; });
  $$('.admin-nav [data-view-target]').forEach(button => button.classList.toggle('active', button.dataset.viewTarget === selected));
  $('#view-title').textContent = TITLES[selected];
  if (updateHash && window.location.hash !== `#${selected}`) history.replaceState(null, '', `#${selected}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderStats() {
  $('#stat-perfumes').textContent = state.perfumes.length;
  $('#stat-active').textContent = state.perfumes.filter(item => item.active).length;
  $('#stat-combos').textContent = state.combos.filter(item => item.active).length;
  $('#stat-stock').textContent = state.perfumes.reduce((sum, item) => sum + Number(item.stock_5 || 0) + Number(item.stock_10 || 0) + Number(item.stock_full || 0), 0);
}

function renderPerfumes() {
  const query = normalize($('#perfume-search').value);
  const visibility = $('#perfume-visibility').value;
  const matches = state.perfumes.filter(item => {
    const textMatch = !query || normalize(`${item.name} ${item.brand}`).includes(query);
    const visibilityMatch = visibility === 'all' || (visibility === 'active' ? item.active : !item.active);
    return textMatch && visibilityMatch;
  });
  $('#perfume-count').textContent = `${matches.length} registro${matches.length === 1 ? '' : 's'}`;
  $('#perfume-empty').hidden = matches.length > 0;
  $('#perfume-rows').innerHTML = matches.map(item => `<tr>
    <td data-label="Imagen"><img class="thumb" src="${escapeHtml(resolveImage(item.image))}" alt="" data-admin-image></td>
    <td data-label="Perfume"><strong>${escapeHtml(item.name)}</strong><span class="cell-subtitle">${escapeHtml(item.brand)} · diapositiva ${item.slide}</span>${item.preserve_exact ? '<span class="mini-badge protected">Precio exacto</span>' : ''}</td>
    <td data-label="Precios"><span class="price-stack">5 ml: <strong>${money(item.price_5)}</strong><br>10 ml: <strong>${money(item.price_10)}</strong></span></td>
    <td data-label="Existencias"><span class="stock-stack">5 ml: ${item.stock_5}<br>10 ml: ${item.stock_10}<br>Completo: ${item.stock_full}</span></td>
    <td data-label="Estado"><span class="mini-badge ${item.active ? 'visible' : 'hidden'}">${item.active ? 'Visible' : 'Oculto'}</span></td>
    <td data-label="Acción"><button class="btn compact" type="button" data-edit-perfume="${item.id}">Editar</button></td>
  </tr>`).join('');
}

function renderCombos() {
  const query = normalize($('#combo-search').value);
  const matches = state.combos.filter(item => !query || normalize(`${item.name} ${item.type}`).includes(query));
  $('#combo-count').textContent = `${matches.length} registro${matches.length === 1 ? '' : 's'}`;
  $('#combo-empty').hidden = matches.length > 0;
  $('#combo-rows').innerHTML = matches.map(item => {
    const items = Array.isArray(item.items_json) ? item.items_json : [];
    return `<tr>
      <td data-label="Imagen"><img class="thumb" src="${escapeHtml(resolveImage(item.image))}" alt="" data-admin-image></td>
      <td data-label="Combo"><strong>${escapeHtml(item.name)}</strong><span class="cell-subtitle">${escapeHtml(item.type)}</span></td>
      <td data-label="Contenido"><span class="combo-items">${items.map(escapeHtml).join('<br>')}</span></td>
      <td data-label="Precio"><strong>${money(item.price)}</strong></td>
      <td data-label="Estado"><span class="mini-badge ${item.active ? 'visible' : 'hidden'}">${item.active ? 'Visible' : 'Oculto'}</span></td>
      <td data-label="Acción"><button class="btn compact" type="button" data-edit-combo="${item.id}">Editar</button></td>
    </tr>`;
  }).join('');
}

function fillSettingsForm() {
  Object.entries(state.settings).forEach(([key, value]) => {
    const input = $(`#setting-${key}`);
    if (input) input.value = value;
  });
}

function openPerfumeDialog(id) {
  const item = state.perfumes.find(row => String(row.id) === String(id));
  if (!item) return;
  $('#perfume-id').value = item.id;
  $('#perfume-dialog-title').textContent = item.name;
  $('#perfume-name').value = item.name;
  $('#perfume-brand').value = item.brand;
  $('#perfume-price-5').value = item.price_5;
  $('#perfume-price-10').value = item.price_10;
  $('#perfume-stock-5').value = item.stock_5;
  $('#perfume-stock-10').value = item.stock_10;
  $('#perfume-stock-full').value = item.stock_full;
  $('#perfume-active').checked = Boolean(item.active);
  $('#perfume-image').value = '';
  $('#perfume-price-5').disabled = Boolean(item.preserve_exact);
  $('#perfume-price-10').disabled = Boolean(item.preserve_exact);
  $('#protected-price-note').hidden = !item.preserve_exact;
  $('#perfume-dialog').showModal();
}

function openComboDialog(id) {
  const item = state.combos.find(row => String(row.id) === String(id));
  if (!item) return;
  $('#combo-id').value = item.id;
  $('#combo-dialog-title').textContent = item.name;
  $('#combo-name').value = item.name;
  $('#combo-type').value = item.type;
  $('#combo-price').value = item.price;
  $('#combo-items').value = (Array.isArray(item.items_json) ? item.items_json : []).join('\n');
  $('#combo-active').checked = Boolean(item.active);
  $('#combo-image').value = '';
  $('#combo-dialog').showModal();
}

function closeDialogs() {
  $$('.edit-dialog[open]').forEach(dialog => dialog.close());
}

function setButtonBusy(button, busy, busyText, normalText) {
  button.disabled = busy;
  button.textContent = busy ? busyText : normalText;
}

async function savePerfume(event) {
  event.preventDefault();
  const id = $('#perfume-id').value;
  const current = state.perfumes.find(item => String(item.id) === String(id));
  if (!current) return;
  const button = $('#save-perfume');
  setButtonBusy(button, true, 'Guardando…', 'Guardar cambios');
  try {
    const name = $('#perfume-name').value.trim();
    const brand = $('#perfume-brand').value.trim();
    if (!name || !brand) throw new Error('Nombre y marca son obligatorios.');
    const values = {
      name,
      brand,
      stock_5: integerValue($('#perfume-stock-5'), 'Existencias de 5 ml'),
      stock_10: integerValue($('#perfume-stock-10'), 'Existencias de 10 ml'),
      stock_full: integerValue($('#perfume-stock-full'), 'Existencias de perfume completo'),
      active: $('#perfume-active').checked,
    };
    if (!current.preserve_exact) {
      values.price_5 = decimalValue($('#perfume-price-5'), 'Precio de 5 ml');
      values.price_10 = decimalValue($('#perfume-price-10'), 'Precio de 10 ml');
    }
    const image = $('#perfume-image').files[0];
    if (image) values.image = await uploadCatalogImage(image, 'products', `perfume-${id}`);
    const updated = await authUpdate('perfumes', `id=eq.${encodeURIComponent(id)}`, values);
    if (!updated[0]) throw new SupabaseRequestError('La base de datos no confirmó la actualización.');
    state.perfumes = state.perfumes.map(item => String(item.id) === String(id) ? updated[0] : item);
    renderPerfumes();
    renderStats();
    closeDialogs();
    showNotice('Perfume actualizado correctamente.');
  } catch (error) {
    showNotice(error instanceof Error && !(error instanceof SupabaseRequestError) ? error.message : friendlyError(error), 'error');
  } finally {
    setButtonBusy(button, false, 'Guardando…', 'Guardar cambios');
  }
}

async function saveCombo(event) {
  event.preventDefault();
  const id = $('#combo-id').value;
  const current = state.combos.find(item => String(item.id) === String(id));
  if (!current) return;
  const button = $('#save-combo');
  setButtonBusy(button, true, 'Guardando…', 'Guardar cambios');
  try {
    const name = $('#combo-name').value.trim();
    const type = $('#combo-type').value.trim();
    const items = $('#combo-items').value.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
    if (!name || !type || !items.length) throw new Error('Nombre, presentación y al menos un producto son obligatorios.');
    const values = {
      name,
      type,
      price: decimalValue($('#combo-price'), 'Precio'),
      items_json: items,
      active: $('#combo-active').checked,
    };
    const image = $('#combo-image').files[0];
    if (image) values.image = await uploadCatalogImage(image, 'combos', `combo-${id}`);
    const updated = await authUpdate('combos', `id=eq.${encodeURIComponent(id)}`, values);
    if (!updated[0]) throw new SupabaseRequestError('La base de datos no confirmó la actualización.');
    state.combos = state.combos.map(item => String(item.id) === String(id) ? updated[0] : item);
    renderCombos();
    renderStats();
    closeDialogs();
    showNotice('Combo actualizado correctamente.');
  } catch (error) {
    showNotice(error instanceof Error && !(error instanceof SupabaseRequestError) ? error.message : friendlyError(error), 'error');
  } finally {
    setButtonBusy(button, false, 'Guardando…', 'Guardar cambios');
  }
}

async function saveSettings(event) {
  event.preventDefault();
  const button = $('#save-settings');
  setButtonBusy(button, true, 'Guardando…', 'Guardar información');
  try {
    const values = {
      whatsapp: $('#setting-whatsapp').value.replace(/\D/g, ''),
      hours: $('#setting-hours').value.trim(),
      maps_url: $('#setting-maps_url').value.trim(),
      instagram_url: $('#setting-instagram_url').value.trim(),
      tiktok_url: $('#setting-tiktok_url').value.trim(),
      discount_text: $('#setting-discount_text').value.trim(),
    };
    if (values.whatsapp.length < 8 || values.whatsapp.length > 20) throw new Error('WhatsApp debe incluir código de país y solo números.');
    if (!values.hours || !values.discount_text) throw new Error('Horario y texto del descuento son obligatorios.');
    for (const key of ['maps_url', 'instagram_url', 'tiktok_url']) {
      const url = new URL(values[key]);
      if (url.protocol !== 'https:') throw new Error('Los enlaces deben comenzar con https://');
    }
    const rows = Object.entries(values).map(([setting_key, setting_value]) => ({ setting_key, setting_value }));
    await authUpsert('settings', rows, 'setting_key');
    state.settings = { ...state.settings, ...values };
    fillSettingsForm();
    showNotice('Datos del negocio actualizados correctamente.');
  } catch (error) {
    showNotice(error instanceof Error && !(error instanceof SupabaseRequestError) ? error.message : friendlyError(error), 'error');
  } finally {
    setButtonBusy(button, false, 'Guardando…', 'Guardar información');
  }
}

function bindEvents() {
  document.addEventListener('click', event => {
    const viewButton = event.target.closest('[data-view-target]');
    if (viewButton) { switchView(viewButton.dataset.viewTarget); return; }
    const perfumeButton = event.target.closest('[data-edit-perfume]');
    if (perfumeButton) { openPerfumeDialog(perfumeButton.dataset.editPerfume); return; }
    const comboButton = event.target.closest('[data-edit-combo]');
    if (comboButton) { openComboDialog(comboButton.dataset.editCombo); return; }
    if (event.target.closest('[data-close-dialog]')) closeDialogs();
  });
  $$('.edit-dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  }));
  $('#perfume-search').addEventListener('input', renderPerfumes);
  $('#perfume-visibility').addEventListener('change', renderPerfumes);
  $('#combo-search').addEventListener('input', renderCombos);
  $('#perfume-form').addEventListener('submit', savePerfume);
  $('#combo-form').addEventListener('submit', saveCombo);
  $('#settings-form').addEventListener('submit', saveSettings);
  $('#logout').addEventListener('click', async () => {
    $('#logout').disabled = true;
    try { await signOut(); } finally { window.location.replace('/admin/login'); }
  });
  document.addEventListener('error', event => {
    const image = event.target.closest?.('img[data-admin-image]');
    if (image && !image.dataset.fallbackApplied) {
      image.dataset.fallbackApplied = 'true';
      image.src = '/assets/img/brand/logo-smell.webp';
    }
  }, true);
}

async function initialize() {
  bindEvents();
  try {
    const { profile } = await requireAdminProfile();
    $('#admin-name').textContent = profile.display_name || 'Administrador';
    const [perfumes, combos, settingRows] = await Promise.all([
      authSelect('perfumes', 'select=id,slide,name,brand,price_5,price_10,image,full_bottle,preserve_exact,stock_5,stock_10,stock_full,active&order=id.asc'),
      authSelect('combos', 'select=id,slug,name,type,price,image,items_json,active&order=id.asc'),
      authSelect('settings', 'select=setting_key,setting_value&order=setting_key.asc'),
    ]);
    state.perfumes = perfumes;
    state.combos = combos;
    state.settings = { ...DEFAULT_SETTINGS, ...Object.fromEntries(settingRows.map(row => [row.setting_key, row.setting_value])) };
    renderStats();
    renderPerfumes();
    renderCombos();
    fillSettingsForm();
    $('#connection-state').textContent = 'Conectado a Supabase';
    $('#connection-state').classList.add('online');
    const requested = window.location.hash.replace('#', '');
    switchView(TITLES[requested] ? requested : 'summary', false);
  } catch (error) {
    console.error(error);
    if (error?.status === 401 || error?.status === 403) {
      window.location.replace('/admin/login');
      return;
    }
    $('#connection-state').textContent = 'Sin conexión';
    showNotice(friendlyError(error), 'error');
  } finally {
    $('#admin-loading').hidden = true;
  }
}

initialize();
