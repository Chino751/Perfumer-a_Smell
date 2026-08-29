<?php
declare(strict_types=1);
require_once __DIR__.'/../config/uploads.php';
require_once __DIR__.'/_header.php';
$message='';$error='';
if($_SERVER['REQUEST_METHOD']==='POST'){
  verify_csrf();
  try{
    $id=filter_input(INPUT_POST,'id',FILTER_VALIDATE_INT);if(!$id)throw new RuntimeException('Combo no válido.');
    $stmt=db()->prepare('SELECT * FROM combos WHERE id=?');$stmt->execute([$id]);$current=$stmt->fetch();if(!$current)throw new RuntimeException('Combo no encontrado.');
    $name=trim((string)($_POST['name']??''));$type=trim((string)($_POST['type']??''));$price=(float)($_POST['price']??0);$itemsText=trim((string)($_POST['items']??''));
    $items=array_values(array_filter(array_map('trim',preg_split('/\R/',$itemsText)?:[])));if($name===''||$type===''||count($items)===0)throw new RuntimeException('Completa nombre, presentación y productos.');if($price<0)throw new RuntimeException('El precio no puede ser negativo.');
    $image=save_uploaded_image('image','uploads/combos','combo-'.$id)??$current['image'];$active=isset($_POST['active'])?1:0;
    $update=db()->prepare('UPDATE combos SET name=?,type=?,price=?,items_json=?,image=?,active=? WHERE id=?');$update->execute([$name,$type,$price,json_encode($items,JSON_UNESCAPED_UNICODE),$image,$active,$id]);$message='Combo actualizado correctamente.';
  }catch(Throwable $exception){$error=$exception->getMessage();}
}
$rows=db()->query('SELECT * FROM combos ORDER BY id')->fetchAll();$edit=null;if(isset($_GET['edit'])){$stmt=db()->prepare('SELECT * FROM combos WHERE id=?');$stmt->execute([(int)$_GET['edit']]);$edit=$stmt->fetch();}
?>
<h1>Combos</h1><p class="subtitle">Administra productos, precio, presentación, visibilidad e imagen de cada combo.</p><?php if($message):?><div class="notice ok"><?=e($message)?></div><?php endif;?><?php if($error):?><div class="notice error"><?=e($error)?></div><?php endif;?>
<?php if($edit):$items=json_decode($edit['items_json'],true)?:[];?><section class="panel"><h2>Editar: <?=e($edit['name'])?></h2><form method="post" enctype="multipart/form-data" class="edit-grid"><input type="hidden" name="csrf_token" value="<?=e(csrf_token())?>"><input type="hidden" name="id" value="<?=$edit['id']?>"><label>Nombre<input name="name" required maxlength="120" value="<?=e($edit['name'])?>"></label><label>Presentación<input name="type" required maxlength="180" value="<?=e($edit['type'])?>"></label><label>Precio<input name="price" type="number" min="0" step="0.01" required value="<?=$edit['price']?>"></label><label>Nueva imagen (máx. 3 MB)<input name="image" type="file" accept="image/png,image/jpeg,image/webp"></label><label class="wide">Productos, uno por línea<textarea name="items" rows="5" required><?=e(implode("\n",$items))?></textarea></label><label><span>Visibilidad</span><span><input name="active" type="checkbox" value="1" <?=$edit['active']?'checked':''?>> Mostrar combo</span></label><div class="wide toolbar"><button class="btn gold">Guardar cambios</button><a class="btn light" href="combos.php">Cancelar</a></div></form></section><?php endif;?>
<section class="panel"><table class="admin-table"><thead><tr><th>Imagen</th><th>Combo</th><th>Productos</th><th>Precio</th><th>Estado</th><th></th></tr></thead><tbody><?php foreach($rows as $row):$items=json_decode($row['items_json'],true)?:[];?><tr><td data-label="Imagen"><img class="thumb" src="../<?=e(public_image($row['image']))?>" alt=""></td><td data-label="Combo"><strong><?=e($row['name'])?></strong><br><?=e($row['type'])?></td><td data-label="Productos" class="combo-items"><?=e(implode(' · ',$items))?></td><td data-label="Precio"><?=number_format((float)$row['price'],0,',','.')?> Bs</td><td data-label="Estado"><?=$row['active']?'Visible':'Oculto'?></td><td><a class="btn light" href="?edit=<?=$row['id']?>">Editar</a></td></tr><?php endforeach;?></tbody></table></section>
<?php require __DIR__.'/_footer.php'; ?>
