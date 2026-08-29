<?php
declare(strict_types=1);
require_once __DIR__.'/_header.php';
$message='';$error='';
if($_SERVER['REQUEST_METHOD']==='POST'){
  verify_csrf();
  try{
    $whatsapp=preg_replace('/\D/','',(string)($_POST['whatsapp']??''));$maps=trim((string)($_POST['maps_url']??''));$hours=trim((string)($_POST['hours']??''));$discount=trim((string)($_POST['discount_text']??''));$instagram=trim((string)($_POST['instagram_url']??''));$tiktok=trim((string)($_POST['tiktok_url']??''));
    if(strlen($whatsapp)<8||!filter_var($maps,FILTER_VALIDATE_URL)||!str_starts_with($maps,'https://')||!filter_var($instagram,FILTER_VALIDATE_URL)||!str_starts_with($instagram,'https://')||!filter_var($tiktok,FILTER_VALIDATE_URL)||!str_starts_with($tiktok,'https://')||$hours===''||$discount==='')throw new RuntimeException('Revisa los datos ingresados. Todos los enlaces deben usar HTTPS.');
    $upsert=db()->prepare('INSERT INTO settings(setting_key,setting_value) VALUES(?,?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)');foreach(['whatsapp'=>$whatsapp,'maps_url'=>$maps,'hours'=>$hours,'discount_text'=>$discount,'instagram_url'=>$instagram,'tiktok_url'=>$tiktok] as $key=>$value)$upsert->execute([$key,$value]);$message='Datos del negocio actualizados.';
  }catch(Throwable $exception){$error=$exception->getMessage();}
}
$values=['whatsapp'=>setting('whatsapp','59175631782'),'maps_url'=>setting('maps_url','https://maps.app.goo.gl/DAhQgRibsNEDLpxC8'),'hours'=>setting('hours','08:00 a 22:00'),'discount_text'=>setting('discount_text','Descuento especial desde 3 decants'),'instagram_url'=>setting('instagram_url','https://www.instagram.com/perfumeria._smell'),'tiktok_url'=>setting('tiktok_url','https://www.tiktok.com/@perfumeria.smell_')];
?>
<h1>Datos del negocio</h1><p class="subtitle">Estos datos aparecen en el catálogo y en los enlaces de contacto.</p><?php if($message):?><div class="notice ok"><?=e($message)?></div><?php endif;?><?php if($error):?><div class="notice error"><?=e($error)?></div><?php endif;?><section class="panel"><form method="post" class="edit-grid"><input type="hidden" name="csrf_token" value="<?=e(csrf_token())?>"><label>WhatsApp con código de país<input name="whatsapp" required maxlength="20" value="<?=e($values['whatsapp'])?>"></label><label>Horario<input name="hours" required maxlength="80" value="<?=e($values['hours'])?>"></label><label class="wide">Enlace de Google Maps<input type="url" name="maps_url" required maxlength="500" value="<?=e($values['maps_url'])?>"></label><label class="wide">Instagram<input type="url" name="instagram_url" required maxlength="500" value="<?=e($values['instagram_url'])?>"></label><label class="wide">TikTok<input type="url" name="tiktok_url" required maxlength="500" value="<?=e($values['tiktok_url'])?>"></label><label class="wide">Texto del descuento<input name="discount_text" required maxlength="160" value="<?=e($values['discount_text'])?>"></label><div class="wide"><button class="btn gold">Guardar información</button></div></form></section>
<?php require __DIR__.'/_footer.php'; ?>
