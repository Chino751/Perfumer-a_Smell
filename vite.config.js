import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: '_app',
    rollupOptions: {
      input: {
        store: resolve(import.meta.dirname, 'index.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
        cookies: resolve(import.meta.dirname, 'cookies.html'),
        privacy: resolve(import.meta.dirname, 'privacidad.html'),
        claims: resolve(import.meta.dirname, 'reclamos.html'),
        purchaseTerms: resolve(import.meta.dirname, 'terminos-de-compra.html'),
        terms: resolve(import.meta.dirname, 'terminos-y-condiciones.html'),
        adminDashboard: resolve(import.meta.dirname, 'admin/index.html'),
        adminLogin: resolve(import.meta.dirname, 'admin/login.html'),
        adminPerfumes: resolve(import.meta.dirname, 'admin/perfumes.html'),
        adminCombos: resolve(import.meta.dirname, 'admin/combos.html'),
        adminSettings: resolve(import.meta.dirname, 'admin/settings.html')
      }
    }
  }
});
