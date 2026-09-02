# Perfumería Smell

Catálogo web responsive para Perfumería Smell, en Montero, Bolivia. Los clientes pueden explorar perfumes, decants y combos, preparar una selección y solicitar la cotización final mediante WhatsApp.

La versión de producción está diseñada para **Vercel + Supabase** y ya no requiere PHP, Apache, XAMPP ni MySQL.

## Arquitectura

- **Frontend:** HTML5, CSS3 y JavaScript nativo, servido como sitio estático en Vercel.
- **Base de datos:** PostgreSQL administrado por Supabase.
- **Autenticación:** Supabase Auth para el panel administrativo.
- **Imágenes administrativas:** Supabase Storage, bucket público `catalog-media` con escritura restringida.
- **Seguridad:** Row Level Security (RLS) en todas las tablas expuestas.
- **Pedidos:** se preparan en el navegador y se envían a WhatsApp; no se cobran ni se guardan automáticamente en la base de datos.

## Funcionalidades

### Tienda pública

- 71 perfumes con buscador y filtro por marca.
- Decants de 5 ml y 10 ml y solicitud de perfume completo.
- 6 combos de decants y 5 combos de perfumes.
- Carrito persistente en el almacenamiento local del navegador.
- Aviso de descuento desde 3 decants.
- Preferencia de pago por QR, efectivo o transferencia.
- Mensaje de cotización ordenado para WhatsApp.
- Información de horario, ubicación, redes sociales y retiro en tienda.
- Páginas de términos, privacidad, cookies, compras, reclamos y error 404.
- Respaldo local del catálogo si la API no está disponible temporalmente.

### Panel administrativo

- Inicio de sesión con correo y contraseña mediante Supabase Auth.
- Autorización adicional mediante `admin_profiles`; una cuenta autenticada sin perfil activo no puede administrar.
- Edición de perfumes, marcas, precios permitidos, existencias, imágenes y visibilidad.
- Edición de combos, productos incluidos, precio, imagen y visibilidad.
- Edición de WhatsApp, horario, Maps, Instagram, TikTok y texto de descuento.
- Carga de imágenes JPG, PNG o WebP de hasta 3 MB.
- Los cuatro precios marcados como exactos están protegidos por un trigger de PostgreSQL, además del bloqueo visual.

## Datos y reglas conservados

- WhatsApp: `+591 75631782`.
- Atención: `08:00 a 22:00`.
- Pagos: QR, efectivo o transferencia.
- Entrega: retiro en tienda en Montero.
- Descuento: desde 3 decants.
- Se mantienen los nombres y valores definidos en el catálogo, incluyendo Le Beau Paradise Garden, Amber Oud Gold Edition, His Confession y Tag Him Uomo Rosso.
- Se conservan los precios exactos marcados en las diapositivas 21, 24, 25 y 26.

## Estructura principal

```text
perfumeria-smell/
├── admin/
│   ├── index.html       Panel administrativo
│   ├── login.html       Inicio de sesión
│   ├── admin.css        Estilos base
│   └── panel.css        Estilos del panel Supabase
├── assets/
│   ├── css/             Estilos públicos
│   ├── img/             Logo, catálogo y combos
│   └── js/
│       ├── app.js       Tienda, filtros, carrito y datos
│       ├── legal.js     Configuración y reclamos
│       ├── admin.js     Administración
│       ├── admin-login.js
│       └── supabase.js  Cliente REST/Auth seguro para navegador
├── data/                Respaldo JSON del catálogo
├── database/
│   ├── supabase-schema.sql
│   └── supabase-seed.sql
├── index.html
├── vercel.json
├── robots.txt
└── manifest.webmanifest
```

## Ejecución local

El sitio debe abrirse desde un servidor HTTP; los módulos JavaScript no deben ejecutarse directamente con `file://`.

Puedes usar la extensión **Live Server** de Visual Studio Code o, si tienes Python instalado:

```bash
python -m http.server 8080
```

Después abre `http://localhost:8080`.

## Configuración de Supabase

El proyecto usa una clave **publishable** dentro de `assets/js/supabase.js`. Ese tipo de clave está diseñado para aparecer en el frontend. La seguridad depende de RLS y de los permisos mínimos ya configurados.

Nunca coloques en el repositorio:

- claves `sb_secret_...`;
- claves `service_role`;
- contraseña de PostgreSQL;
- tokens personales de Vercel o GitHub.

Para recrear una base nueva:

1. Ejecuta `database/supabase-schema.sql` mediante el flujo de migraciones de Supabase.
2. Ejecuta una sola vez `database/supabase-seed.sql`.
3. Crea el usuario administrativo en **Authentication > Users**.
4. Autorízalo desde el SQL Editor, sustituyendo el correo:

```sql
insert into public.admin_profiles (user_id, display_name)
select id, 'Administrador'
from auth.users
where email = 'correo-del-administrador@ejemplo.com'
on conflict (user_id) do update
set display_name = excluded.display_name,
    is_active = true;
```

No hay registro público de administradores.

## Despliegue en Vercel

1. Importa el repositorio desde GitHub.
2. Selecciona **Other** como framework si Vercel no detecta automáticamente el sitio estático.
3. Deja vacíos Build Command y Output Directory.
4. Despliega la rama preparada y verifica la vista previa.
5. Promueve a producción solo después de comprobar tienda, carrito, WhatsApp, páginas legales y acceso administrativo.

`vercel.json` activa URLs limpias, redirecciones desde las rutas PHP anteriores, protección contra iframes, CSP, restricciones de permisos del navegador y `no-store` para el panel.

## Seguridad y privacidad

- El visitante anónimo solo puede leer perfumes y combos activos y la configuración pública.
- Solo perfiles administrativos activos pueden actualizar contenido.
- El panel no utiliza una clave secreta en el navegador.
- La selección y los datos escritos antes de abrir WhatsApp permanecen en el navegador y no se guardan automáticamente en Supabase.
- Los textos legales deben ser revisados por el responsable del negocio antes de una operación comercial definitiva.

Consulta [SECURITY.md](SECURITY.md) para el procedimiento de reporte y las reglas de manejo de credenciales.

