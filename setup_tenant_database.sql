-- =====================================================================
--  POS — TENANT + FEATURE DB SETUP (idempotent / MySQL + MariaDB)
--  -------------------------------------------------------------------
--  Works on:
--    • MariaDB 10.x (shared hosting)
--    • MySQL 8+/9 (Homebrew local)
--
--  Safe to re-run: missing columns/indexes only; no duplicate errors.
--  Run:  mysql -u USER -p DB < setup_tenant_database.sql
-- =====================================================================

SET @t := 1;
SET @admin_user_id := (SELECT `id` FROM `users` ORDER BY `id` ASC LIMIT 1);
SET @admin_user_id := IFNULL(@admin_user_id, 1);

-- MySQL 8+/9 strict mode: legacy dumps often have '0000-00-00' dates.
-- Relax only for this session so ALTER/UPDATE on old rows don't fail.
SET @pos_old_sql_mode := @@SESSION.sql_mode;
SET SESSION sql_mode = REPLACE(REPLACE(REPLACE(@@SESSION.sql_mode,
  'NO_ZERO_DATE', ''),
  'NO_ZERO_IN_DATE', ''),
  'STRICT_TRANS_TABLES', '');

DROP PROCEDURE IF EXISTS `pos_add_column_if_missing`;
DROP PROCEDURE IF EXISTS `pos_add_index_if_missing`;

DELIMITER $$

CREATE PROCEDURE `pos_add_column_if_missing`(
  IN p_table VARCHAR(64),
  IN p_column VARCHAR(64),
  IN p_definition TEXT
)
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = p_table
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table
      AND COLUMN_NAME = p_column
  ) THEN
    SET @pos_sql := CONCAT(
      'ALTER TABLE `', p_table, '` ADD COLUMN `', p_column, '` ', p_definition
    );
    PREPARE pos_stmt FROM @pos_sql;
    EXECUTE pos_stmt;
    DEALLOCATE PREPARE pos_stmt;
  END IF;
END$$

CREATE PROCEDURE `pos_add_index_if_missing`(
  IN p_table VARCHAR(64),
  IN p_index VARCHAR(64),
  IN p_columns VARCHAR(255)
)
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = p_table
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table
      AND INDEX_NAME = p_index
  ) THEN
    SET @pos_sql := CONCAT(
      'ALTER TABLE `', p_table, '` ADD INDEX `', p_index, '` (', p_columns, ')'
    );
    PREPARE pos_stmt FROM @pos_sql;
    EXECUTE pos_stmt;
    DEALLOCATE PREPARE pos_stmt;
  END IF;
END$$

DELIMITER ;


-- =============================================================================
-- STEP 0 — Tables only if completely missing
-- =============================================================================

CREATE TABLE IF NOT EXISTS `backup_logs` (
  `id`                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tenant_id`             BIGINT UNSIGNED NULL,
  `user_id`               BIGINT UNSIGNED NULL,
  `zip_filename`          VARCHAR(255) NULL,
  `local_relative_path`   VARCHAR(512) NULL,
  `databases`             JSON NOT NULL,
  `status`                VARCHAR(32) NOT NULL DEFAULT 'pending',
  `size_bytes`            BIGINT UNSIGNED NULL,
  `gdrive_uploaded`       TINYINT(1) NOT NULL DEFAULT 0,
  `gdrive_remote_path`    VARCHAR(512) NULL,
  `error_message`         TEXT NULL,
  `triggered_by`          VARCHAR(32) NOT NULL DEFAULT 'manual',
  `created_at`            TIMESTAMP NULL DEFAULT NULL,
  `updated_at`            TIMESTAMP NULL DEFAULT NULL,
  `completed_at`          TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `backup_logs_user_id_index` (`user_id`),
  KEY `backup_logs_status_index` (`status`),
  KEY `backup_logs_tenant_id_index` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_backup_mail_settings` (
  `id`                                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tenant_id`                               BIGINT UNSIGNED NULL,
  `user_id`                                 BIGINT UNSIGNED NOT NULL,
  `gmail`                                   VARCHAR(255) NOT NULL,
  `app_password_encrypted`                  TEXT NULL,
  `google_drive_refresh_token_encrypted`    TEXT NULL,
  `google_drive_access_token_encrypted`     TEXT NULL,
  `google_drive_token_expires_at`           TIMESTAMP NULL DEFAULT NULL,
  `google_drive_folder_id`                  VARCHAR(255) NULL,
  `google_drive_folder_name`                VARCHAR(255) NULL,
  `google_drive_connected_at`               TIMESTAMP NULL DEFAULT NULL,
  `created_at`                              TIMESTAMP NULL DEFAULT NULL,
  `updated_at`                              TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_backup_mail_settings_user_id_unique` (`user_id`),
  KEY `user_backup_mail_settings_tenant_id_index` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `stock_batch_allocations` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`          BIGINT UNSIGNED NOT NULL,
  `batch_row_id`        BIGINT UNSIGNED NOT NULL,
  `invoice_id`          BIGINT UNSIGNED NULL,
  `invoice_product_id`  BIGINT UNSIGNED NULL,
  `trx_type`            VARCHAR(32) NULL,
  `direction`           VARCHAR(8) NOT NULL DEFAULT 'out',
  `qty`                 DECIMAL(18,6) NOT NULL DEFAULT 0,
  `unit_cost`           DECIMAL(18,6) NOT NULL DEFAULT 0,
  `reversed`            TINYINT NOT NULL DEFAULT 0,
  `created_at`          TIMESTAMP NULL DEFAULT NULL,
  `updated_at`          TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_batch_allocations_product_id_index` (`product_id`),
  KEY `stock_batch_allocations_batch_row_id_index` (`batch_row_id`),
  KEY `stock_batch_allocations_invoice_id_index` (`invoice_id`),
  KEY `stock_batch_allocations_invoice_product_id_index` (`invoice_product_id`),
  KEY `stock_batch_allocations_reversed_index` (`reversed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- STEP 1 — tenant_id + index
-- =============================================================================

CALL pos_add_column_if_missing('users', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('users', 'users_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('products', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('products', 'products_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('companies', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('companies', 'companies_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('customers', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('customers', 'customers_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('purchase_invoices', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('purchase_invoices', 'purchase_invoices_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('products_purchases', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('products_purchases', 'products_purchases_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('purchase_return_invoices', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('purchase_return_invoices', 'purchase_return_invoices_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('products_returns', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('products_returns', 'products_returns_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('return_invoices', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('return_invoices', 'return_invoices_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('sale_invoices', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('sale_invoices', 'sale_invoices_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('products_sales', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('products_sales', 'products_sales_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('sale_return_invoices', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('sale_return_invoices', 'sale_return_invoices_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('sale_return_products', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('sale_return_products', 'sale_return_products_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('product_replacment_invoices', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('product_replacment_invoices', 'product_replacment_invoices_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('product_replacements', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('product_replacements', 'product_replacements_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('vendor_stocks', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('vendor_stocks', 'vendor_stocks_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('vendor_stock_managment', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('vendor_stock_managment', 'vendor_stock_managment_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('stock_batches_items', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('stock_batches_items', 'stock_batches_items_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('stocks', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('stocks', 'stocks_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('customer_ledger', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('customer_ledger', 'customer_ledger_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('vendor_ledger', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('vendor_ledger', 'vendor_ledger_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('admin_sale_close', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('admin_sale_close', 'admin_sale_close_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('organization', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('organization', 'organization_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('organization_location', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('organization_location', 'organization_location_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('access_rights', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('access_rights', 'access_rights_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('customer_transactions', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('customer_transactions', 'customer_transactions_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('vendor_transactions', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('vendor_transactions', 'vendor_transactions_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('integrations', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('integrations', 'integrations_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('backup_logs', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('backup_logs', 'backup_logs_tenant_id_index', '`tenant_id`');

CALL pos_add_column_if_missing('user_backup_mail_settings', 'tenant_id', 'BIGINT UNSIGNED NULL AFTER `id`');
CALL pos_add_index_if_missing('user_backup_mail_settings', 'user_backup_mail_settings_tenant_id_index', '`tenant_id`');


-- =============================================================================
-- STEP 1b — Feature columns
-- =============================================================================

CALL pos_add_column_if_missing('customers', 'system_code', 'VARCHAR(50) NULL AFTER `customer_type`');
CALL pos_add_index_if_missing('customers', 'customers_system_code_index', '`system_code`');

CALL pos_add_column_if_missing('organization', 'print_logo', 'VARCHAR(255) NULL AFTER `logo_img`');
CALL pos_add_column_if_missing('organization', 'refund_policy', 'TEXT NULL AFTER `print_logo`');
CALL pos_add_column_if_missing('organization', 'purchi_use_dynamic', 'TINYINT(1) NOT NULL DEFAULT 0 AFTER `refund_policy`');
CALL pos_add_column_if_missing('organization', 'purchi_config', 'JSON NULL AFTER `purchi_use_dynamic`');

CALL pos_add_column_if_missing('user_backup_mail_settings', 'google_drive_refresh_token_encrypted', 'TEXT NULL AFTER `app_password_encrypted`');
CALL pos_add_column_if_missing('user_backup_mail_settings', 'google_drive_access_token_encrypted', 'TEXT NULL AFTER `google_drive_refresh_token_encrypted`');
CALL pos_add_column_if_missing('user_backup_mail_settings', 'google_drive_token_expires_at', 'TIMESTAMP NULL DEFAULT NULL AFTER `google_drive_access_token_encrypted`');
CALL pos_add_column_if_missing('user_backup_mail_settings', 'google_drive_folder_id', 'VARCHAR(255) NULL AFTER `google_drive_token_expires_at`');
CALL pos_add_column_if_missing('user_backup_mail_settings', 'google_drive_folder_name', 'VARCHAR(255) NULL AFTER `google_drive_folder_id`');
CALL pos_add_column_if_missing('user_backup_mail_settings', 'google_drive_connected_at', 'TIMESTAMP NULL DEFAULT NULL AFTER `google_drive_folder_name`');

CALL pos_add_column_if_missing('stock_batches_items', 'unit_cost_price', 'DOUBLE NOT NULL DEFAULT 0 AFTER `total_balance`');


-- =============================================================================
-- STEP 2 — BACKFILL tenant_id = @t (users LAST)
-- =============================================================================

UPDATE `products` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `companies` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `customers` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `purchase_invoices` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `products_purchases` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `purchase_return_invoices` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `products_returns` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `return_invoices` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `sale_invoices` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `products_sales` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `sale_return_invoices` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `sale_return_products` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `product_replacment_invoices` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `product_replacements` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `vendor_stocks` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `vendor_stock_managment` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `stock_batches_items` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `stocks` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `customer_ledger` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `vendor_ledger` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `admin_sale_close` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `organization` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `organization_location` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `access_rights` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `customer_transactions` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `vendor_transactions` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `integrations` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `backup_logs` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `user_backup_mail_settings` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `users` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;


-- =============================================================================
-- STEP 3 — system_code on known IDs 5/6/7/8
-- =============================================================================

UPDATE `customers` SET `system_code` = 'EXPENSE'
WHERE `id` = 5 AND `tenant_id` = @t AND (`system_code` IS NULL OR `system_code` = '');

UPDATE `customers` SET `system_code` = 'NET_PURCHASE_RETURN'
WHERE `id` = 6 AND `tenant_id` = @t AND (`system_code` IS NULL OR `system_code` = '');

UPDATE `customers` SET `system_code` = 'NET_PURCHASE'
WHERE `id` = 7 AND `tenant_id` = @t AND (`system_code` IS NULL OR `system_code` = '');

UPDATE `customers` SET `system_code` = 'COUNTER_SALE'
WHERE `id` = 8 AND `tenant_id` = @t AND (`system_code` IS NULL OR `system_code` = '');


-- =============================================================================
-- STEP 4 — Auto-provision + name backfill
-- =============================================================================

INSERT INTO `customers` (`tenant_id`, `customer_name`, `customer_type`, `system_code`, `created_by`, `created_at`, `updated_at`)
SELECT @t, 'EXPENSE', 2, 'EXPENSE', @admin_user_id, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `customers` WHERE `tenant_id` = @t AND `system_code` = 'EXPENSE');

INSERT INTO `customers` (`tenant_id`, `customer_name`, `customer_type`, `system_code`, `created_by`, `created_at`, `updated_at`)
SELECT @t, 'Counter Sale', 2, 'COUNTER_SALE', @admin_user_id, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `customers` WHERE `tenant_id` = @t AND `system_code` = 'COUNTER_SALE');

INSERT INTO `customers` (`tenant_id`, `customer_name`, `customer_type`, `system_code`, `created_by`, `created_at`, `updated_at`)
SELECT @t, 'NET PURCHASE', 1, 'NET_PURCHASE', @admin_user_id, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `customers` WHERE `tenant_id` = @t AND `system_code` = 'NET_PURCHASE');

INSERT INTO `customers` (`tenant_id`, `customer_name`, `customer_type`, `system_code`, `created_by`, `created_at`, `updated_at`)
SELECT @t, 'NET PURCHASE RETURN', 1, 'NET_PURCHASE_RETURN', @admin_user_id, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `customers` WHERE `tenant_id` = @t AND `system_code` = 'NET_PURCHASE_RETURN');

UPDATE `customers` SET `system_code` = 'EXPENSE'
WHERE `tenant_id` = @t AND (`system_code` IS NULL OR `system_code` = '')
  AND UPPER(TRIM(`customer_name`)) = 'EXPENSE';

UPDATE `customers` SET `system_code` = 'COUNTER_SALE'
WHERE `tenant_id` = @t AND (`system_code` IS NULL OR `system_code` = '')
  AND UPPER(TRIM(`customer_name`)) IN ('COUNTER SALE', 'COUNTERSALE');

UPDATE `customers` SET `system_code` = 'NET_PURCHASE'
WHERE `tenant_id` = @t AND (`system_code` IS NULL OR `system_code` = '')
  AND UPPER(TRIM(`customer_name`)) = 'NET PURCHASE';

UPDATE `customers` SET `system_code` = 'NET_PURCHASE_RETURN'
WHERE `tenant_id` = @t AND (`system_code` IS NULL OR `system_code` = '')
  AND UPPER(TRIM(`customer_name`)) = 'NET PURCHASE RETURN';


-- =============================================================================
-- STEP 5 — VERIFY
-- =============================================================================

SELECT 'config tenant (@t)' AS `check`, @t AS `value`
UNION ALL
SELECT 'config admin_user_id', @admin_user_id
UNION ALL
SELECT 'users missing tenant_id', COUNT(*) FROM `users` WHERE `tenant_id` IS NULL
UNION ALL
SELECT 'products missing tenant_id', COUNT(*) FROM `products` WHERE `tenant_id` IS NULL
UNION ALL
SELECT 'customers missing tenant_id', COUNT(*) FROM `customers` WHERE `tenant_id` IS NULL
UNION ALL
SELECT 'sale_invoices missing tenant_id', COUNT(*) FROM `sale_invoices` WHERE `tenant_id` IS NULL
UNION ALL
SELECT 'stock_batches_items missing tenant_id', COUNT(*) FROM `stock_batches_items` WHERE `tenant_id` IS NULL
UNION ALL
SELECT 'system customers for tenant', COUNT(*)
FROM `customers`
WHERE `tenant_id` = @t
  AND `system_code` IN ('EXPENSE','COUNTER_SALE','NET_PURCHASE','NET_PURCHASE_RETURN');

DROP PROCEDURE IF EXISTS `pos_add_column_if_missing`;
DROP PROCEDURE IF EXISTS `pos_add_index_if_missing`;

SET SESSION sql_mode = IFNULL(@pos_old_sql_mode, @@SESSION.sql_mode);
