<?php
/** @var string $pageTitle */
/** @var string $pageDescription */
require_once __DIR__ . '/../config/app.php';
$whatsapp = setting('whatsapp', '59175631782');
$hours = setting('hours', '08:00 a 22:00');
$attentionMessage = rawurlencode('Hola, Perfumería Smell 👋 Necesito atención y quisiera hacer una consulta.');
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="<?= e($pageDescription) ?>">
  <title><?= e($pageTitle) ?> | Perfumería Smell</title>
  <link rel="stylesheet" href="assets/css/styles.css?v=3">
  <link rel="stylesheet" href="assets/css/legal.css?v=1">
</head>
<body class="legal-page">
<div class="site-shell">
  <div class="announcement"><span>✦ Perfumería Smell</span><span class="announcement-hours">◷ Atención de <?= e($hours) ?></span></div>
  <header class="site-header legal-header">
    <a class="brand" href="index.php#inicio"><img src="assets/img/brand/logo-smell.webp" alt="Logo de Perfumería Smell"><span><strong>Perfumería</strong><em>SMELL</em></span></a>
    <nav class="desktop-nav legal-nav">
      <a href="index.php#inicio">Inicio</a>
      <a href="index.php#combos">Combos</a>
      <a href="index.php#catalogo">Perfumes</a>
      <a href="reclamos.php">Reclamos</a>
    </nav>
    <a class="btn legal-attention" href="https://wa.me/<?= e($whatsapp) ?>?text=<?= $attentionMessage ?>" target="_blank" rel="noopener">Atención por WhatsApp</a>
  </header>
