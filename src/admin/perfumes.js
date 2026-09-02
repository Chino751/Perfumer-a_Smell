import { normalizeImageUrl } from '../lib/supabase.js';
import { escapeHtml, hideNotice, initializeAdmin, money, showNotice, supabase, uploadCatalogImage } from './shared.js';

let rows = [];
let editing = null;
const notice = document.querySelector('#perfume-notice');
const tableBody = document.querySelector('#perfume-rows');
const editPanel = document.querySelector('#perfume-edit-panel');
const form = document.querySelector('#perfume-form');
const search = document.querySelector('#perfume-search');

function renderTable() {
  const query = search.value.trim().toLocaleLowerCase('es');
  const filtered = rows.filter(row => !query || `${row.name} ${row.brand}`.toLocaleLowerCase('es').includes(query));
  tableBody.innerHTML = filtered.map(row => `<tr>
    <td data-label="Imagen"><img class="thumb" src="${escapeHtml(normalizeImageUrl(row.image))}" alt=""></td>
    <td data-label="Perfume"><strong>${escapeHtml(row.name)}</strong><br><span>${escapeHtml(row.brand)}</span></td>
    <td data-label="5 ml">${money(row.price_5)}</td><td data-label="10 ml">${money(row.price_10)}</td>
    <td data-label="Stock">${row.stock_5} / ${row.stock_10} / ${row.stock_full}</td>
    <td data-label="Estado">${row.active ? 'Visible' : 'Oculto'}${row.preserve_exact ? ' · Protegido' : ''}</td>
    <td><button class="btn light" data-edit-perfume="${row.id}" type="button">Editar</button></td>
  </tr>`).join('');
  document.querySelector('#perfume-result-count').textContent = filtered.length;
}

async function loadPerfumes() {
  const { data, error } = await supabase.from('perfumes').select('*').order('id');
  if (error) throw error;
  rows = data;
  renderTable();
}

function openEditor(id) {
  editing = rows.find(row => row.id === Number(id));
  if (!editing) return;
  form.elements.id.value = editing.id;
  form.elements.name.value = editing.name;
  form.elements.brand.value = editing.brand;
  form.elements.price_5.value = editing.price_5;
  form.elements.price_10.value = editing.price_10;
  form.elements.stock_5.value = editing.stock_5;
  form.elements.stock_10.value = editing.stock_10;
  form.elements.stock_full.value = editing.stock_full;
  form.elements.active.checked = editing.active;
  form.elements.image.value = '';
  form.elements.price_5.disabled = editing.preserve_exact;
  form.elements.price_10.disabled = editing.preserve_exact;
  const locked = document.querySelector('#protected-price');
  locked.hidden = !editing.preserve_exact;
  locked.textContent = editing.preserve_exact
    ? `Los precios de este perfume están protegidos: 5 ml = ${money(editing.price_5)}; 10 ml = ${money(editing.price_10)}.`
    : '';
  document.querySelector('#perfume-edit-title').textContent = `Editar: ${editing.name}`;
  editPanel.hidden = false;
  editPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeEditor() {
  editing = null;
  form.reset();
  editPanel.hidden = true;
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-edit-perfume]');
  if (button) openEditor(button.dataset.editPerfume);
});
document.querySelector('#cancel-perfume-edit').addEventListener('click', closeEditor);
search.addEventListener('input', renderTable);
document.querySelector('#clear-perfume-search').addEventListener('click', () => { search.value = ''; renderTable(); });

form.addEventListener('submit', async event => {
  event.preventDefault();
  hideNotice(notice);
  if (!editing) return;
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Guardando…';
  try {
    const name = form.elements.name.value.trim();
    const brand = form.elements.brand.value.trim();
    const price5 = editing.preserve_exact ? Number(editing.price_5) : Number(form.elements.price_5.value);
    const price10 = editing.preserve_exact ? Number(editing.price_10) : Number(form.elements.price_10.value);
    const stock5 = Number(form.elements.stock_5.value);
    const stock10 = Number(form.elements.stock_10.value);
    const stockFull = Number(form.elements.stock_full.value);
    if (!name || !brand) throw new Error('Nombre y marca son obligatorios.');
    if ([price5, price10, stock5, stock10, stockFull].some(value => !Number.isFinite(value) || value < 0)) throw new Error('Los precios y el stock deben ser números iguales o mayores que cero.');

    const image = await uploadCatalogImage(form.elements.image.files[0], 'products', `perfume-${editing.id}`);
    const changes = {
      name,
      brand,
      price_5: price5,
      price_10: price10,
      stock_5: Math.trunc(stock5),
      stock_10: Math.trunc(stock10),
      stock_full: Math.trunc(stockFull),
      active: form.elements.active.checked
    };
    if (image) changes.image = image;
    const { error } = await supabase.from('perfumes').update(changes).eq('id', editing.id);
    if (error) throw error;
    await loadPerfumes();
    closeEditor();
    showNotice(notice, 'ok', 'Perfume actualizado correctamente.');
  } catch (error) {
    console.error(error);
    showNotice(notice, 'error', error.message || 'No se pudo actualizar el perfume.');
  } finally {
    submit.disabled = false;
    submit.textContent = 'Guardar cambios';
  }
});

if (await initializeAdmin('perfumes')) {
  try { await loadPerfumes(); }
  catch (error) { console.error(error); showNotice(notice, 'error', 'No se pudo cargar la lista de perfumes.'); }
}
