<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/auth.php';
require_admin();
$current = basename($_SERVER['PHP_SELF']);
?>
<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Administración | Perfumería Smell</title><link rel="stylesheet" href="admin.css"></head><body><header class="admin-header"><a class="admin-brand" href="index.php"><img src="../assets/img/brand/logo-smell.webp" alt="Smell">Administración Smell</a><nav class="admin-nav"><a class="<?= $current==='index.php'?'active':'' ?>" href="index.php">Resumen</a><a class="<?= $current==='perfumes.php'?'active':'' ?>" href="perfumes.php">Perfumes</a><a class="<?= $current==='combos.php'?'active':'' ?>" href="combos.php">Combos</a><a class="<?= $current==='settings.php'?'active':'' ?>" href="settings.php">Negocio</a><a href="../index.php" target="_blank">Ver tienda</a><a href="logout.php">Salir</a></nav></header><main class="admin-main">
