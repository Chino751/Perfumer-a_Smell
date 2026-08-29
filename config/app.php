<?php
declare(strict_types=1);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
    session_start();
}

$databaseConfig = [];
$databaseConfigPath = __DIR__ . '/database.php';

if (is_file($databaseConfigPath)) {
    $loadedDatabaseConfig = require $databaseConfigPath;
    if (is_array($loadedDatabaseConfig)) {
        $databaseConfig = $loadedDatabaseConfig;
    }
}

$envDbHost = getenv('SMELL_DB_HOST');
$envDbPort = getenv('SMELL_DB_PORT');
$envDbName = getenv('SMELL_DB_NAME');
$envDbUser = getenv('SMELL_DB_USER');
$envDbPass = getenv('SMELL_DB_PASSWORD');

define('DB_HOST', (string)($databaseConfig['host'] ?? ($envDbHost !== false ? $envDbHost : '127.0.0.1')));
define('DB_PORT', (string)($databaseConfig['port'] ?? ($envDbPort !== false ? $envDbPort : '3306')));
define('DB_NAME', (string)($databaseConfig['name'] ?? ($envDbName !== false ? $envDbName : 'perfumeria_smell')));
define('DB_USER', (string)($databaseConfig['user'] ?? ($envDbUser !== false ? $envDbUser : '')));
define('DB_PASS', (string)($databaseConfig['password'] ?? ($envDbPass !== false ? $envDbPass : '')));

function db(bool $withoutDatabase = false): PDO
{
    static $connections = [];
    $key = $withoutDatabase ? 'server' : 'database';
    if (!isset($connections[$key])) {
        $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ($withoutDatabase ? '' : ';dbname=' . DB_NAME) . ';charset=utf8mb4';
        $connections[$key] = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $connections[$key];
}

function database_ready(): bool
{
    try {
        db()->query('SELECT 1 FROM perfumes LIMIT 1');
        return true;
    } catch (Throwable) {
        return false;
    }
}

function table_row_count(PDO $pdo, string $table): int
{
    $allowed = ['perfumes', 'combos', 'admin_users'];
    if (!in_array($table, $allowed, true)) {
        throw new InvalidArgumentException('Tabla no permitida.');
    }
    return (int)$pdo->query('SELECT COUNT(*) FROM `' . $table . '`')->fetchColumn();
}

/**
 * Completa los datos iniciales sin sobrescribir cambios del administrador.
 * Los perfumes se cargan en una tabla vacía y los combos se sincronizan por
 * slug con INSERT IGNORE, por lo que las promociones nuevas aparecen también
 * en instalaciones que ya tenían una versión anterior.
 */
function seed_initial_data(PDO $pdo): void
{
    if (table_row_count($pdo, 'perfumes') === 0) {
        $catalogFile = __DIR__ . '/../data/catalog.json';
        $catalog = json_decode((string)file_get_contents($catalogFile), true, 512, JSON_THROW_ON_ERROR);
        $insertPerfume = $pdo->prepare(
            'INSERT IGNORE INTO perfumes
            (id, slide, name, brand, price_5, price_10, image, full_bottle, preserve_exact)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        foreach ($catalog as $item) {
            $insertPerfume->execute([
                $item['id'],
                $item['slide'],
                $item['name'],
                $item['brand'],
                $item['price5'],
                $item['price10'],
                $item['image'],
                !empty($item['fullBottle']) ? 1 : 0,
                !empty($item['preserveExact']) ? 1 : 0,
            ]);
        }
    }

    $combosFile = __DIR__ . '/../data/combos.json';
    $combos = json_decode((string)file_get_contents($combosFile), true, 512, JSON_THROW_ON_ERROR);
    $insertCombo = $pdo->prepare(
        'INSERT IGNORE INTO combos (slug, name, type, price, image, items_json)
        VALUES (?, ?, ?, ?, ?, ?)'
    );
    foreach ($combos as $combo) {
        $insertCombo->execute([
            $combo['id'],
            $combo['name'],
            $combo['type'],
            $combo['price'],
            $combo['image'],
            json_encode($combo['items'], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
        ]);
    }

    $updateDefaultDiva = $pdo->prepare(
        'UPDATE combos SET items_json = ? WHERE slug = ? AND items_json = ?'
    );
    $updateDefaultDiva->execute([
        json_encode(['Yara Rosa', 'Odyssey Candee', 'Eclaire Pistache'], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
        'diva',
        json_encode(['Yara', 'Odyssey Candee', 'Eclaire Pistache'], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
    ]);

    $settings = [
        'whatsapp' => '59175631782',
        'maps_url' => 'https://maps.app.goo.gl/DAhQgRibsNEDLpxC8',
        'hours' => '08:00 a 22:00',
        'discount_text' => 'Descuento especial desde 3 decants',
        'instagram_url' => 'https://www.instagram.com/perfumeria._smell',
        'tiktok_url' => 'https://www.tiktok.com/@perfumeria.smell_',
    ];
    $insertSetting = $pdo->prepare(
        'INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)'
    );
    foreach ($settings as $key => $value) {
        $insertSetting->execute([$key, $value]);
    }
}

function ensure_store_data(): void
{
    static $checked = false;
    if ($checked || !database_ready()) {
        return;
    }
    $checked = true;
    $pdo = db();
    $startedTransaction = !$pdo->inTransaction();
    try {
        if ($startedTransaction) {
            $pdo->beginTransaction();
        }
        seed_initial_data($pdo);
        if ($startedTransaction) {
            $pdo->commit();
        }
    } catch (Throwable $exception) {
        if ($startedTransaction && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $exception;
    }
}

function installation_complete(): bool
{
    if (!database_ready()) {
        return false;
    }
    try {
        ensure_store_data();
        $pdo = db();
        return table_row_count($pdo, 'perfumes') > 0
            && table_row_count($pdo, 'combos') > 0
            && table_row_count($pdo, 'admin_users') > 0;
    } catch (Throwable) {
        return false;
    }
}

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function text_lower(string $value): string
{
    return function_exists('mb_strtolower')
        ? mb_strtolower($value, 'UTF-8')
        : strtolower($value);
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf(): void
{
    $token = $_POST['csrf_token'] ?? '';
    if (!is_string($token) || !hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        http_response_code(419);
        exit('La sesión venció. Recarga la página e inténtalo nuevamente.');
    }
}

function public_image(string $storedPath): string
{
    if (str_starts_with($storedPath, 'uploads/')) {
        return $storedPath;
    }
    return 'assets/img/' . ltrim(str_replace('/assets/', '', $storedPath), '/');
}

function load_catalog(): array
{
    if (database_ready()) {
        try {
            ensure_store_data();
            $rows = db()->query('SELECT id, slide, name, brand, price_5 AS price5, price_10 AS price10, image, full_bottle AS fullBottle, preserve_exact AS preserveExact, stock_5, stock_10, stock_full FROM perfumes WHERE active = 1 ORDER BY id')->fetchAll();
            if ($rows !== []) {
                return $rows;
            }
        } catch (Throwable) {
            // El JSON local mantiene visible la tienda si MySQL falla temporalmente.
        }
    }
    $data = file_get_contents(__DIR__ . '/../data/catalog.json');
    return $data ? json_decode($data, true, 512, JSON_THROW_ON_ERROR) : [];
}

function load_combos(): array
{
    if (database_ready()) {
        try {
            ensure_store_data();
            $rows = db()->query('SELECT id, slug, name, type, price, image, items_json, active FROM combos WHERE active = 1 ORDER BY id')->fetchAll();
            if ($rows !== []) {
                return array_map(static function (array $row): array {
                    $row['items'] = json_decode($row['items_json'], true) ?: [];
                    return $row;
                }, $rows);
            }
        } catch (Throwable) {
            // Continúa con el respaldo JSON local.
        }
    }
    $data = file_get_contents(__DIR__ . '/../data/combos.json');
    return $data ? json_decode($data, true, 512, JSON_THROW_ON_ERROR) : [];
}

function setting(string $key, string $fallback): string
{
    if (!database_ready()) return $fallback;
    try {
        ensure_store_data();
        $stmt = db()->prepare('SELECT setting_value FROM settings WHERE setting_key = ? LIMIT 1');
        $stmt->execute([$key]);
        $value = $stmt->fetchColumn();
        return is_string($value) && $value !== '' ? $value : $fallback;
    } catch (Throwable) {
        return $fallback;
    }
}
