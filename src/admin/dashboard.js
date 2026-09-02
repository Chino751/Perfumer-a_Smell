import { initializeAdmin, showNotice, supabase } from './shared.js';

const auth = await initializeAdmin('dashboard');
if (auth) {
  document.querySelector('[data-admin-greeting]').textContent = `Hola, ${auth.profile.display_name || auth.user.email}. Desde aquí puedes mantener actualizado el catálogo.`;
  const notice = document.querySelector('#dashboard-notice');
  try {
    const [perfumes, activePerfumes, activeCombos, stock] = await Promise.all([
      supabase.from('perfumes').select('*', { count: 'exact', head: true }),
      supabase.from('perfumes').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase.from('combos').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase.from('perfumes').select('stock_5,stock_10,stock_full')
    ]);
    for (const result of [perfumes, activePerfumes, activeCombos, stock]) if (result.error) throw result.error;
    const stockTotal = stock.data.reduce((sum, row) => sum + row.stock_5 + row.stock_10 + row.stock_full, 0);
    document.querySelector('[data-stat="perfumes"]').textContent = perfumes.count ?? 0;
    document.querySelector('[data-stat="active"]').textContent = activePerfumes.count ?? 0;
    document.querySelector('[data-stat="combos"]').textContent = activeCombos.count ?? 0;
    document.querySelector('[data-stat="stock"]').textContent = stockTotal;
  } catch (error) {
    console.error(error);
    showNotice(notice, 'error', 'No se pudieron cargar los indicadores del panel.');
  }
}
