<?php
declare(strict_types=1);
require_once __DIR__ . '/config/app.php';

$error = '';
$installed = installation_complete();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$installed) {
    verify_csrf();
    $username = trim((string)($_POST['username'] ?? ''));
    $password = (string)($_POST['password'] ?? '');
    if (mb_strlen($username) < 4 || mb_strlen($username) > 60) {
        $error = 'El usuario debe tener entre 4 y 60 caracteres.';
    } elseif (mb_strlen($password) < 8) {
        $error = 'La contraseña debe tener al menos 8 caracteres.';
    } else {
        try {
            $server = db(true);
            $server->exec('CREATE DATABASE IF NOT EXISTS `' . DB_NAME . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
            $pdo = db();
            $schema = file_get_contents(__DIR__ . '/database/schema.sql');
            if (!$schema) throw new RuntimeException('No se encontró el esquema SQL.');
            $pdo->exec($schema);
            $pdo->beginTransaction();
            seed_initial_data($pdo);
            $existingAdmin = $pdo->prepare('SELECT COUNT(*) FROM admin_users WHERE username = ?');
            $existingAdmin->execute([$username]);
            if ((int)$existingAdmin->fetchColumn() > 0) {
                throw new RuntimeException('Ese usuario administrador ya existe.');
            }
            $insertAdmin = $pdo->prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)');
            $insertAdmin->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
            $pdo->commit();
            header('Location: admin/login.php?installed=1');
            exit;
        } catch (Throwable $exception) {
            if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
            $error = 'No se pudo instalar. Verifica que MySQL esté encendido y que hayas creado config/database.php a partir del archivo de ejemplo.';
        }
    }
}
?>
<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Instalar Perfumería Smell</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0906;color:#17120b;font-family:Arial}.box{width:min(92%,460px);padding:30px;background:#fff;border-radius:18px;box-shadow:0 20px 70px #0008}.logo{width:100px;height:100px;margin:auto;display:block;border-radius:50%}h1{font-family:Georgia,serif;font-weight:400}p{color:#6f675b;line-height:1.6}.error{padding:12px;color:#8a1c12;background:#ffe9e5;border-radius:8px}label{display:grid;gap:6px;margin:15px 0;font-size:13px;font-weight:700}input{height:44px;padding:0 12px;border:1px solid #d9cfbd;border-radius:8px}button,a{width:100%;min-height:46px;display:grid;place-items:center;color:#171005;background:#efd16c;border:0;border-radius:8px;font-weight:900;text-decoration:none;cursor:pointer}</style></head><body><main class="box"><img class="logo" src="assets/img/brand/logo-smell.webp" alt="Perfumería Smell"><h1>Instalación inicial</h1><?php if ($installed): ?><p>La base de datos ya está instalada.</p><a href="admin/login.php">Ir al panel administrativo</a><?php else: ?><p>Enciende Apache y MySQL en XAMPP. Luego crea el acceso del administrador.</p><?php if ($error): ?><div class="error"><?= e($error) ?></div><?php endif; ?><form method="post"><input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>"><label>Usuario administrador<input name="username" required minlength="4" maxlength="60" autocomplete="username"></label><label>Contraseña<input name="password" type="password" required minlength="8" autocomplete="new-password"></label><button type="submit">Instalar base de datos</button></form><?php endif; ?></main></body></html>
