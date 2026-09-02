import { getPublicStorageUrl, STORAGE_BUCKET, supabase } from '../lib/supabase.js';

export { supabase };

export const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[char]));
export const money = value => `${new Intl.NumberFormat('es-BO').format(Number(value) || 0)} Bs`;

function loginRedirect(reason = '') {
  const next = `${location.pathname}${location.search}`;
  const params = new URLSearchParams({ next });
  if (reason) params.set('reason', reason);
  location.replace(`/admin/login?${params}`);
}

export async function findAdminProfile(userId) {
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('user_id,display_name,is_active')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function requireAdmin() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    loginRedirect();
    return null;
  }

  const profile = await findAdminProfile(user.id);
  if (!profile?.is_active) {
    await supabase.auth.signOut({ scope: 'local' });
    loginRedirect('unauthorized');
    return null;
  }
  return { user, profile };
}

function adminHeader(current, displayName) {
  const link = (key, href, label) => `<a class="${current === key ? 'active' : ''}" href="${href}">${label}</a>`;
  return `<header class="admin-header">
    <a class="admin-brand" href="/admin"><img src="/assets/img/brand/logo-smell.webp" alt="Smell">Administración Smell</a>
    <nav class="admin-nav" aria-label="Administración">
      ${link('dashboard', '/admin', 'Resumen')}
      ${link('perfumes', '/admin/perfumes', 'Perfumes')}
      ${link('combos', '/admin/combos', 'Combos')}
      ${link('settings', '/admin/settings', 'Negocio')}
      <a href="/" target="_blank" rel="noopener">Ver tienda</a>
      <button class="admin-signout" data-signout type="button">Salir</button>
    </nav>
    <span class="admin-user" title="Sesión activa">${escapeHtml(displayName)}</span>
  </header>`;
}

export async function initializeAdmin(current) {
  try {
    const auth = await requireAdmin();
    if (!auth) return null;
    document.querySelector('[data-admin-header]').innerHTML = adminHeader(current, auth.profile.display_name || auth.user.email);
    document.querySelector('[data-admin-loading]')?.setAttribute('hidden', '');
    document.querySelector('[data-admin-content]')?.removeAttribute('hidden');
    document.querySelector('[data-signout]')?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      location.replace('/admin/login');
    });
    return auth;
  } catch (error) {
    console.error('No se pudo verificar el acceso administrativo.', error);
    showNotice(document.querySelector('[data-admin-loading]'), 'error', 'No se pudo verificar la sesión. Recarga la página o vuelve a ingresar.');
    return null;
  }
}

export function showNotice(container, type, message) {
  if (!container) return;
  container.className = `notice ${type === 'ok' ? 'ok' : 'error'}`;
  container.textContent = message;
  container.hidden = false;
}

export function hideNotice(container) {
  if (container) container.hidden = true;
}

export async function uploadCatalogImage(file, folder, baseName) {
  if (!file || file.size === 0) return null;
  const allowed = new Map([
    ['image/jpeg', 'jpg'],
    ['image/png', 'png'],
    ['image/webp', 'webp']
  ]);
  if (!allowed.has(file.type)) throw new Error('La imagen debe ser JPG, PNG o WEBP.');
  if (file.size > 3 * 1024 * 1024) throw new Error('La imagen no puede superar 3 MB.');

  const path = `${folder}/${baseName}-${Date.now()}.${allowed.get(file.type)}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false
  });
  if (error) throw error;
  return getPublicStorageUrl(path);
}
