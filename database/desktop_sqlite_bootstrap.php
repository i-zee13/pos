<?php
/**
 * Apply SQLite bootstrap schema + always ensure local admin login works.
 * Usage: php database/desktop_sqlite_bootstrap.php /absolute/path/to/pos-local.sqlite
 */
if ($argc < 2) {
    fwrite(STDERR, "Usage: php desktop_sqlite_bootstrap.php /path/to/pos-local.sqlite\n");
    exit(1);
}

$dbPath = $argv[1];
$bootstrap = __DIR__ . DIRECTORY_SEPARATOR . 'sqlite-bootstrap.sql';

if (!is_file($bootstrap)) {
    fwrite(STDERR, "Missing sqlite-bootstrap.sql next to this script\n");
    exit(1);
}

$dir = dirname($dbPath);
if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
}
if (!file_exists($dbPath)) {
    touch($dbPath);
}

$pdo = new PDO('sqlite:' . $dbPath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

function applySqlFile(PDO $pdo, string $file): int
{
    $sql = file_get_contents($file);
    $lines = preg_split("/\r\n|\n|\r/", $sql);
    $buf = '';
    $applied = 0;
    foreach ($lines as $line) {
        $trim = ltrim($line);
        if ($trim === '' || str_starts_with($trim, '--')) {
            continue;
        }
        $buf .= $line . "\n";
        if (str_ends_with(rtrim($line), ';')) {
            $stmt = trim($buf);
            $buf = '';
            if ($stmt === '') {
                continue;
            }
            try {
                $pdo->exec($stmt);
                $applied++;
            } catch (Throwable $e) {
                $msg = strtolower($e->getMessage());
                if (
                    str_contains($msg, 'duplicate column') ||
                    str_contains($msg, 'already exists')
                ) {
                    continue;
                }
                throw $e;
            }
        }
    }
    return $applied;
}

/**
 * Local desktop login: email/username admin, password admin123
 * Always upsert so a half-applied bootstrap still becomes usable.
 */
function ensureLocalAdmin(PDO $pdo): void
{
    $tables = $pdo->query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('organization','users')"
    )->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('organization', $tables, true) || !in_array('users', $tables, true)) {
        throw new RuntimeException('organization/users tables missing after bootstrap');
    }

    $orgCount = (int) $pdo->query('SELECT COUNT(*) FROM organization')->fetchColumn();
    if ($orgCount === 0) {
        $pdo->exec(
            "INSERT INTO organization (
                id, tenant_id, name, phone_number, email, address,
                city_id, postal_code_id, state_id, country_id, logo_img,
                created_by, created_at, updated_by, updated_at
            ) VALUES (
                1, 1, 'Storeeo Local', '0000000000', 'local@storeeo.app', 'Local offline shop',
                0, 0, 0, 0, '',
                1, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP
            )"
        );
    } else {
        $pdo->exec('UPDATE organization SET tenant_id = COALESCE(tenant_id, 1) WHERE id = 1 OR tenant_id IS NULL');
    }

    // bcrypt of admin123 (cost 10)
    $hash = '$2y$10$p2sI/xKPb5ASjfGELBHK4egDwIncViYCcXql9VqY66Te7.wYb/dFe';

    $user = $pdo->query(
        "SELECT id FROM users WHERE email = 'admin' OR username = 'admin' LIMIT 1"
    )->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $stmt = $pdo->prepare(
            'UPDATE users SET
                password = :password,
                email = \'admin\',
                username = \'admin\',
                name = COALESCE(name, \'Local Admin\'),
                active = 1,
                super = 1,
                tenant_id = COALESCE(tenant_id, 1),
                country = COALESCE(country, \'0\'),
                reporting_to = COALESCE(reporting_to, 0),
                department_id = COALESCE(department_id, 0),
                password_changed = COALESCE(password_changed, 0),
                force_logout = 0,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = :id'
        );
        $stmt->execute(['password' => $hash, 'id' => $user['id']]);
    } else {
        $pdo->exec(
            "INSERT INTO users (
                id, tenant_id, name, username, email, country,
                reporting_to, department_id, password, super, active,
                password_changed, force_logout, created_at, updated_at
            ) VALUES (
                1, 1, 'Local Admin', 'admin', 'admin', '0',
                0, 0, '{$hash}', 1, 1,
                0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )"
        );
    }
}

$exists = $pdo->query(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='organization'"
)->fetchColumn();

try {
    if (!$exists) {
        $applied = applySqlFile($pdo, $bootstrap);
        echo "OK schema imported ({$applied} statements)\n";
    } else {
        echo "OK schema already present\n";
    }
    ensureLocalAdmin($pdo);
    echo "OK local admin ready (admin / admin123)\n";
} catch (Throwable $e) {
    fwrite(STDERR, 'Bootstrap error: ' . $e->getMessage() . "\n");
    exit(2);
}

exit(0);
