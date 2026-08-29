<?php
http_response_code(404);
$pageTitle = 'Página no encontrada';
$pageDescription = 'La página solicitada no existe en Perfumería Smell.';
require __DIR__ . '/includes/public_header.php';
?>
<main class="not-found-main">
  <section class="not-found-card">
    <div class="error-code">404</div>
    <p class="eyebrow">Página no encontrada</p>
    <h1>Ese enlace no existe o cambió.</h1>
    <p>No te preocupes: puedes volver al inicio, revisar los perfumes o pedir ayuda por WhatsApp.</p>
    <div class="legal-actions"><a class="btn gold-button" href="index.php">Volver al inicio</a><a class="btn legal-secondary" href="index.php#catalogo">Ver perfumes</a></div>
  </section>
</main>
<?php require __DIR__ . '/includes/public_footer.php'; ?>
