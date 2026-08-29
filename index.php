<?php
declare(strict_types=1);
require_once __DIR__ . '/config/app.php';
$perfumes = load_catalog();
$combos = load_combos();
$whatsapp = setting('whatsapp', '59175631782');
$mapsUrl = setting('maps_url', 'https://maps.app.goo.gl/DAhQgRibsNEDLpxC8');
$hours = setting('hours', '08:00 a 22:00');
$discountText = setting('discount_text', 'Descuento especial desde 3 decants');
$instagramUrl = setting('instagram_url', 'https://www.instagram.com/perfumeria._smell');
$tiktokUrl = setting('tiktok_url', 'https://www.tiktok.com/@perfumeria.smell_');
$attentionMessage = rawurlencode('Hola, Perfumería Smell 👋 Necesito atención y quisiera hacer una consulta.');
$brands = array_values(array_unique(array_column($perfumes, 'brand')));
sort($brands, SORT_NATURAL | SORT_FLAG_CASE);
function payload(array $data): string { return e((string)json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)); }
function smell_whatsapp_icon(): string {
  return '<svg class="whatsapp-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M16 3C8.83 3 3 8.83 3 16c0 2.54.75 5.02 2.15 7.15L3.5 28.5l5.48-1.61A12.95 12.95 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16 3zm0 23.6c-2.16 0-4.28-.58-6.14-1.67l-.44-.26-3.25.96.98-3.16-.29-.46A10.55 10.55 0 1 1 16 26.6z"></path><path d="M19.11 17.21c-.28-.14-1.64-.81-1.89-.9-.25-.09-.43-.14-.61.14-.18.28-.71.9-.87 1.08-.16.19-.32.21-.6.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.37-1.64-1.53-1.91-.16-.28-.02-.42.12-.56.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.19.05-.35-.02-.49-.07-.14-.61-1.47-.84-2.02-.22-.53-.44-.46-.61-.46h-.52c-.18 0-.46.07-.71.35-.25.28-.96.94-.96 2.28s.99 2.64 1.13 2.83c.14.19 1.95 2.98 4.72 4.18.66.29 1.18.46 1.58.59.66.21 1.26.18 1.74.11.53-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.06-.11-.25-.18-.53-.32z"></path></svg>';
}
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="Decants, combos y perfumes originales de Perfumería Smell en Montero. Arma tu selección y cotiza por WhatsApp.">
  <meta name="theme-color" content="#15110b">
  <meta name="color-scheme" content="light">
  <title>Perfumería Smell | Perfumes originales en Montero</title>
  <link rel="stylesheet" href="assets/css/styles.css?v=4">
  <script src="assets/js/app.js?v=3" defer></script>
</head>
<body data-whatsapp="<?= e($whatsapp) ?>">
<div class="site-shell">
  <div class="announcement"><span>✦ <?= e($discountText) ?></span><span class="announcement-hours">◷ Atención de <?= e($hours) ?></span></div>
  <header class="site-header">
    <a class="brand" href="#inicio"><img src="assets/img/brand/logo-smell.webp" alt="Logo de Perfumería Smell"><span><strong>Perfumería</strong><em>SMELL</em></span></a>
    <nav class="desktop-nav"><a href="#inicio">Inicio</a><a href="#combos">Combos</a><a href="#catalogo">Perfumes</a><a href="#tienda">Tienda</a><a href="#atencion">Atención</a></nav>
    <div class="header-actions"><button class="cart-trigger btn" data-open-cart type="button" aria-label="Abrir selección">▢ <span class="desktop-cart-label">Mi selección</span><span class="cart-count" data-cart-count hidden>0</span></button><button class="mobile-menu btn" data-menu-toggle type="button" aria-label="Abrir menú">☰</button></div>
  </header>
  <aside class="mobile-menu-panel" data-mobile-menu aria-hidden="true"><button class="menu-close" data-menu-toggle type="button" aria-label="Cerrar menú">×</button><h2>Perfumería Smell</h2><p>Tu aroma habla antes que tú.</p><nav><a href="#inicio">Inicio</a><a href="#combos">Combos</a><a href="#catalogo">Perfumes</a><a href="#tienda">Tienda y ubicación</a><a href="#atencion">Atención</a><a href="reclamos.php">Reclamos</a></nav><a class="menu-whatsapp" href="https://wa.me/<?= e($whatsapp) ?>?text=<?= $attentionMessage ?>" target="_blank" rel="noopener"><?= smell_whatsapp_icon() ?><span>Consultar por WhatsApp</span></a></aside>

  <main>
    <section id="inicio" class="hero section-anchor"><div class="hero-copy"><p class="eyebrow">✓ Perfumes originales en Montero</p><h1>Descubre tu próxima <span>esencia.</span></h1><p>Explora decants de 5 ml y 10 ml, combos seleccionados y perfumes completos. Arma tu pedido y recibe la cotización final directamente por WhatsApp.</p><div class="hero-actions"><a class="btn gold-button" href="#catalogo">⌕ Ver perfumes</a><a class="btn dark-outline" href="#combos">✦ Ver combos</a></div><div class="hero-facts"><span>◇ Calidad original</span><span>▣ Retiro en tienda</span><span>▭ QR, efectivo o transferencia</span></div></div><div class="hero-visual"><div class="gold-orbit"></div><img src="assets/img/brand/logo-smell.webp" alt="Perfumería Smell"><div class="hero-stat"><strong><?= count($perfumes) ?></strong><span>perfumes para explorar</span></div></div></section>

    <section class="service-strip"><article><b>◷</b><div><strong>Horario amplio</strong><span><?= e($hours) ?></span></div></article><article><b>▢</b><div><strong>Elige a tu manera</strong><span>Decant, combo o frasco completo</span></div></article><article><b>◯</b><div><strong>Cierre por WhatsApp</strong><span>Confirmamos precio y disponibilidad</span></div></article></section>

    <section id="combos" class="section-block section-anchor"><div class="section-heading"><div><p class="eyebrow">✦ Selecciones Smell</p><h2>Combos listos para elegir</h2></div><p>Combinaciones con precio definido. Agrégalas completas a tu selección.</p></div><div class="combo-grid">
      <?php foreach ($combos as $combo): $comboItems = $combo['items'] ?? []; ?>
      <article class="combo-card"><img src="<?= e(public_image((string)$combo['image'])) ?>" alt="<?= e((string)$combo['name']) ?>" loading="lazy"><div class="combo-card-body"><div><span><?= e((string)$combo['type']) ?></span><h3><?= e((string)$combo['name']) ?></h3></div><strong><?= number_format((float)$combo['price'], 0, ',', '.') ?> Bs</strong><ul><?php foreach ($comboItems as $item): ?><li><?= e((string)$item) ?></li><?php endforeach; ?></ul><?php $comboPayload = ['key'=>'combo-'.($combo['slug'] ?? $combo['id']),'kind'=>'combo','name'=>$combo['name'],'presentation'=>'Combo','price'=>(float)$combo['price'],'image'=>public_image((string)$combo['image'])]; ?><button class="btn" data-add='<?= payload($comboPayload) ?>'>+ Agregar combo</button></div></article>
      <?php endforeach; ?>
    </div></section>

    <section id="catalogo" class="catalog-section section-anchor"><div class="section-heading"><div><p class="eyebrow">⌕ Catálogo completo</p><h2>Elige tu perfume</h2></div><p>Todos están disponibles en decants y también puedes solicitar el frasco completo.</p></div><div class="catalog-toolbar"><label class="search-field"><span>⌕</span><input id="catalog-search" placeholder="Buscar perfume o marca…" aria-label="Buscar perfume o marca"><button type="button" id="clear-search" aria-label="Borrar búsqueda" hidden>×</button></label><select id="brand-filter" class="brand-select" aria-label="Filtrar por marca"><option value="">Todas las marcas</option><?php foreach ($brands as $brand): ?><option value="<?= e((string)$brand) ?>"><?= e((string)$brand) ?></option><?php endforeach; ?></select></div><div class="catalog-result-line"><strong id="result-count"><?= count($perfumes) ?></strong> opciones encontradas</div>
      <div class="product-grid" id="product-grid">
      <?php foreach ($perfumes as $index => $perfume): $image = public_image((string)$perfume['image']); ?>
        <article class="product-card" data-product data-name="<?= e(text_lower((string)$perfume['name'].' '.(string)$perfume['brand'])) ?>" data-brand="<?= e((string)$perfume['brand']) ?>" data-index="<?= $index ?>">
          <div class="product-image-wrap"><img src="<?= e($image) ?>" alt="<?= e((string)$perfume['name'].' de '.(string)$perfume['brand']) ?>" loading="lazy"><?php if (!empty($perfume['preserveExact'])): ?><span class="exact-badge">Precio del catálogo</span><?php endif; ?></div>
          <div class="product-body"><p><?= e((string)$perfume['brand']) ?></p><h3><?= e((string)$perfume['name']) ?></h3><div class="price-row"><span>5 ml <strong><?= number_format((float)$perfume['price5'], 0, ',', '.') ?> Bs</strong></span><span>10 ml <strong><?= number_format((float)$perfume['price10'], 0, ',', '.') ?> Bs</strong></span></div>
          <?php $base = ['name'=>$perfume['name'],'brand'=>$perfume['brand'],'image'=>$image]; $five=array_merge($base,['key'=>'perfume-'.$perfume['id'].'-5','kind'=>'decant','presentation'=>'5 ml','price'=>(float)$perfume['price5']]); $ten=array_merge($base,['key'=>'perfume-'.$perfume['id'].'-10','kind'=>'decant','presentation'=>'10 ml','price'=>(float)$perfume['price10']]); $full=array_merge($base,['key'=>'perfume-'.$perfume['id'].'-full','kind'=>'bottle','presentation'=>'Perfume completo','price'=>null]); ?>
          <div class="product-actions"><button data-add='<?= payload($five) ?>'>+ 5 ml</button><button data-add='<?= payload($ten) ?>'>+ 10 ml</button></div><button class="full-bottle" data-add='<?= payload($full) ?>'>+ Pedir perfume completo</button></div>
        </article>
      <?php endforeach; ?>
      </div><button class="btn load-more" id="load-more">Mostrar 12 más</button><div class="empty-state" id="empty-state" hidden><h3>No encontramos ese perfume</h3><p>Prueba otra palabra o selecciona todas las marcas.</p><button class="btn" id="reset-filters">Limpiar filtros</button></div>
    </section>

    <section class="steps section-block"><div class="section-heading"><div><p class="eyebrow">Compra sencilla</p><h2>De tu selección a WhatsApp</h2></div></div><div class="step-grid"><article><span>1</span><h3>Explora</h3><p>Busca por nombre o marca y revisa las presentaciones.</p></article><article><span>2</span><h3>Selecciona</h3><p>Combina decants, perfumes completos y combos.</p></article><article><span>3</span><h3>Confirma</h3><p>Enviamos todo ordenado a WhatsApp para darte el precio final.</p></article></div></section>

    <section id="tienda" class="store-section section-anchor"><div class="store-card"><div><p class="eyebrow">⌖ Estamos en Montero</p><h2>Visítanos y retira tu pedido</h2><p>Atendemos de 8 de la mañana a 10 de la noche. Puedes pagar mediante QR, efectivo o transferencia.</p></div><div class="store-actions"><a href="<?= e($mapsUrl) ?>" target="_blank" rel="noopener">⌖ Cómo llegar</a><a class="whatsapp-text-link" href="https://wa.me/<?= e($whatsapp) ?>" target="_blank" rel="noopener"><?= smell_whatsapp_icon() ?><span>+591 75631782</span></a></div></div></section>

    <section id="atencion" class="attention-section section-block section-anchor"><div class="attention-card"><div><p class="eyebrow">Atención y soporte</p><h2>¿Necesitas ayuda con un pedido?</h2><p>Atendemos consultas por WhatsApp. Si tu caso es un reclamo, también puedes completar el formulario para enviar la información ordenada.</p></div><div class="attention-actions"><a class="btn gold-button whatsapp-action" href="https://wa.me/<?= e($whatsapp) ?>?text=<?= $attentionMessage ?>" target="_blank" rel="noopener"><?= smell_whatsapp_icon() ?><span>Atención por WhatsApp</span></a><a class="btn legal-secondary-home" href="reclamos.php">Presentar un reclamo</a></div></div></section>

    <section class="faq section-block"><div class="section-heading"><div><p class="eyebrow">Antes de pedir</p><h2>Preguntas frecuentes</h2></div></div><div class="faq-list"><details><summary>¿Cómo funciona el descuento desde 3 decants?<b>+</b></summary><p>Al seleccionar tres o más decants, el carrito lo marca automáticamente. Smell confirma el descuento y el precio final por WhatsApp.</p></details><details><summary>¿Puedo pedir un perfume completo?<b>+</b></summary><p>Sí. Todos los perfumes del catálogo pueden solicitarse completos. Se confirma precio y disponibilidad por WhatsApp.</p></details><details><summary>¿Realizan pagos por la página?<b>+</b></summary><p>No. El pedido se confirma por WhatsApp y puedes pagar mediante QR, efectivo o transferencia.</p></details><details><summary>¿Cómo recibo mi pedido?<b>+</b></summary><p>Los pedidos confirmados se retiran directamente en la tienda de Montero.</p></details></div></section>
  </main>

  <footer><div class="footer-brand"><img src="assets/img/brand/logo-smell.webp" alt="Perfumería Smell"><div><strong>PERFUMERÍA SMELL</strong><span>Tu aroma habla antes que tú.</span></div></div><div><strong>Contacto y atención</strong><a class="footer-whatsapp" href="https://wa.me/<?= e($whatsapp) ?>?text=<?= $attentionMessage ?>" target="_blank" rel="noopener"><?= smell_whatsapp_icon() ?><span>WhatsApp · +591 75631782</span></a><a href="<?= e($mapsUrl) ?>" target="_blank" rel="noopener">Montero, Bolivia</a><span><?= e($hours) ?></span></div><div><strong>Información legal</strong><a href="terminos-y-condiciones.php">Términos y condiciones</a><a href="privacidad.php">Privacidad</a><a href="cookies.php">Cookies</a><a href="terminos-de-compra.php">Términos de compra</a><a href="reclamos.php">Reclamos</a></div><div class="social-links"><strong>Síguenos</strong><a href="<?= e($instagramUrl) ?>" target="_blank" rel="noopener">Instagram · @perfumeria._smell</a><a href="<?= e($tiktokUrl) ?>" target="_blank" rel="noopener">TikTok · @perfumeria.smell_</a></div><p>© <?= date('Y') ?> Perfumería Smell. Calidad original.</p></footer>

  <nav class="mobile-bottom-nav"><a href="#inicio">⌂<span>Inicio</span></a><a href="#combos">✦<span>Combos</span></a><a href="#catalogo">⌕<span>Perfumes</span></a><button data-open-cart type="button">▢<span>Pedido</span><b data-cart-count hidden>0</b></button></nav>
  <a class="floating-whatsapp" href="https://wa.me/<?= e($whatsapp) ?>?text=<?= $attentionMessage ?>" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp" title="Escríbenos por WhatsApp"><?= smell_whatsapp_icon() ?></a>
  <div class="drawer-overlay" data-close-cart hidden></div>
  <aside class="cart-panel" id="cart-panel" aria-hidden="true"><header class="cart-header"><div><h2>Tu selección</h2><p id="cart-description">Agrega perfumes o combos para comenzar.</p></div><button data-close-cart type="button" aria-label="Cerrar carrito">×</button></header><div class="cart-content" id="cart-content"></div><div class="cart-footer" id="cart-footer" hidden><div><span>Subtotal conocido</span><strong id="cart-subtotal">0 Bs</strong></div><p>Los perfumes completos y el descuento se cotizan por WhatsApp.</p><button class="btn whatsapp-order" id="send-whatsapp" type="button"><?= smell_whatsapp_icon() ?><span>Solicitar por WhatsApp</span></button><button class="clear-cart" id="clear-cart" type="button">Vaciar selección</button></div></aside>
  <aside class="cookie-banner" id="cookie-banner" aria-label="Aviso de cookies" hidden><div><strong>Privacidad y almacenamiento</strong><p>Usamos recursos técnicos esenciales y almacenamiento local para recordar tu selección. No usamos cookies publicitarias ni analítica de terceros actualmente.</p><a href="cookies.php">Ver política de cookies</a></div><button class="btn" id="accept-cookies" type="button">Entendido</button></aside>
</div>
</body></html>
