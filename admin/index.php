<?php
declare(strict_types=1);
require_once __DIR__.'/_header.php';
$stats=[
  'perfumes'=>(int)db()->query('SELECT COUNT(*) FROM perfumes')->fetchColumn(),
  'activos'=>(int)db()->query('SELECT COUNT(*) FROM perfumes WHERE active=1')->fetchColumn(),
  'combos'=>(int)db()->query('SELECT COUNT(*) FROM combos WHERE active=1')->fetchColumn(),
  'stock'=>(int)db()->query('SELECT COALESCE(SUM(stock_5+stock_10+stock_full),0) FROM perfumes')->fetchColumn(),
];
?>
<h1>Resumen general</h1><p class="subtitle">Hola, <?=e((string)($_SESSION['admin_username']??'Administrador'))?>. Desde aquí puedes mantener actualizado el catálogo.</p><div class="cards"><article class="stat"><strong><?=$stats['perfumes']?></strong><span>Perfumes registrados</span></article><article class="stat"><strong><?=$stats['activos']?></strong><span>Perfumes visibles</span></article><article class="stat"><strong><?=$stats['combos']?></strong><span>Combos activos</span></article><article class="stat"><strong><?=$stats['stock']?></strong><span>Unidades registradas</span></article></div><section class="panel"><h2>Accesos rápidos</h2><div class="toolbar"><a class="btn gold" href="perfumes.php">Gestionar perfumes</a><a class="btn" href="combos.php">Gestionar combos</a><a class="btn light" href="settings.php">Datos del negocio</a><a class="btn light" href="../index.php" target="_blank">Abrir catálogo</a></div><p class="subtitle">Los precios marcados como “Precio exacto del catálogo” están protegidos y no se pueden cambiar desde el panel.</p></section>
<?php require __DIR__.'/_footer.php'; ?>
