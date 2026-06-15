-- =====================================================================
--  TENANT 2 DATA PURGE (customers + products SKIP)
--  -------------------------------------------------------------------
--  TRUNCATE sirf poori table khali karta hai — tenant filter nahi lagta.
--  Is liye yahan DELETE ... WHERE tenant_id = 2 use kiya gaya hai.
--
--  CHHODI GAYI: customers, products
--  MITAYA JAYEGA: tenant 2 ka baqi saara transactional / config data
--
--  WARNING: Irreversible. Pehle backup lein. Tenant 1 par asar nahi.
-- =====================================================================

SET @t := 2;

SET FOREIGN_KEY_CHECKS = 0;

-- Line items / child rows (pehle)
DELETE FROM `sale_return_products`        WHERE `tenant_id` = @t;
DELETE FROM `products_sales`              WHERE `tenant_id` = @t;
DELETE FROM `products_returns`            WHERE `tenant_id` = @t;
DELETE FROM `products_purchases`          WHERE `tenant_id` = @t;
DELETE FROM `product_replacements`        WHERE `tenant_id` = @t;

DELETE FROM `stock_batches_items`         WHERE `tenant_id` = @t;
DELETE FROM `vendor_stock_managment`      WHERE `tenant_id` = @t;
DELETE FROM `vendor_stocks`               WHERE `tenant_id` = @t;
DELETE FROM `stocks`                      WHERE `tenant_id` = @t;

-- Invoices / headers
DELETE FROM `sale_return_invoices`        WHERE `tenant_id` = @t;
DELETE FROM `sale_invoices`               WHERE `tenant_id` = @t;
DELETE FROM `purchase_return_invoices`    WHERE `tenant_id` = @t;
DELETE FROM `purchase_invoices`           WHERE `tenant_id` = @t;
DELETE FROM `return_invoices`             WHERE `tenant_id` = @t;
DELETE FROM `product_replacment_invoices` WHERE `tenant_id` = @t;

-- Ledgers / transactions
DELETE FROM `customer_ledger`             WHERE `tenant_id` = @t;
DELETE FROM `vendor_ledger`               WHERE `tenant_id` = @t;
DELETE FROM `customer_transactions`       WHERE `tenant_id` = @t;
DELETE FROM `vendor_transactions`         WHERE `tenant_id` = @t;

-- Admin / org / misc
DELETE FROM `admin_sale_close`            WHERE `tenant_id` = @t;
DELETE FROM `organization_location`       WHERE `tenant_id` = @t;
DELETE FROM `organization`                WHERE `tenant_id` = @t;
DELETE FROM `access_rights`               WHERE `tenant_id` = @t;
DELETE FROM `integrations`                WHERE `tenant_id` = @t;
DELETE FROM `backup_logs`                 WHERE `tenant_id` = @t;
DELETE FROM `user_backup_mail_settings`   WHERE `tenant_id` = @t;

-- Master (products/customers ke ilawa)
DELETE FROM `companies`                   WHERE `tenant_id` = @t;

-- Users (tenant 2 ke login accounts — agar rakhne hon to is line ko comment karein)
DELETE FROM `users`                       WHERE `tenant_id` = @t;

SET FOREIGN_KEY_CHECKS = 1;

-- Customers reh gaye — ledger delete ke baad balance zero kar dein
UPDATE `customers` SET `balance` = 0 WHERE `tenant_id` = @t;

-- Products reh gaye — stock/invoices delete ho chuki hain
-- Agar products ka koi extra balance/qty column ho to alag se check karein.

-- =====================================================================
--  SKIP (jaisa aap ne kaha):
--    customers  — DELETE nahi
--    products   — DELETE nahi
-- =====================================================================
