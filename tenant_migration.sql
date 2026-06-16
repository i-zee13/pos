-- =====================================================================
--  MULTI-TENANT MIGRATION (single code + single DB) — GODOWNS BRANCH
--  -------------------------------------------------------------------
--  Pehle poora STEP 1 (ALTER), phir poora STEP 2 (UPDATE).
--  Mojooda live shop = tenant_id 1. Jab tak users.tenant_id set nahi,
--  app pehle ki tarah (bina filter) chalti rahegi.
-- =====================================================================

-- STEP 1: ADD tenant_id (+ index)
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

-- Godowns branch tables
ALTER TABLE `godowns`                     ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `godowns_tenant_id_index` (`tenant_id`);
ALTER TABLE `godowns_stocks`              ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `godowns_stocks_tenant_id_index` (`tenant_id`);
ALTER TABLE `stock_transfers`             ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `stock_transfers_tenant_id_index` (`tenant_id`);
ALTER TABLE `stock_transfer_items`        ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `stock_transfer_items_tenant_id_index` (`tenant_id`);


-- STEP 2: BACKFILL tenant_id = 1 (existing live data)
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

UPDATE `godowns`                     SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `godowns_stocks`              SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `stock_transfers`             SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `stock_transfer_items`        SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;

-- SAB SE AAKHIR: users
UPDATE `users`                       SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
