# Política de seguridad

## Versiones compatibles

Las correcciones de seguridad se aplican sobre la versión más reciente disponible en la rama principal.

## Reporte responsable

No publiques contraseñas, datos personales, configuraciones privadas ni detalles explotables en un issue público.

Si detectas una vulnerabilidad, repórtala de forma privada al propietario del repositorio mediante las opciones de seguridad de GitHub. Incluye una descripción clara, los pasos mínimos para reproducirla y el posible impacto, sin adjuntar credenciales reales.

## Recomendaciones de despliegue

- Mantén `config/database.php` fuera del control de versiones.
- Usa una cuenta MySQL exclusiva y con los permisos mínimos necesarios.
- Publica el sitio únicamente mediante HTTPS.
- Elimina o restringe `install.php` después de completar la instalación.
- Mantén PHP, Apache y MySQL actualizados.
- Realiza copias de seguridad cifradas fuera del directorio público.
