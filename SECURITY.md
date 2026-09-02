# Política de seguridad

## Versiones compatibles

Las correcciones se aplican sobre la versión más reciente de la rama de producción.

## Reporte responsable

No publiques contraseñas, datos personales, tokens, claves secretas ni detalles explotables en un issue público.

Si detectas una vulnerabilidad, repórtala de forma privada al propietario mediante las opciones de seguridad de GitHub. Incluye una descripción clara, pasos mínimos para reproducirla y el posible impacto, sin adjuntar credenciales reales.

## Claves de Supabase

La clave `sb_publishable_...` usada por el navegador no es una contraseña: identifica la aplicación pública y funciona junto con las políticas RLS.

Nunca expongas ni confirmes en el frontend:

- una clave `sb_secret_...`;
- una clave heredada `service_role`;
- la contraseña directa de PostgreSQL;
- tokens de Vercel, GitHub o cualquier cuenta personal.

Las claves secretas de Supabase omiten RLS y deben permanecer únicamente en componentes backend controlados. Esta versión del proyecto no las necesita.

## Controles activos

- RLS habilitado en `admin_profiles`, `perfumes`, `combos` y `settings`.
- Lectura anónima limitada a contenido visible.
- Escritura limitada a cuentas autenticadas con perfil administrativo activo.
- Imágenes limitadas a JPG, PNG o WebP y un máximo de 3 MB.
- Precios exactos protegidos por un trigger privado de PostgreSQL.
- Sesión administrativa guardada en `sessionStorage` y eliminada al cerrar sesión.
- Política CSP y encabezados de seguridad definidos en `vercel.json`.
- Panel marcado como `noindex` y `no-store`.

## Recomendaciones operativas

- Publica únicamente mediante HTTPS.
- Usa una contraseña administrativa única y activa MFA en las cuentas de Supabase, GitHub y Vercel.
- Revisa periódicamente los asesores de seguridad y rendimiento de Supabase.
- Desactiva inmediatamente un perfil administrativo que ya no deba tener acceso.
- Conserva copias de seguridad fuera del directorio público.
- Prueba primero en una vista previa de Vercel y promueve exactamente el mismo artefacto a producción.
