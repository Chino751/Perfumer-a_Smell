import { findAdminProfile, hideNotice, showNotice, supabase } from './shared.js';

const form = document.querySelector('#login-form');
const notice = document.querySelector('#login-notice');
const submit = form.querySelector('button[type="submit"]');

const params = new URLSearchParams(location.search);
if (params.get('reason') === 'unauthorized') {
  showNotice(notice, 'error', 'La cuenta ingresada no tiene autorización administrativa.');
}

const { data: { user: existingUser } } = await supabase.auth.getUser();
if (existingUser) {
  try {
    const profile = await findAdminProfile(existingUser.id);
    if (profile?.is_active) location.replace('/admin');
  } catch {
    // El formulario seguirá disponible si no se pudo validar la sesión previa.
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  hideNotice(notice);
  const email = form.email.value.trim();
  const password = form.password.value;
  if (!email || !password) {
    showNotice(notice, 'error', 'Completa el correo y la contraseña.');
    return;
  }

  submit.disabled = true;
  submit.textContent = 'Verificando…';
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const profile = await findAdminProfile(data.user.id);
    if (!profile?.is_active) {
      await supabase.auth.signOut({ scope: 'local' });
      throw new Error('Esta cuenta no está autorizada para administrar la tienda.');
    }
    const next = params.get('next');
    location.replace(next?.startsWith('/admin') && !next.startsWith('//') ? next : '/admin');
  } catch (error) {
    const message = /Invalid login credentials/i.test(error.message)
      ? 'Correo o contraseña incorrectos.'
      : error.message || 'No se pudo iniciar sesión.';
    showNotice(notice, 'error', message);
  } finally {
    submit.disabled = false;
    submit.textContent = 'Ingresar';
  }
});
