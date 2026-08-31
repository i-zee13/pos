-- =============================================================================
-- Reset transactional POS data — KEEP masters (SQLite / desktop Storeeo POS)
-- KEEP: products, companies, customers (+ users/org/settings)
-- CLEAR: invoices, line items, stock movements, ledgers, transfers
--
-- sqlite3 "%APPDATA%/StoreeoPOS/database/pos-local.sqlite" < DB/reset-invoices-keep-masters-sqlite.sql
-- Or: php desktop/scripts/reset-local-invoices.php
-- =============================================================================

PRAGMA foreign_keys = OFF;

DELETE FROM purchase_invoices;
DELETE FROM products_purchases;

DELETE FROM sale_invoices;
DELETE FROM products_sales;

DELETE FROM purchase_return_invoices;
DELETE FROM return_invoices;
DELETE FROM products_returns;

DELETE FROM sale_return_invoices;
DELETE FROM sale_return_products;

DELETE FROM product_replacment_invoices;
DELETE FROM product_replacements;

DELETE FROM stocks;
DELETE FROM vendor_stocks;
DELETE FROM vendor_stock_managment;
DELETE FROM stock_batches_items;
DELETE FROM stock_batch_allocations;
DELETE FROM godowns_stocks;
DELETE FROM stock_transfers;
DELETE FROM stock_transfer_items;

DELETE FROM customer_ledger;
DELETE FROM vendor_ledger;
DELETE FROM customer_transactions;
DELETE FROM vendor_transactions;
DELETE FROM bulk_transactions;
DELETE FROM installments;
DELETE FROM admin_sale_close;

-- Reset autoincrement counters when table exists in sqlite_sequence
DELETE FROM sqlite_sequence WHERE name IN (
  'purchase_invoices','products_purchases',
  'sale_invoices','products_sales',
  'purchase_return_invoices','return_invoices','products_returns',
  'sale_return_invoices','sale_return_products',
  'product_replacment_invoices','product_replacements',
  'stocks','vendor_stocks','vendor_stock_managment','stock_batches_items',
  'stock_batch_allocations','godowns_stocks','stock_transfers','stock_transfer_items',
  'customer_ledger','vendor_ledger','customer_transactions','vendor_transactions',
  'bulk_transactions','installments','admin_sale_close'
);

UPDATE customers SET balance = 0;
UPDATE products SET stock_balance = 0;

PRAGMA foreign_keys = ON;
