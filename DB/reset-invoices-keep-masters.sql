-- =============================================================================
-- Reset transactional POS data — KEEP masters
-- KEEP: products, companies, customers (+ users/org/settings)
-- CLEAR: invoices, line items, stock movements, ledgers, transfers
--
-- MySQL / MariaDB (phpMyAdmin / mysql CLI):
--   SOURCE DB/reset-invoices-keep-masters.sql;
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_SAFE_UPDATES = 0;

-- Purchases
TRUNCATE TABLE `purchase_invoices`;
TRUNCATE TABLE `products_purchases`;

-- Sales
TRUNCATE TABLE `sale_invoices`;
TRUNCATE TABLE `products_sales`;

-- Purchase returns (legacy + current names)
TRUNCATE TABLE `purchase_return_invoices`;
TRUNCATE TABLE `return_invoices`;
TRUNCATE TABLE `products_returns`;

-- Sale returns
TRUNCATE TABLE `sale_return_invoices`;
TRUNCATE TABLE `sale_return_products`;

-- Replacements
TRUNCATE TABLE `product_replacment_invoices`;
TRUNCATE TABLE `product_replacements`;

-- Stock layers / movements
TRUNCATE TABLE `stocks`;
TRUNCATE TABLE `vendor_stocks`;
TRUNCATE TABLE `vendor_stock_managment`;
TRUNCATE TABLE `stock_batches_items`;
TRUNCATE TABLE `stock_batch_allocations`;
TRUNCATE TABLE `godowns_stocks`;
TRUNCATE TABLE `stock_transfers`;
TRUNCATE TABLE `stock_transfer_items`;

-- Ledgers / cash movements tied to invoices
TRUNCATE TABLE `customer_ledger`;
TRUNCATE TABLE `vendor_ledger`;
TRUNCATE TABLE `customer_transactions`;
TRUNCATE TABLE `vendor_transactions`;
TRUNCATE TABLE `bulk_transactions`;
TRUNCATE TABLE `installments`;
TRUNCATE TABLE `admin_sale_close`;

SET FOREIGN_KEY_CHECKS = 1;

-- Masters stay; balances/stock counters zeroed
UPDATE `customers` SET `balance` = 0;
UPDATE `products` SET `stock_balance` = 0;

-- Done. products / companies / customers rows are untouched.
