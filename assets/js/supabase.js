/**
 * Cliente mínimo de Supabase para Perfumería Smell.
 *
 * La clave incluida aquí es una clave PUBLICABLE. Está diseñada para usarse
 * en el navegador; la seguridad real la aplican las políticas RLS de Postgres.
 * Nunca se debe colocar una clave secret o service_role en este archivo.
 */
export const SUPABASE_URL = 'https://atevowxmcunpujnbvfeg.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_u7areJ2T_QhKkeLGC1MLCw_68UDdkXL';
export const CATALOG_BUCKET = 'catalog-media';

const SESSION_KEY = 'smell-admin-session-v1';
const REQUEST_TIMEOUT = 15000;
let refreshInFlight = null;

export class SupabaseRequestError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'SupabaseRequestError';
    this.status = status;
    this.details = details;
  }
}

function messageFromPayload(payload, fallback) {
  if (!payload || typeof payload !== 'object') return fallback;
  return payload.message
    || payload.msg
    || payload.error_description
    || payload.error
    || payload.hint
    || fallback;
}

function withTimeout(timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);
  return { controller, stop: () => window.clearTimeout(timer) };
}

async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    token = SUPABASE_PUBLISHABLE_KEY,
    headers = {},
    timeout = REQUEST_TIMEOUT,
  } = options;
  const timed = withTimeout(timeout);
  const finalHeaders = {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    ...headers,
  };

  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  let finalBody = body;
  if (body !== undefined && !(body instanceof FormData) && !(body instanceof Blob)) {
    finalHeaders['Content-Type'] = finalHeaders['Content-Type'] || 'application/json';
    finalBody = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${SUPABASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: finalBody,
      signal: timed.controller.signal,
      credentials: 'omit',
    });
    const raw = await response.text();
    let payload = null;
    if (raw) {
      try { payload = JSON.parse(raw); } catch { payload = raw; }
    }

    if (!response.ok) {
      throw new SupabaseRequestError(
        messageFromPayload(payload, `La solicitud falló (${response.status}).`),
        response.status,
        payload,
      );
    }
    return payload;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new SupabaseRequestError('La conexión tardó demasiado. Intenta nuevamente.', 0);
    }
    if (error instanceof SupabaseRequestError) throw error;
    throw new SupabaseRequestError('No se pudo conectar con el servicio. Revisa tu conexión.', 0, error);
  } finally {
    timed.stop();
  }
}

export async function publicSelect(table, query = '') {
  const suffix = query ? `?${query}` : '';
  const result = await request(`/rest/v1/${encodeURIComponent(table)}${suffix}`);
  return Array.isArray(result) ? result : [];
}

export function loadSession() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    return parsed?.access_token && parsed?.refresh_token ? parsed : null;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function saveSession(session) {
  const normalized = {
    ...session,
    _expires_at_ms: session._expires_at_ms
      || (session.expires_at ? Number(session.expires_at) * 1000 : Date.now() + Number(session.expires_in || 3600) * 1000),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
  return normalized;
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export async function signInWithPassword(email, password) {
  const payload = await request('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: { email, password },
  });
  if (!payload?.access_token || !payload?.refresh_token) {
    throw new SupabaseRequestError('Supabase no devolvió una sesión válida.', 0, payload);
  }
  return saveSession(payload);
}

export async function refreshSession() {
  if (refreshInFlight) return refreshInFlight;
  const current = loadSession();
  if (!current?.refresh_token) throw new SupabaseRequestError('La sesión terminó. Ingresa nuevamente.', 401);

  refreshInFlight = request('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    body: { refresh_token: current.refresh_token },
  }).then(payload => {
    if (!payload?.access_token || !payload?.refresh_token) {
      throw new SupabaseRequestError('No se pudo renovar la sesión.', 401, payload);
    }
    return saveSession(payload);
  }).catch(error => {
    clearSession();
    throw error;
  }).finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

async function validSession() {
  const session = loadSession();
  if (!session) throw new SupabaseRequestError('Debes iniciar sesión.', 401);
  if (Number(session._expires_at_ms || 0) - Date.now() < 60000) return refreshSession();
  return session;
}

async function authenticatedRequest(path, options = {}, canRetry = true) {
  const session = await validSession();
  try {
    return await request(path, { ...options, token: session.access_token });
  } catch (error) {
    if (canRetry && error instanceof SupabaseRequestError && error.status === 401) {
      const renewed = await refreshSession();
      return request(path, { ...options, token: renewed.access_token });
    }
    throw error;
  }
}

export async function currentUser() {
  return authenticatedRequest('/auth/v1/user');
}

export async function requireAdminProfile() {
  const user = await currentUser();
  const rows = await authenticatedRequest(
    `/rest/v1/admin_profiles?select=user_id,display_name,is_active&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
  );
  const profile = Array.isArray(rows) ? rows[0] : null;
  if (!profile?.is_active) {
    clearSession();
    throw new SupabaseRequestError('Tu cuenta no tiene permiso de administración.', 403);
  }
  return { user, profile };
}

export async function signOut() {
  const session = loadSession();
  try {
    if (session?.access_token) {
      await request('/auth/v1/logout?scope=local', {
        method: 'POST',
        token: session.access_token,
      });
    }
  } finally {
    clearSession();
  }
}

export async function authSelect(table, query = '') {
  const suffix = query ? `?${query}` : '';
  const result = await authenticatedRequest(`/rest/v1/${encodeURIComponent(table)}${suffix}`);
  return Array.isArray(result) ? result : [];
}

export async function authUpdate(table, filter, values) {
  const suffix = filter ? `?${filter}` : '';
  const result = await authenticatedRequest(`/rest/v1/${encodeURIComponent(table)}${suffix}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: values,
  });
  return Array.isArray(result) ? result : [];
}

export async function authUpsert(table, values, conflictColumn) {
  const query = conflictColumn ? `?on_conflict=${encodeURIComponent(conflictColumn)}` : '';
  const result = await authenticatedRequest(`/rest/v1/${encodeURIComponent(table)}${query}`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: values,
  });
  return Array.isArray(result) ? result : [];
}

function safeStoragePath(path) {
  return path.split('/').filter(Boolean).map(encodeURIComponent).join('/');
}

export async function uploadCatalogImage(file, folder, baseName) {
  const allowed = new Map([
    ['image/jpeg', 'jpg'],
    ['image/png', 'png'],
    ['image/webp', 'webp'],
  ]);
  const extension = allowed.get(file?.type);
  if (!extension) throw new SupabaseRequestError('Usa una imagen JPG, PNG o WebP.');
  if (file.size > 3 * 1024 * 1024) throw new SupabaseRequestError('La imagen no puede superar 3 MB.');

  const unique = `${baseName}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
  const objectPath = `${folder}/${unique}`;
  await authenticatedRequest(`/storage/v1/object/${CATALOG_BUCKET}/${safeStoragePath(objectPath)}`, {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
      'x-upsert': 'false',
      'cache-control': '3600',
    },
    body: file,
    timeout: 30000,
  });

  return `${SUPABASE_URL}/storage/v1/object/public/${CATALOG_BUCKET}/${safeStoragePath(objectPath)}`;
}
