import { normalizeImageUrl } from '../lib/supabase.js';
import { escapeHtml, hideNotice, initializeAdmin, money, showNotice, supabase, uploadCatalogImage } from './shared.js';

let rows = [];
let editing = null;
const notice = document.querySelector('#combo-notice');
const tableBody = document.querySelector('#combo-rows');
const editPanel = document.querySelector('#combo-edit-panel');
const form = document.querySelector('#combo-form');

function renderTable() {
  tableBody.innerHTML = rows.map(row => `<tr>
    <td data-label="Imagen"><img class="thumb" src="${escapeHtml(normalizeImageUrl(row.image))}" alt=""></td>
    <td data-label="Combo"><strong>${escapeHtml(row.name)}</strong><br>${escapeHtml(row.type)}</td>
    <td data-label="Productos" class="combo-items">${escapeHtml((row.items_json || []).join(' · '))}</td>
    <td data-label="Precio">${money(row.price)}</td><td data-label="Estado">${row.active ? 'Visible' : 'Oculto'}</td>
    <td><button class="btn light" data-edit-combo="${row.id}" type="button">Editar</button></td>
  </tr>`).join('');
}

async function loadCombos() {
  const { data, error } = await supabase.from('combos').select('*').order('id');
  if (error) throw error;
  rows = data;
  renderTable();
}

function openEditor(id) {
  editing = rows.find(row => row.id === Number(id));
  if (!editing) return;
  form.elements.id.value = editing.id;
  form.elements.name.value = editing.name;
  form.elements.type.value = editing.type;
  form.elements.price.value = editing.price;
  form.elements.items.value = (editing.items_json || []).join('\n');
  form.elements.active.checked = editing.active;
  form.elements.image.value = '';
  document.querySelector('#combo-edit-title').textContent = `Editar: ${editing.name}`;
  editPanel.hidden = false;
  editPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeEditor() {
  editing = null;
  form.reset();
  editPanel.hidden = true;
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-edit-combo]');
  if (button) openEditor(button.dataset.editCombo);
});
document.querySelector('#cancel-combo-edit').addEventListener('click', closeEditor);

form.addEventListener('submit', async event => {
  event.preventDefault();
  hideNotice(notice);
  if (!editing) return;
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Guardando…';
  try {
    const name = form.elements.name.value.trim();
    const type = form.elements.type.value.trim();
    const price = Number(form.elements.price.value);
    const items = form.elements.items.value.split(/\r?\n/).map(item => item.trim()).filter(Boolean);
    if (!name || !type || !items.length) throw new Error('Completa nombre, presentación y productos.');
    if (!Number.isFinite(price) || price < 0) throw new Error('El precio debe ser igual o mayor que cero.');
    const image = await uploadCatalogImage(form.elements.image.files[0], 'combos', `combo-${editing.id}`);
    const changes = { name, type, price, items_json: items, active: form.elements.active.checked };
    if (image) changes.image = image;
    const { error } = await supabase.from('combos').update(changes).eq('id', editing.id);
    if (error) throw error;
    await loadCombos();
    closeEditor();
    showNotice(notice, 'ok', 'Combo actualizado correctamente.');
  } catch (error) {
    console.error(error);
    showNotice(notice, 'error', error.message || 'No se pudo actualizar el combo.');
  } finally {
    submit.disabled = false;
    submit.textContent = 'Guardar cambios';
  }
});

if (await initializeAdmin('combos')) {
  try { await loadCombos(); }
  catch (error) { console.error(error); showNotice(notice, 'error', 'No se pudo cargar la lista de combos.'); }
}
