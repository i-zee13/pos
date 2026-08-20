-- =====================================================================
--  POS — performance indexes (idempotent)
--  Speeds sale save / stock latest-balance / isEditable / ledger lookups.
--  Does NOT change data or application behaviour.
--
--  Run:
--    mysql -u USER -p DB < scripts/server-dropins/add_performance_indexes.sql
--  Or after deploy:
--    php artisan migrate --force
-- =====================================================================

DROP PROCEDURE IF EXISTS `pos_add_index_if_missing`;

DELIMITER $$

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
    -- Skip if any listed column is missing (older schemas).
    SET @pos_missing := (
      SELECT COUNT(*) FROM (
        SELECT TRIM(BOTH '`' FROM SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(p_columns, ' ', ''), ',', n.n), ',', -1)) AS col
        FROM (
          SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
        ) n
        WHERE n.n <= 1 + LENGTH(p_columns) - LENGTH(REPLACE(p_columns, ',', ''))
      ) cols
      WHERE col <> ''
        AND NOT EXISTS (
          SELECT 1 FROM information_schema.COLUMNS c
          WHERE c.TABLE_SCHEMA = DATABASE()
            AND c.TABLE_NAME = p_table
            AND c.COLUMN_NAME = cols.col
        )
    );
    IF @pos_missing = 0 THEN
      SET @pos_sql := CONCAT(
        'ALTER TABLE `', p_table, '` ADD INDEX `', p_index, '` (', p_columns, ')'
      );
      PREPARE pos_stmt FROM @pos_sql;
      EXECUTE pos_stmt;
      DEALLOCATE PREPARE pos_stmt;
    END IF;
  END IF;
END$$

DELIMITER ;

CALL pos_add_index_if_missing('vendor_stocks', 'vendor_stocks_tenant_product_id_index', '`tenant_id`,`product_id`,`id`');
CALL pos_add_index_if_missing('vendor_stocks', 'vendor_stocks_product_id_id_index', '`product_id`,`id`');
CALL pos_add_index_if_missing('vendor_stocks', 'vendor_stocks_sale_invoice_product_index', '`sale_invoice_id`,`product_id`');

CALL pos_add_index_if_missing('customer_ledger', 'customer_ledger_tenant_customer_id_index', '`tenant_id`,`customer_id`,`id`');
CALL pos_add_index_if_missing('customer_ledger', 'customer_ledger_customer_id_id_index', '`customer_id`,`id`');
CALL pos_add_index_if_missing('customer_ledger', 'customer_ledger_sale_invoice_id_index', '`sale_invoice_id`');
CALL pos_add_index_if_missing('customer_ledger', 'customer_ledger_tenant_customer_editable_index', '`tenant_id`,`customer_id`,`is_editable`');

CALL pos_add_index_if_missing('vendor_ledger', 'vendor_ledger_tenant_customer_editable_index', '`tenant_id`,`customer_id`,`is_editable`');
CALL pos_add_index_if_missing('vendor_ledger', 'vendor_ledger_customer_editable_index', '`customer_id`,`is_editable`');

CALL pos_add_index_if_missing('sale_invoices', 'sale_invoices_tenant_date_index', '`tenant_id`,`date`');
CALL pos_add_index_if_missing('sale_invoices', 'sale_invoices_date_index', '`date`');
CALL pos_add_index_if_missing('sale_invoices', 'sale_invoices_tenant_customer_editable_index', '`tenant_id`,`customer_id`,`is_editable`');
CALL pos_add_index_if_missing('sale_invoices', 'sale_invoices_customer_editable_index', '`customer_id`,`is_editable`');

CALL pos_add_index_if_missing('sale_return_invoices', 'sale_return_invoices_tenant_customer_editable_index', '`tenant_id`,`customer_id`,`is_editable`');
CALL pos_add_index_if_missing('sale_return_invoices', 'sale_return_invoices_customer_editable_index', '`customer_id`,`is_editable`');
CALL pos_add_index_if_missing('purchase_invoices', 'purchase_invoices_tenant_customer_editable_index', '`tenant_id`,`customer_id`,`is_editable`');
CALL pos_add_index_if_missing('purchase_invoices', 'purchase_invoices_customer_editable_index', '`customer_id`,`is_editable`');
CALL pos_add_index_if_missing('purchase_return_invoices', 'purchase_return_invoices_tenant_customer_editable_index', '`tenant_id`,`customer_id`,`is_editable`');
CALL pos_add_index_if_missing('purchase_return_invoices', 'purchase_return_invoices_customer_editable_index', '`customer_id`,`is_editable`');
CALL pos_add_index_if_missing('product_replacment_invoices', 'product_replacment_invoices_tenant_customer_editable_index', '`tenant_id`,`customer_id`,`is_editable`');
CALL pos_add_index_if_missing('product_replacment_invoices', 'product_replacment_invoices_customer_editable_index', '`customer_id`,`is_editable`');

CALL pos_add_index_if_missing('products_sales', 'products_sales_sale_invoice_id_index', '`sale_invoice_id`');
CALL pos_add_index_if_missing('stock_batches_items', 'stock_batches_items_tenant_product_company_expiry_index', '`tenant_id`,`product_id`,`company_id`,`expiry_date`');
CALL pos_add_index_if_missing('stock_batches_items', 'stock_batches_items_product_expiry_index', '`product_id`,`expiry_date`');

DROP PROCEDURE IF EXISTS `pos_add_index_if_missing`;

SELECT 'performance indexes applied (missing ones only)' AS pos_status;
