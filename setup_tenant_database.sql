-- =====================================================================
--  POS — TENANT DATABASE SETUP (single DB, multi-tenant)
--  -------------------------------------------------------------------
--  Kab chalayein:
--    • Purani DB jis mein tenant_id / system_code waghera nahi
--    • Nayi DB par pehli dafa tenant-based code deploy karne se pehle
--
--  Kaise chalayein (phpMyAdmin / MySQL client):
--    1) Neeche sirf @t (aur zarurat ho to @admin_user_id) change karein
--    2) Poora file order se ek martaba run karein
--    3) Agar koi ALTER "Duplicate column" de — us line skip karein (pehle se mojood)
--    4) Last mein VERIFY queries check karein (0 hona chahiye jahan likha hai)
--
--  Zaroori:
--    • STEP 2 (backfill) poora chalayein — users sab se aakhir mein
--    • Jab tak users.tenant_id NULL hai, app bina tenant filter ke chalti hai
--    • System customers: STEP 4 auto-create karta hai; legacy IDs optional hain
-- =====================================================================


-- =============================================================================
-- CONFIG — yahan sirf values change karein
-- =============================================================================
SET @t := 1;                 -- mojooda / default tenant (saara purana data is par)
SET @admin_user_id := 1;     -- pehla admin user id (system customers ke created_by ke liye)

-- OPTIONAL: agar tenant @t ke system customers ki IDs pehle se pata hon (legacy shop)
--           to uncomment karke set karein; warna STEP 4 khud INSERT karega
-- SET @sys_expense_id             := 5;
-- SET @sys_net_purchase_return_id := 6;
-- SET @sys_net_purchase_id        := 7;
-- SET @sys_counter_sale_id        := 8;


-- =============================================================================
-- STEP 0 — Backup module tables (agar abhi DB mein nahi)
--         Agar pehle se hain to CREATE skip ho jayega; phir STEP 1 ALTER chalega
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


-- =============================================================================
-- STEP 1 — tenant_id column + index (har tenant-scoped table par)
-- =============================================================================

ALTER TABLE `users`                       ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `users_tenant_id_index` (`tenant_id`);

ALTER TABLE `products`                    ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `products_tenant_id_index` (`tenant_id`);
ALTER TABLE `companies`                   ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `companies_tenant_id_index` (`tenant_id`);
ALTER TABLE `customers`                   ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `customers_tenant_id_index` (`tenant_id`);

ALTER TABLE `purchase_invoices`           ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `purchase_invoices_tenant_id_index` (`tenant_id`);
ALTER TABLE `products_purchases`          ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `products_purchases_tenant_id_index` (`tenant_id`);
ALTER TABLE `purchase_return_invoices`    ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `purchase_return_invoices_tenant_id_index` (`tenant_id`);
ALTER TABLE `products_returns`            ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `products_returns_tenant_id_index` (`tenant_id`);
ALTER TABLE `return_invoices`             ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `return_invoices_tenant_id_index` (`tenant_id`);

ALTER TABLE `sale_invoices`               ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `sale_invoices_tenant_id_index` (`tenant_id`);
ALTER TABLE `products_sales`              ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `products_sales_tenant_id_index` (`tenant_id`);
ALTER TABLE `sale_return_invoices`        ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `sale_return_invoices_tenant_id_index` (`tenant_id`);
ALTER TABLE `sale_return_products`        ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `sale_return_products_tenant_id_index` (`tenant_id`);

ALTER TABLE `product_replacment_invoices` ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `product_replacment_invoices_tenant_id_index` (`tenant_id`);
ALTER TABLE `product_replacements`        ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `product_replacements_tenant_id_index` (`tenant_id`);

ALTER TABLE `vendor_stocks`               ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `vendor_stocks_tenant_id_index` (`tenant_id`);
ALTER TABLE `vendor_stock_managment`      ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `vendor_stock_managment_tenant_id_index` (`tenant_id`);
ALTER TABLE `stock_batches_items`         ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `stock_batches_items_tenant_id_index` (`tenant_id`);
ALTER TABLE `stocks`                      ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `stocks_tenant_id_index` (`tenant_id`);

ALTER TABLE `customer_ledger`             ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `customer_ledger_tenant_id_index` (`tenant_id`);
ALTER TABLE `vendor_ledger`               ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `vendor_ledger_tenant_id_index` (`tenant_id`);

ALTER TABLE `admin_sale_close`            ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `admin_sale_close_tenant_id_index` (`tenant_id`);

ALTER TABLE `organization`                ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `organization_tenant_id_index` (`tenant_id`);
ALTER TABLE `organization_location`       ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `organization_location_tenant_id_index` (`tenant_id`);
ALTER TABLE `access_rights`               ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `access_rights_tenant_id_index` (`tenant_id`);

ALTER TABLE `customer_transactions`       ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `customer_transactions_tenant_id_index` (`tenant_id`);
ALTER TABLE `vendor_transactions`         ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `vendor_transactions_tenant_id_index` (`tenant_id`);

-- integrations table kuch purani DBs mein nahi — error aaye to is ALTER ko skip karein
ALTER TABLE `integrations`                ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `integrations_tenant_id_index` (`tenant_id`);

ALTER TABLE `backup_logs`                 ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `backup_logs_tenant_id_index` (`tenant_id`);
ALTER TABLE `user_backup_mail_settings`   ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `user_backup_mail_settings_tenant_id_index` (`tenant_id`);


-- =============================================================================
-- STEP 1b — Feature columns (tenant ke ilawa jo code expect karta hai)
--           Duplicate column error = pehle se mojood, skip karein
-- =============================================================================

-- System customers: code se resolve (sys_customer_id helper)
ALTER TABLE `customers`
  ADD COLUMN `system_code` VARCHAR(50) NULL AFTER `customer_type`,
  ADD INDEX `customers_system_code_index` (`system_code`);

-- Organization > Print Section (invoice logo / refund policy)
ALTER TABLE `organization`
  ADD COLUMN `print_logo`    VARCHAR(255) NULL AFTER `logo_img`,
  ADD COLUMN `refund_policy` TEXT         NULL AFTER `print_logo`;

-- Google Drive token auto-refresh (backup module)
-- Agar refresh_token column nahi: pehle yeh line chalayein, phir baqi
-- ALTER TABLE `user_backup_mail_settings` ADD COLUMN `google_drive_refresh_token_encrypted` TEXT NULL AFTER `app_password_encrypted`;

ALTER TABLE `user_backup_mail_settings`
  ADD COLUMN `google_drive_access_token_encrypted` TEXT NULL AFTER `google_drive_refresh_token_encrypted`,
  ADD COLUMN `google_drive_token_expires_at` TIMESTAMP NULL AFTER `google_drive_access_token_encrypted`;

ALTER TABLE `user_backup_mail_settings`
  ADD COLUMN `google_drive_folder_id` VARCHAR(255) NULL AFTER `google_drive_token_expires_at`,
  ADD COLUMN `google_drive_folder_name` VARCHAR(255) NULL AFTER `google_drive_folder_id`,
  ADD COLUMN `google_drive_connected_at` TIMESTAMP NULL AFTER `google_drive_folder_name`;


-- =============================================================================
-- STEP 2 — BACKFILL: saara mojooda data @t par
--           Pehle business tables, users sab se aakhir mein
-- =============================================================================

UPDATE `products`                    SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `companies`                   SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `customers`                   SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `purchase_invoices`           SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `products_purchases`          SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `purchase_return_invoices`    SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `products_returns`            SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `return_invoices`             SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `sale_invoices`               SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `products_sales`              SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `sale_return_invoices`        SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `sale_return_products`        SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `product_replacment_invoices` SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `product_replacements`        SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `vendor_stocks`               SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `vendor_stock_managment`      SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `stock_batches_items`         SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `stocks`                      SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `customer_ledger`             SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `vendor_ledger`               SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `admin_sale_close`            SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `organization`                SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `organization_location`       SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `access_rights`               SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `customer_transactions`       SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `vendor_transactions`         SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

-- integrations table ho to:
UPDATE `integrations`                SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

UPDATE `backup_logs`                 SET `tenant_id` = @t WHERE `tenant_id` IS NULL;
UPDATE `user_backup_mail_settings`   SET `tenant_id` = @t WHERE `tenant_id` IS NULL;

-- SAB SE AAKHIR: login user ko tenant assign — iske baad app tenant filter ON
UPDATE `users`                       SET `tenant_id` = @t WHERE `tenant_id` IS NULL;


-- =============================================================================
-- STEP 3 — OPTIONAL legacy system_code by known customer IDs
--          Sirf tab jab upar @sys_* variables set kiye hon
-- =============================================================================

-- UPDATE `customers` SET `system_code` = 'EXPENSE'              WHERE `id` = @sys_expense_id             AND `tenant_id` = @t;
-- UPDATE `customers` SET `system_code` = 'NET_PURCHASE_RETURN'  WHERE `id` = @sys_net_purchase_return_id AND `tenant_id` = @t;
-- UPDATE `customers` SET `system_code` = 'NET_PURCHASE'         WHERE `id` = @sys_net_purchase_id        AND `tenant_id` = @t;
-- UPDATE `customers` SET `system_code` = 'COUNTER_SALE'         WHERE `id` = @sys_counter_sale_id        AND `tenant_id` = @t;


-- =============================================================================
-- STEP 4 — System customers auto-provision (har tenant ke 4 accounts)
--          Jo pehle se system_code ke sath mojood hon unhe chhedta nahi
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

-- Agar purane customers same naam se hain lekin system_code khali:
UPDATE `customers` SET `system_code` = 'EXPENSE'
WHERE `tenant_id` = @t AND `system_code` IS NULL AND UPPER(TRIM(`customer_name`)) = 'EXPENSE';

UPDATE `customers` SET `system_code` = 'COUNTER_SALE'
WHERE `tenant_id` = @t AND `system_code` IS NULL AND UPPER(TRIM(`customer_name`)) IN ('COUNTER SALE', 'COUNTERSALE');

UPDATE `customers` SET `system_code` = 'NET_PURCHASE'
WHERE `tenant_id` = @t AND `system_code` IS NULL AND UPPER(TRIM(`customer_name`)) = 'NET PURCHASE';

UPDATE `customers` SET `system_code` = 'NET_PURCHASE_RETURN'
WHERE `tenant_id` = @t AND `system_code` IS NULL AND UPPER(TRIM(`customer_name`)) = 'NET PURCHASE RETURN';


-- =============================================================================
-- STEP 5 — VERIFY (ideal: missing_tenant = 0)
-- =============================================================================

SELECT 'users missing tenant_id' AS `check`, COUNT(*) AS `missing`
FROM `users` WHERE `tenant_id` IS NULL
UNION ALL
SELECT 'products missing tenant_id', COUNT(*) FROM `products` WHERE `tenant_id` IS NULL
UNION ALL
SELECT 'customers missing tenant_id', COUNT(*) FROM `customers` WHERE `tenant_id` IS NULL
UNION ALL
SELECT 'sale_invoices missing tenant_id', COUNT(*) FROM `sale_invoices` WHERE `tenant_id` IS NULL
UNION ALL
SELECT 'system customers for tenant @t', COUNT(*)
FROM `customers` WHERE `tenant_id` = @t AND `system_code` IN ('EXPENSE','COUNTER_SALE','NET_PURCHASE','NET_PURCHASE_RETURN');


-- =============================================================================
-- NAYA TENANT (misal: tenant 2) — alag script / manual
-- =============================================================================
--   SET @t := 2;
--   SET @admin_user_id := <naya user ki id>;
--
--   INSERT INTO `users` (`tenant_id`, `name`, `email`, `password`, `created_at`, `updated_at`)
--   VALUES (@t, 'Shop 2 Admin', 'shop2@example.com', '<bcrypt-hash>', NOW(), NOW());
--   SET @admin_user_id := LAST_INSERT_ID();
--
--   Phir sirf STEP 4 (system customers INSERT) dubara @t = 2 ke sath chalayein,
--   ya login ke baad browser se:  /seed-system-customers
--
--   Tenant 2 ka data hataane ke liye (optional): tenant_2_purge.sql
-- =====================================================================
