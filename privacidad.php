<?php
$pageTitle = 'Política de privacidad';
$pageDescription = 'Política de privacidad y tratamiento de información en el sitio de Perfumería Smell.';
require __DIR__ . '/includes/public_header.php';
?>
<main class="legal-main">
  <section class="legal-hero">
    <p class="eyebrow">Privacidad</p>
    <h1>Política de privacidad</h1>
    <p>Explicamos qué información utiliza el sitio y cómo se comunica con Perfumería Smell.</p>
    <span>Última actualización: 28 de agosto de 2026</span>
  </section>
  <article class="legal-card legal-content">
    <h2>1. Datos que utiliza la web pública</h2>
    <p>Actualmente la selección del carrito se guarda localmente en el navegador del usuario. Cuando decides solicitar una cotización, el nombre, forma de pago preferida y notas que escribas se incorporan al mensaje que se abre en WhatsApp.</p>

    <h2>2. Finalidad</h2>
    <p>La información enviada por WhatsApp se utiliza para atender consultas, confirmar productos, disponibilidad, precios, pagos, retiro de pedidos y resolver reclamos relacionados con la atención.</p>

    <h2>3. Base de datos del sitio</h2>
    <p>En la versión actual, el formulario público de pedido no registra automáticamente tu nombre o tus notas en la base de datos MySQL. El catálogo y la configuración administrativa sí se gestionan internamente desde el sistema.</p>

    <h2>4. Servicios de terceros</h2>
    <p>WhatsApp, Instagram, TikTok y Google Maps son servicios externos. Si decides utilizarlos, el tratamiento de datos realizado por esas plataformas se rige por sus propias políticas.</p>

    <h2>5. Seguridad y acceso</h2>
    <p>El panel administrativo está separado de la tienda pública y utiliza autenticación. Procuramos limitar el acceso a la información de administración y evitar exponer credenciales o detalles técnicos en páginas públicas.</p>

    <h2>6. Derechos sobre la información</h2>
    <p>En Bolivia, la Constitución reconoce mecanismos de protección de la privacidad frente a datos registrados en medios físicos o electrónicos, incluyendo la posibilidad de conocer, objetar, rectificar o solicitar la eliminación de información cuando corresponda. Las solicitudes relacionadas con información entregada a Perfumería Smell pueden canalizarse mediante WhatsApp.</p>

    <h2>7. Conservación</h2>
    <p>La selección guardada por el sitio permanece en el almacenamiento local del navegador hasta que el usuario vacíe el carrito o elimine los datos del navegador. Las conversaciones de WhatsApp se gestionan dentro de ese servicio y del dispositivo/cuenta del negocio.</p>

    <h2>8. Contacto</h2>
    <p>Para consultas, correcciones o solicitudes relacionadas con privacidad, utiliza nuestro canal de atención por WhatsApp.</p>
    <div class="legal-actions"><a class="btn gold-button" href="https://wa.me/<?= e($whatsapp) ?>?text=<?= rawurlencode('Hola, Perfumería Smell 👋 Tengo una consulta relacionada con privacidad y mis datos.') ?>" target="_blank" rel="noopener">Consultar por WhatsApp</a><a class="btn legal-secondary" href="cookies.php">Ver política de cookies</a></div>
    <p class="legal-note">Esta página informa el funcionamiento actual del sistema y no sustituye asesoramiento jurídico profesional.</p>
  </article>
</main>
<?php require __DIR__ . '/includes/public_footer.php'; ?>
