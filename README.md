# Perfumería Smell

Catálogo responsive de perfumes, decants y combos con carrito local, solicitud de cotización por WhatsApp y panel administrativo. Esta versión reemplaza la aplicación PHP/MySQL original por un frontend Vite desplegable en Vercel y un backend administrado en Supabase.

## Arquitectura

- **Vercel:** publicación del frontend estático y vistas previas por rama.
- **Supabase PostgreSQL:** perfumes, combos, stock y configuración pública.
- **Supabase Auth:** acceso por correo y contraseña al panel administrativo.
- **Supabase Storage:** almacenamiento permanente de nuevas imágenes.
- **GitHub:** historial, revisión y despliegue automático del código.

El navegador usa exclusivamente una clave publicable de Supabase. Las políticas Row Level Security (RLS) permiten lectura pública de productos visibles y reservan las modificaciones para usuarios registrados en `admin_profiles`.

## Funciones principales

### Sitio público

- Catálogo de 71 perfumes con búsqueda y filtro por marca.
- Decants de 5 ml y 10 ml, perfumes completos y 11 combos.
- Selección persistente en `localStorage`.
- Aviso de descuento desde tres decants.
- Mensaje de cotización estructurado para WhatsApp.
- Páginas de términos, privacidad, cookies, compra y reclamos.
- Diseño adaptable para teléfono, tableta y computadora.
- Respaldo JSON de solo lectura si la API pública no responde temporalmente.

### Panel administrativo

- Inicio de sesión mediante Supabase Auth.
- Edición de perfumes, precios, stock, imágenes y visibilidad.
- Edición de combos, contenido, precio e imagen.
- Edición del WhatsApp, horario, ubicación y redes sociales.
- Carga de imágenes a Supabase Storage con validación de tipo y tamaño.
- Protección por RLS; no existe registro público de administradores.

## Requisitos

- Node.js 22 o superior.
- npm 10 o superior.
- Un proyecto de Supabase con el esquema incluido.

## Configuración local

1. Instala las dependencias:

   ```bash
   npm ci
   ```

2. Copia `.env.example` como `.env.local` y completa:

   ```text
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

3. Inicia el entorno local:

   ```bash
   npm run dev
   ```

Nunca agregues `.env.local`, claves secretas o contraseñas al repositorio.

## Base de datos

Los archivos versionados son:

- `supabase/schema.sql`: tablas, funciones, triggers, permisos y políticas RLS.
- `supabase/seed.sql`: catálogo, combos, configuración y bucket inicial.

El esquema debe aplicarse antes de los datos iniciales. La creación del primer administrador se realiza en dos pasos seguros:

1. Crear el usuario directamente en Supabase Auth, definiendo allí su contraseña.
2. Agregar su UUID a `public.admin_profiles` mediante una operación administrativa.

La contraseña nunca se comparte por chat ni se guarda en GitHub.

## Comandos

```bash
npm run dev       # servidor local
npm run check     # valida estructura, catálogo e imágenes
npm run build     # genera dist/
npm run verify    # validación completa y compilación
npm run preview   # vista previa de dist/
```

## Despliegue en Vercel

Configura estas variables para los entornos Preview y Production:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Vercel detecta Vite, ejecuta `npm run build` y publica `dist`. Las ramas generan vistas previas; `main` se reserva para producción.

## Estructura

```text
admin/       Páginas del panel
assets/      Estilos e imágenes iniciales
data/        Respaldo público de solo lectura
scripts/     Verificaciones y preparación de la compilación
src/         Lógica del sitio y cliente de Supabase
supabase/    Esquema y datos iniciales PostgreSQL
*.html       Tienda y páginas informativas
```

## Consideraciones legales

Los textos legales son una base funcional coherente con el comportamiento actual. El responsable del negocio debe revisarlos con asesoría local antes de operar comercialmente.
