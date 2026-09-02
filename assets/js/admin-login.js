import {
  clearSession,
  loadSession,
  requireAdminProfile,
  signInWithPassword,
  SupabaseRequestError,
} from './supabase.js';

const form = document.getElementById('login-form');
const notice = document.getElementById('login-notice');
const submit = document.getElementById('login-submit');

function showNotice(message, kind = 'error') {
  notice.textContent = message;
  notice.className = `notice ${kind}`;
  notice.hidden = false;
}

function friendlyError(error) {
  const message = String(error?.message || '').toLocaleLowerCase('es');
  if (error?.status === 429) return 'Demasiados intentos. Espera unos minutos antes de volver a intentar.';
  if (error?.status === 403) return 'La cuenta existe, pero no tiene permiso de administración.';
  if (message.includes('invalid login credentials') || error?.status === 400) return 'Correo o contraseña incorrectos.';
  if (error?.status === 401) return 'La sesión no es válida. Ingresa nuevamente.';
  return error instanceof SupabaseRequestError ? error.message : 'No se pudo iniciar sesión. Intenta nuevamente.';
}

async function checkExistingSession() {
  if (!loadSession()) return;
  try {
    await requireAdminProfile();
    window.location.replace('/admin/');
  } catch {
    clearSession();
  }
}

form?.addEventListener('submit', async event => {
  event.preventDefault();
  notice.hidden = true;
  const email = document.getElementById('email').value.trim().toLocaleLowerCase('en-US');
  const password = document.getElementById('password').value;
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    showNotice('Escribe un correo válido y una contraseña de al menos 8 caracteres.');
    return;
  }

  submit.disabled = true;
  submit.textContent = 'Verificando…';
  try {
    await signInWithPassword(email, password);
    await requireAdminProfile();
    window.location.replace('/admin/');
  } catch (error) {
    clearSession();
    showNotice(friendlyError(error));
  } finally {
    submit.disabled = false;
    submit.textContent = 'Ingresar';
  }
});

checkExistingSession();
