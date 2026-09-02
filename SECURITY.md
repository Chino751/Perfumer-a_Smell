# Política de seguridad

## Versiones compatibles

Las correcciones se aplican a la versión más reciente de la rama principal.

## Reporte responsable

No publiques contraseñas, datos personales, claves privadas ni detalles explotables en un issue público. Reporta cualquier vulnerabilidad al propietario mediante las opciones privadas de seguridad de GitHub, incluyendo pasos mínimos de reproducción e impacto sin credenciales reales.

## Controles del proyecto

- Las tablas públicas tienen Row Level Security habilitado.
- Los visitantes solo pueden consultar perfumes y combos visibles y la configuración pública.
- Los cambios requieren una sesión autenticada y un perfil administrativo activo.
- Nadie puede crear su propio perfil administrativo desde el navegador.
- Las imágenes administrativas se validan por tipo y tamaño antes de guardarse en Supabase Storage.
- Las claves secretas y contraseñas no forman parte del frontend ni del repositorio.
- Los precios marcados como exactos están protegidos por un trigger de base de datos.

## Recomendaciones de operación

- Publica únicamente mediante HTTPS.
- Activa autenticación multifactor en GitHub, Supabase y Vercel.
- Usa una contraseña administrativa única y un gestor de contraseñas.
- Revisa periódicamente los asesores de seguridad y rendimiento de Supabase.
- Mantén Node.js y las dependencias actualizados mediante cambios revisados.
- Conserva copias de seguridad y prueba su restauración.
- Revoca inmediatamente cualquier clave expuesta y reemplázala en Vercel.
