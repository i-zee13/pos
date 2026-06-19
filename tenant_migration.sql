-- =====================================================================
--  MULTI-TENANT MIGRATION (single code + single DB)
--  -------------------------------------------------------------------
--  Pehle poora STEP 1 (ALTER) chalayein, phir poora STEP 2 (UPDATE).
--  Mojooda shop ka saara data tenant_id = 1 set ho jata hai taki
--  pehle se add kiya hua data disturb na ho.
--
--  NOTE: jab tak users.tenant_id set nahi hota, app pehle ki tarah
--        (bina filter ke) chalta rahega. Isliye STEP 2 poora chalayein
--        aur users wali line sab se aakhir mein.
--
--  NAYI / COMPLETE SETUP: setup_tenant_database.sql (top par @t variable)
-- =====================================================================


-- ---------------------------------------------------------------------
-- STEP 1: ADD tenant_id COLUMN (+ index) TO ALL TENANT TABLES
-- ---------------------------------------------------------------------

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
ALTER TABLE `integrations`                ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `integrations_tenant_id_index` (`tenant_id`);

ALTER TABLE `backup_logs`                 ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `backup_logs_tenant_id_index` (`tenant_id`);
ALTER TABLE `user_backup_mail_settings`   ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `user_backup_mail_settings_tenant_id_index` (`tenant_id`);


-- ---------------------------------------------------------------------
-- STEP 1b: GOOGLE DRIVE TOKEN AUTO-RENEW KE LIYE EXTRA COLUMNS
-- ---------------------------------------------------------------------
ALTER TABLE `user_backup_mail_settings`
    ADD COLUMN `google_drive_access_token_encrypted` TEXT NULL AFTER `google_drive_refresh_token_encrypted`,
    ADD COLUMN `google_drive_token_expires_at` TIMESTAMP NULL AFTER `google_drive_access_token_encrypted`;


-- ---------------------------------------------------------------------
-- STEP 2: BACKFILL EXISTING RECORDS  (purana shop = tenant_id 1)
--         Pehle saara data update karein, sab se aakhir mein users.
-- ---------------------------------------------------------------------

UPDATE `products`                    SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `companies`                   SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `customers`                   SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;

UPDATE `purchase_invoices`           SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `products_purchases`          SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `purchase_return_invoices`    SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `products_returns`            SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `return_invoices`             SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;

UPDATE `sale_invoices`               SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `products_sales`              SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `sale_return_invoices`        SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `sale_return_products`        SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;

UPDATE `product_replacment_invoices` SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `product_replacements`        SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;

UPDATE `vendor_stocks`               SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `vendor_stock_managment`      SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `stock_batches_items`         SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `stocks`                      SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;

UPDATE `customer_ledger`             SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `vendor_ledger`               SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;

UPDATE `admin_sale_close`            SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;

UPDATE `organization`                SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `organization_location`       SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `access_rights`               SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;

UPDATE `customer_transactions`       SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `vendor_transactions`         SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `integrations`                SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;

UPDATE `backup_logs`                 SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `user_backup_mail_settings`   SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;

-- SAB SE AAKHIR MEIN: users ko tenant assign karein.
UPDATE `users`                       SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;


-- =====================================================================
-- NAYA TENANT BANANE KA TAREEQA (misal: tenant 2):
--   1) Naya user banayein aur uska tenant_id = 2 set karein, e.g.
--      INSERT INTO users (tenant_id, name, email, password, created_at, updated_at)
--      VALUES (2, 'Shop 2 Admin', 'shop2@example.com', '<bcrypt-hash>', NOW(), NOW());
--   2) Bas. Us user se login karte hi saara naya data automatically
--      tenant_id = 2 ke sath save hoga aur reports/ledgers sirf tenant 2
--      ka data dikhayengi.
-- =====================================================================
