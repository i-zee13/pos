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
        $shopName = getenv('DESKTOP_SHOP_NAME') ?: 'Storeeo Local';
        $shopName = substr(preg_replace('/[^\p{L}\p{N}\s\-\_\.\&]/u', '', $shopName) ?: 'Storeeo Local', 0, 120);
        $shopNameSql = str_replace("'", "''", $shopName);
        $pdo->exec(
            "INSERT INTO organization (
                id, tenant_id, name, phone_number, email, address,
                city_id, postal_code_id, state_id, country_id, logo_img,
                created_by, created_at, updated_by, updated_at
            ) VALUES (
                1, 1, '{$shopNameSql}', '0000000000', 'local@storeeo.app', 'Local offline shop',
                0, 0, 0, 0, 'images/storeeo-default-logo.png',
                1, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP
            )"
        );
    } else {
        $pdo->exec('UPDATE organization SET tenant_id = COALESCE(tenant_id, 1) WHERE id = 1 OR tenant_id IS NULL');
        $shopName = getenv('DESKTOP_SHOP_NAME');
        if (is_string($shopName) && trim($shopName) !== '') {
            $shopName = substr(preg_replace('/[^\p{L}\p{N}\s\-\_\.\&]/u', '', $shopName) ?: '', 0, 120);
            if ($shopName !== '') {
                $stmt = $pdo->prepare('UPDATE organization SET name = ? WHERE id = 1');
                $stmt->execute([$shopName]);
            }
        }
    }

    // bcrypt of admin123 (cost 10)
    $hash = '$2y$10$p2sI/xKPb5ASjfGELBHK4egDwIncViYCcXql9VqY66Te7.wYb/dFe';

    $user = $pdo->query(
        "SELECT id FROM users WHERE email = 'admin' OR username = 'admin' LIMIT 1"
    )->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $stmt = $pdo->prepare(
            'UPDATE users SET
                email = \'admin\',
                username = \'admin\',
                name = COALESCE(name, \'Local Admin\'),
                active = 1,
                super = 1,
                tenant_id = COALESCE(tenant_id, 1),
                country = COALESCE(country, \'0\'),
                reporting_to = COALESCE(reporting_to, 0),
                department_id = COALESCE(department_id, 0),
                force_logout = 0,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = :id'
        );
        $stmt->execute(['id' => $user['id']]);
        // Password intentionally NOT reset on every start (shopkeeper may have changed it).
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

/**
 * Same 4 system accounts as MySQL setup_tenant_database.sql / provision_system_customers().
 * Prefer stable ids 5–8 when free (JS fallbacks use those literals).
 */
function ensureSystemCustomers(PDO $pdo): void
{
    $tables = $pdo->query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='customers'"
    )->fetchColumn();
    if (!$tables) {
        throw new RuntimeException('customers table missing after bootstrap');
    }

    try {
        $pdo->exec('ALTER TABLE customers ADD COLUMN system_code TEXT');
    } catch (Throwable $e) {
        // column already exists
    }

    $adminId = (int) ($pdo->query(
        "SELECT id FROM users WHERE email = 'admin' OR username = 'admin' ORDER BY id ASC LIMIT 1"
    )->fetchColumn() ?: 1);

    $defs = [
        ['id' => 5, 'name' => 'EXPENSE',             'type' => 2, 'code' => 'EXPENSE'],
        ['id' => 6, 'name' => 'NET PURCHASE RETURN', 'type' => 1, 'code' => 'NET_PURCHASE_RETURN'],
        ['id' => 7, 'name' => 'NET PURCHASE',        'type' => 1, 'code' => 'NET_PURCHASE'],
        ['id' => 8, 'name' => 'Counter Sale',        'type' => 2, 'code' => 'COUNTER_SALE'],
    ];

    foreach ($defs as $def) {
        $byCode = $pdo->prepare('SELECT id FROM customers WHERE system_code = ? LIMIT 1');
        $byCode->execute([$def['code']]);
        $existingId = $byCode->fetchColumn();
        if ($existingId) {
            $upd = $pdo->prepare(
                'UPDATE customers SET
                    customer_name = ?,
                    customer_type = ?,
                    tenant_id = COALESCE(tenant_id, 1),
                    updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?'
            );
            $upd->execute([$def['name'], $def['type'], $existingId]);
            continue;
        }

        $byName = $pdo->prepare(
            'SELECT id FROM customers WHERE UPPER(TRIM(customer_name)) = UPPER(?) LIMIT 1'
        );
        $byName->execute([$def['name']]);
        $nameId = $byName->fetchColumn();
        if ($nameId) {
            $upd = $pdo->prepare(
                'UPDATE customers SET system_code = ?, tenant_id = COALESCE(tenant_id, 1), updated_at = CURRENT_TIMESTAMP WHERE id = ?'
            );
            $upd->execute([$def['code'], $nameId]);
            continue;
        }

        $idTaken = (int) $pdo->query(
            'SELECT COUNT(*) FROM customers WHERE id = ' . (int) $def['id']
        )->fetchColumn();

        if ($idTaken === 0) {
            $ins = $pdo->prepare(
                'INSERT INTO customers (
                    id, tenant_id, customer_name, customer_type, system_code, balance,
                    created_by, created_at, updated_at
                ) VALUES (?, 1, ?, ?, ?, 0, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
            );
            $ins->execute([$def['id'], $def['name'], $def['type'], $def['code'], $adminId]);
        } else {
            $ins = $pdo->prepare(
                'INSERT INTO customers (
                    tenant_id, customer_name, customer_type, system_code, balance,
                    created_by, created_at, updated_at
                ) VALUES (1, ?, ?, ?, 0, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
            );
            $ins->execute([$def['name'], $def['type'], $def['code'], $adminId]);
        }
    }
}

/** One default company so product add works on empty local DB. */
function ensureDefaultCompany(PDO $pdo): void
{
    $tables = $pdo->query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='companies'"
    )->fetchColumn();
    if (!$tables) {
        return;
    }

    $count = (int) $pdo->query('SELECT COUNT(*) FROM companies')->fetchColumn();
    if ($count > 0) {
        return;
    }

    $adminId = (int) ($pdo->query(
        "SELECT id FROM users ORDER BY id ASC LIMIT 1"
    )->fetchColumn() ?: 1);

    $pdo->exec(
        "INSERT INTO companies (
            id, tenant_id, company_name, created_by, created_at, updated_at
        ) VALUES (
            1, 1, 'General', {$adminId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )"
    );
}

/** Main shop godown for stock flows. */
function ensureDefaultGodown(PDO $pdo): void
{
    $tables = $pdo->query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='godowns'"
    )->fetchColumn();
    if (!$tables) {
        return;
    }

    $count = (int) $pdo->query('SELECT COUNT(*) FROM godowns')->fetchColumn();
    if ($count > 0) {
        return;
    }

    $pdo->exec(
        "INSERT INTO godowns (id, name, code, type, is_active, created_at, updated_at)
         VALUES (1, 'Main Shop', 'MAIN', 'shop', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
    );
}

/** Minimal geo rows so organization screens don't break. */
function ensureGeoBasics(PDO $pdo): void
{
    $hasCountries = $pdo->query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='countries'"
    )->fetchColumn();
    if ($hasCountries && (int) $pdo->query('SELECT COUNT(*) FROM countries')->fetchColumn() === 0) {
        $pdo->exec(
            "INSERT INTO countries (id, name, iso, default_status, phonecode, created_at, updated_at)
             VALUES (1, 'Pakistan', 'PK', 1, '92', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
        );
    }

    $hasStates = $pdo->query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='states'"
    )->fetchColumn();
    if ($hasStates && (int) $pdo->query('SELECT COUNT(*) FROM states')->fetchColumn() === 0) {
        $pdo->exec(
            "INSERT INTO states (id, name, country_id, created_at, updated_at)
             VALUES (1, 'Punjab', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
        );
    }

    $hasCities = $pdo->query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='cities'"
    )->fetchColumn();
    if ($hasCities && (int) $pdo->query('SELECT COUNT(*) FROM cities')->fetchColumn() === 0) {
        $pdo->exec(
            "INSERT INTO cities (id, name, state_id, country_id, created_at, updated_at, created_by)
             VALUES (1, 'Lahore', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)"
        );
    }
}

/** Seed default logo into storage + organization.logo_img / print_logo. */
function ensureOrganizationLogo(PDO $pdo): void
{
    $laravelRoot = dirname(__DIR__);
    $srcCandidates = [
        $laravelRoot . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'print-logo.png',
        $laravelRoot . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'Shama-logo.png',
    ];
    $src = null;
    foreach ($srcCandidates as $candidate) {
        if (is_file($candidate)) {
            $src = $candidate;
            break;
        }
    }
    if ($src === null) {
        echo "WARN: no default logo image found under public/images\n";
        return;
    }

    $rel = 'images/storeeo-default-logo.png';
    $destDirs = [
        $laravelRoot . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'images',
        $laravelRoot . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'images',
    ];
    foreach ($destDirs as $destDir) {
        if (!is_dir($destDir)) {
            mkdir($destDir, 0777, true);
        }
        $dest = $destDir . DIRECTORY_SEPARATOR . 'storeeo-default-logo.png';
        if (!is_file($dest)) {
            copy($src, $dest);
        }
    }

    try {
        $pdo->exec('ALTER TABLE organization ADD COLUMN print_logo TEXT');
    } catch (Throwable $e) {
        // already exists
    }

    $pdo->exec(
        "UPDATE organization SET
            logo_img = CASE WHEN logo_img IS NULL OR TRIM(logo_img) = '' THEN '{$rel}' ELSE logo_img END,
            print_logo = CASE WHEN print_logo IS NULL OR TRIM(print_logo) = '' THEN '{$rel}' ELSE print_logo END"
    );
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
    ensureSystemCustomers($pdo);
    echo "OK system customers ready (EXPENSE / Counter Sale / NET PURCHASE / NET PURCHASE RETURN)\n";
    ensureDefaultCompany($pdo);
    echo "OK default company ready\n";
    ensureDefaultGodown($pdo);
    echo "OK default godown ready\n";
    ensureGeoBasics($pdo);
    echo "OK geo basics ready\n";
    ensureOrganizationLogo($pdo);
    echo "OK organization logo ready\n";
} catch (Throwable $e) {
    fwrite(STDERR, 'Bootstrap error: ' . $e->getMessage() . "\n");
    exit(2);
}

exit(0);
