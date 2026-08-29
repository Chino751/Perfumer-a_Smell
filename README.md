# Perfumería Smell

Plataforma web responsive para la exhibición y administración de perfumes, decants y combos. Permite que los clientes exploren el catálogo, preparen una selección y envíen una solicitud de cotización organizada mediante WhatsApp.

El proyecto fue desarrollado con enfoque mobile-first para negocios de perfumería que necesitan una solución ligera, instalable en XAMPP y administrable sin depender de plataformas de comercio electrónico externas.

## Funcionalidades principales

### Tienda pública

- Catálogo de 71 perfumes con buscador y filtro por marca.
- Presentaciones de decants de 5 ml y 10 ml.
- Solicitud de perfumes completos con precio sujeto a cotización.
- Seis combos de decants y cinco combos de perfumes completos.
- Carrito persistente mediante almacenamiento local del navegador.
- Aviso automático de descuento al seleccionar tres o más decants.
- Selección de QR, efectivo o transferencia como forma de pago preferida.
- Generación de un mensaje de pedido completo para WhatsApp.
- Información de ubicación, horario, redes sociales y retiro en tienda.
- Secciones de términos, privacidad, cookies, compras y reclamos.
- Diseño adaptable para teléfonos, tabletas y computadoras.

### Panel administrativo

- Acceso mediante usuario y contraseña creados durante la instalación.
- Contraseñas almacenadas mediante hash seguro de PHP.
- Administración de perfumes, marcas, precios, stock, imágenes y visibilidad.
- Administración de combos, productos incluidos y precios.
- Edición de información pública del negocio.
- Protección CSRF, consultas preparadas y validación de imágenes.
- Bloqueo temporal después de varios intentos de acceso incorrectos.

## Tecnologías

- PHP 8.1 o superior.
- MySQL 8 o MariaDB compatible.
- HTML5, CSS3 y JavaScript.
- Apache mediante XAMPP o un entorno equivalente.
- PDO para el acceso seguro a la base de datos.

## Instalación local con XAMPP

1. Clona o descarga este repositorio dentro de `C:\xampp\htdocs\`.
2. Asegúrate de que la carpeta del proyecto se llame `perfumeria_smell`.
3. Copia `config/database.example.php` como `config/database.php`.
4. Completa en `config/database.php` los datos de tu servidor MySQL local.
5. Inicia Apache y MySQL desde XAMPP.
6. Abre `http://localhost/perfumeria_smell/install.php`.
7. Crea el usuario y la contraseña del administrador.
8. Ingresa al panel desde `http://localhost/perfumeria_smell/admin/`.

El instalador crea la base de datos, las tablas y la información inicial del catálogo. No existen credenciales administrativas predeterminadas dentro del repositorio.

## Configuración de la base de datos

Las credenciales privadas no se almacenan en Git. La aplicación admite dos métodos:

### Archivo local

Copia el archivo de ejemplo:

```text
config/database.example.php → config/database.php
```

`config/database.php` se encuentra excluido mediante `.gitignore`.

### Variables de entorno

También puedes definir:

```text
SMELL_DB_HOST
SMELL_DB_PORT
SMELL_DB_NAME
SMELL_DB_USER
SMELL_DB_PASSWORD
```

## Importación manual

Como alternativa al instalador, importa `database/schema.sql` desde phpMyAdmin. El archivo crea la base `perfumeria_smell` y dirige explícitamente las tablas a ella, evitando errores por falta de una base seleccionada.

Después de importar el esquema, abre `install.php` para cargar el catálogo inicial y crear el primer administrador.

## Estructura del proyecto

```text
perfumeria_smell/
├── admin/       Panel administrativo
├── assets/      Estilos, JavaScript e imágenes públicas
├── config/      Conexión, autenticación y carga de archivos
├── data/        Catálogo inicial en JSON
├── database/    Esquema de MySQL
├── includes/    Componentes públicos reutilizables
├── uploads/     Imágenes añadidas por el administrador
├── index.php    Tienda pública
└── install.php  Instalador inicial
```

## Seguridad antes de publicar

- No confirmes en Git `config/database.php`, archivos `.env`, copias de seguridad ni exportaciones de la base de datos.
- Usa una cuenta MySQL exclusiva con permisos mínimos.
- Cambia cualquier credencial que haya sido expuesta anteriormente.
- Configura HTTPS en el servidor de producción.
- Elimina o restringe el acceso a `install.php` después de instalar.
- Conserva las protecciones `.htaccess` de `config/`, `data/`, `database/` y `uploads/`.
- Consulta [SECURITY.md](SECURITY.md) para el reporte responsable de vulnerabilidades.

## Consideraciones legales

Los textos legales incluidos sirven como base funcional para el comportamiento actual del sitio. Antes de utilizar el sistema comercialmente, deben ser revisados y adaptados por el responsable del negocio conforme a la normativa aplicable en su jurisdicción.

## Estado del proyecto

Proyecto funcional orientado a instalación propia. Antes de llevarlo a producción se recomienda ejecutar pruebas en el servidor definitivo, configurar HTTPS, establecer copias de seguridad y revisar permisos de archivos y base de datos.
