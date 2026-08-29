<?php
declare(strict_types=1);

function save_uploaded_image(string $field, string $folder, string $prefix): ?string
{
    if (empty($_FILES[$field]) || ($_FILES[$field]['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) return null;
    $file=$_FILES[$field];
    if ($file['error']!==UPLOAD_ERR_OK) throw new RuntimeException('No se pudo subir la imagen.');
    if ((int)$file['size']>3*1024*1024) throw new RuntimeException('La imagen no puede superar 3 MB.');
    $mime=(new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    $allowed=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];
    if (!isset($allowed[$mime])) throw new RuntimeException('Solo se permiten imágenes JPG, PNG o WebP.');
    $safeFolder=trim($folder,'/');
    $targetDir=__DIR__.'/../'.$safeFolder;
    if (!is_dir($targetDir) && !mkdir($targetDir,0775,true) && !is_dir($targetDir)) throw new RuntimeException('No se pudo crear la carpeta de imágenes.');
    $base=preg_replace('/[^a-z0-9-]/','-',strtolower($prefix)).'-'.bin2hex(random_bytes(5));
    if (function_exists('imagecreatefromstring') && function_exists('imagewebp')) {
        $raw=file_get_contents($file['tmp_name']); $image=$raw!==false?@imagecreatefromstring($raw):false;
        if (!$image) throw new RuntimeException('La imagen está dañada.');
        $filename=$base.'.webp'; imagewebp($image,$targetDir.'/'.$filename,84); imagedestroy($image);
    } else {
        $filename=$base.'.'.$allowed[$mime];
        if (!move_uploaded_file($file['tmp_name'],$targetDir.'/'.$filename)) throw new RuntimeException('No se pudo guardar la imagen.');
    }
    return $safeFolder.'/'.$filename;
}
