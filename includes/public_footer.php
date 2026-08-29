<?php
$instagramUrl = setting('instagram_url', 'https://www.instagram.com/perfumeria._smell');
$tiktokUrl = setting('tiktok_url', 'https://www.tiktok.com/@perfumeria.smell_');
$mapsUrl = setting('maps_url', 'https://maps.app.goo.gl/DAhQgRibsNEDLpxC8');
?>
  <footer class="legal-footer">
    <div class="footer-brand"><img src="assets/img/brand/logo-smell.webp" alt="Perfumería Smell"><div><strong>PERFUMERÍA SMELL</strong><span>Tu aroma habla antes que tú.</span></div></div>
    <div><strong>Información legal</strong><a href="terminos-y-condiciones.php">Términos y condiciones</a><a href="privacidad.php">Privacidad</a><a href="cookies.php">Cookies</a><a href="terminos-de-compra.php">Términos de compra</a></div>
    <div><strong>Atención</strong><a href="reclamos.php">Reclamos</a><a href="https://wa.me/<?= e($whatsapp) ?>?text=<?= $attentionMessage ?>" target="_blank" rel="noopener">WhatsApp</a><span><?= e($hours) ?></span></div>
    <div><strong>Encuéntranos</strong><a href="<?= e($mapsUrl) ?>" target="_blank" rel="noopener">Montero, Bolivia</a><a href="<?= e($instagramUrl) ?>" target="_blank" rel="noopener">Instagram</a><a href="<?= e($tiktokUrl) ?>" target="_blank" rel="noopener">TikTok</a></div>
    <p>© <?= date('Y') ?> Perfumería Smell. Información sujeta a confirmación por WhatsApp.</p>
  </footer>
</div>
</body>
</html>
