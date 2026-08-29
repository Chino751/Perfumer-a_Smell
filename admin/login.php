<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/app.php';
if (!database_ready()) { header('Location: ../install.php'); exit; }
if (!empty($_SESSION['admin_id'])) { header('Location: index.php'); exit; }
$error='';
if ($_SERVER['REQUEST_METHOD']==='POST') {
  verify_csrf();
  $username=trim((string)($_POST['username']??'')); $password=(string)($_POST['password']??'');
  $blockedUntil=(int)($_SESSION['login_blocked_until']??0);
  if ($blockedUntil>time()) $error='Demasiados intentos. Espera un minuto.';
  else {
    $stmt=db()->prepare('SELECT id, username, password_hash FROM admin_users WHERE username=? LIMIT 1'); $stmt->execute([$username]); $user=$stmt->fetch();
    if ($user && password_verify($password,$user['password_hash'])) { session_regenerate_id(true); $_SESSION['admin_id']=$user['id']; $_SESSION['admin_username']=$user['username']; unset($_SESSION['login_attempts'],$_SESSION['login_blocked_until']); header('Location: index.php'); exit; }
    $attempts=(int)($_SESSION['login_attempts']??0)+1; $_SESSION['login_attempts']=$attempts; if($attempts>=5){$_SESSION['login_blocked_until']=time()+60;$_SESSION['login_attempts']=0;} $error='Usuario o contraseña incorrectos.';
  }
}
?>
<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ingresar | Smell</title><link rel="stylesheet" href="admin.css"></head><body class="login-page"><main class="login-box"><img src="../assets/img/brand/logo-smell.webp" alt="Perfumería Smell"><h1>Panel administrativo</h1><p class="subtitle">Gestiona catálogo, stock, imágenes y combos.</p><?php if(isset($_GET['installed'])):?><div class="notice ok">Instalación completada. Ya puedes ingresar.</div><?php endif;?><?php if($error):?><div class="notice error"><?=e($error)?></div><?php endif;?><form method="post"><input type="hidden" name="csrf_token" value="<?=e(csrf_token())?>"><label>Usuario<input name="username" required autocomplete="username"></label><label>Contraseña<input type="password" name="password" required autocomplete="current-password"></label><button class="btn gold" type="submit">Ingresar</button></form><a href="../index.php">Volver a la tienda</a></main></body></html>
