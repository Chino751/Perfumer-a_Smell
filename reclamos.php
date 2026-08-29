<?php
$pageTitle = 'Atención y reclamos';
$pageDescription = 'Canal de atención y reclamos de Perfumería Smell mediante WhatsApp.';
require __DIR__ . '/includes/public_header.php';
?>
<main class="legal-main">
  <section class="legal-hero">
    <p class="eyebrow">Atención al cliente</p>
    <h1>Atención y reclamos</h1>
    <p>Completa los datos esenciales y abriremos WhatsApp con el reclamo listo para enviar.</p>
  </section>
  <section class="claim-layout">
    <article class="legal-card">
      <h2>Enviar un reclamo</h2>
      <form id="claim-form" class="claim-form" data-whatsapp="<?= e($whatsapp) ?>" novalidate>
        <label>Nombre completo <span>*</span><input id="claim-name" type="text" maxlength="100" autocomplete="name" required placeholder="Tu nombre"></label>
        <label>Tipo de solicitud <span>*</span><select id="claim-type" required><option value="">Selecciona una opción</option><option>Consulta</option><option>Reclamo</option><option>Producto con inconveniente</option><option>Pago</option><option>Retiro del pedido</option><option>Otro</option></select></label>
        <label>Número o referencia del pedido <small>(opcional)</small><input id="claim-order" type="text" maxlength="60" placeholder="Ej.: pedido de 28/08"></label>
        <label>Detalle <span>*</span><textarea id="claim-detail" maxlength="1000" rows="6" required placeholder="Explícanos qué ocurrió y cómo podemos ayudarte."></textarea></label>
        <label class="claim-check"><input id="claim-confirm" type="checkbox" required><span>Confirmo que la información enviada es correcta y acepto que la atención continúe por WhatsApp.</span></label>
        <p id="claim-error" class="form-error" role="alert" hidden></p>
        <button class="btn gold-button claim-submit" type="submit">Continuar en WhatsApp</button>
      </form>
    </article>
    <aside class="claim-help legal-card">
      <p class="eyebrow">Canal directo</p>
      <h2>¿Solo necesitas atención?</h2>
      <p>Si no deseas presentar un reclamo formal, puedes abrir una conversación directa con un mensaje preparado.</p>
      <a class="btn legal-secondary" href="https://wa.me/<?= e($whatsapp) ?>?text=<?= rawurlencode('Hola, Perfumería Smell 👋 Necesito atención y quisiera hacer una consulta.') ?>" target="_blank" rel="noopener">Abrir atención por WhatsApp</a>
      <div class="claim-tips"><strong>Para ayudarte más rápido</strong><span>• Indica el producto o pedido.</span><span>• Explica brevemente lo ocurrido.</span><span>• Si corresponde, envía fotografías desde WhatsApp.</span></div>
    </aside>
  </section>
</main>
<script src="assets/js/reclamos.js?v=1" defer></script>
<?php require __DIR__ . '/includes/public_footer.php'; ?>
