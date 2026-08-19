-- Storeeo POS — SQLite bootstrap (schema + minimal local seed)
-- Source: pos_before_batch_browser_test_20260723_012306.sql
PRAGMA foreign_keys = OFF;
BEGIN;

-- table: organization
CREATE TABLE IF NOT EXISTS "organization" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "name" TEXT NOT NULL,
  "phone_number" TEXT NOT NULL,
  "whatsapp_no" TEXT DEFAULT NULL,
  "email" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city_id" INTEGER NOT NULL,
  "postal_code_id" INTEGER NOT NULL,
  "state_id" INTEGER NOT NULL,
  "country_id" INTEGER NOT NULL,
  "logo_img" TEXT NOT NULL,
  "fb_link" TEXT,
  "insta_link" TEXT,
  "linkedin_link" TEXT,
  "youtube_link" TEXT,
  "twitter_link" TEXT,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER NOT NULL,
  "updated_at" TEXT NOT NULL
);

-- table: users
CREATE TABLE IF NOT EXISTS "users" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "name" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "email" TEXT DEFAULT NULL,
  "phone" TEXT DEFAULT NULL,
  "sin" TEXT DEFAULT NULL,
  "city" TEXT DEFAULT NULL,
  "state" TEXT DEFAULT NULL,
  "country" TEXT NOT NULL DEFAULT '0',
  "address" TEXT DEFAULT NULL,
  "designation" TEXT DEFAULT NULL,
  "hiring" TEXT DEFAULT NULL,
  "salary" INTEGER DEFAULT NULL,
  "reporting_to" INTEGER NOT NULL DEFAULT '0',
  "department_id" INTEGER NOT NULL DEFAULT '0',
  "password" TEXT NOT NULL,
  "picture" TEXT,
  "remember_token" TEXT DEFAULT NULL,
  "super" INTEGER NOT NULL DEFAULT '0',
  "active" INTEGER NOT NULL DEFAULT '1',
  "device_id" TEXT DEFAULT NULL,
  "device_model" TEXT DEFAULT NULL,
  "app_version" TEXT DEFAULT NULL,
  "password_changed" INTEGER NOT NULL DEFAULT '0',
  "force_logout" INTEGER NOT NULL DEFAULT '0',
  "created_at" TEXT DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL,
  "created_by" INTEGER DEFAULT NULL,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: migrations
CREATE TABLE IF NOT EXISTS "migrations" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "migration" TEXT NOT NULL,
  "batch" INTEGER NOT NULL
);

-- table: postal_codes
CREATE TABLE IF NOT EXISTS "postal_codes" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "country_id" INTEGER DEFAULT NULL,
  "state_id" INTEGER DEFAULT NULL,
  "city_id" INTEGER DEFAULT NULL,
  "postal_code" TEXT DEFAULT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT NOT NULL,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: access_rights
CREATE TABLE IF NOT EXISTS "access_rights" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "employee_id" INTEGER NOT NULL,
  "controller_right" TEXT NOT NULL
);

-- table: admin_sale_close
CREATE TABLE IF NOT EXISTS "admin_sale_close" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "closing_date" TEXT NOT NULL,
  "cash_in_hand" REAL NOT NULL,
  "closing_cash" REAL NOT NULL,
  "comment" TEXT,
  "is_closed" INTEGER NOT NULL DEFAULT '1',
  "open_by" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: backup_logs
CREATE TABLE IF NOT EXISTS "backup_logs" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "user_id" INTEGER DEFAULT NULL,
  "zip_filename" TEXT DEFAULT NULL,
  "local_relative_path" TEXT DEFAULT NULL,
  "databases" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "size_bytes" INTEGER DEFAULT NULL,
  "gdrive_uploaded" INTEGER NOT NULL DEFAULT '0',
  "gdrive_remote_path" TEXT DEFAULT NULL,
  "error_message" TEXT,
  "triggered_by" TEXT NOT NULL DEFAULT 'manual',
  "created_at" TEXT DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL,
  "completed_at" TEXT DEFAULT NULL
);

-- table: bulk_transactions
CREATE TABLE IF NOT EXISTS "bulk_transactions" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "customer_id" INTEGER NOT NULL,
  "receiving_amount" REAL DEFAULT '0',
  "balance" REAL NOT NULL DEFAULT '0',
  "date" TEXT DEFAULT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" INTEGER NOT NULL,
  "updated_at" TEXT,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: cities
CREATE TABLE IF NOT EXISTS "cities" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "state_id" INTEGER NOT NULL,
  "country_id" INTEGER NOT NULL,
  "postal_code" TEXT DEFAULT NULL,
  "is_footer_menu" INTEGER NOT NULL DEFAULT '0',
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT NOT NULL,
  "created_by" INTEGER DEFAULT NULL,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: companies
CREATE TABLE IF NOT EXISTS "companies" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "company_name" TEXT NOT NULL,
  "company_icon" TEXT,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" INTEGER NOT NULL,
  "updated_at" TEXT NOT NULL,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: countries
CREATE TABLE IF NOT EXISTS "countries" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "iso" TEXT NOT NULL,
  "default_status" INTEGER NOT NULL DEFAULT '0',
  "phonecode" TEXT DEFAULT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT NOT NULL,
  "created_by" INTEGER DEFAULT NULL,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: customer_ledger
CREATE TABLE IF NOT EXISTS "customer_ledger" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "sale_invoice_id" INTEGER NOT NULL,
  "return_invoice_id" INTEGER DEFAULT NULL,
  "sale_return_invoice_id" INTEGER DEFAULT NULL,
  "product_replacement_invoice_id" INTEGER DEFAULT NULL,
  "customer_id" INTEGER NOT NULL,
  "cpv_no" TEXT,
  "crv_no" TEXT,
  "cr" REAL DEFAULT '0',
  "dr" REAL DEFAULT '0',
  "balance" REAL NOT NULL DEFAULT '0',
  "trx_type" INTEGER DEFAULT '0',
  "comment" TEXT,
  "is_editable" INTEGER NOT NULL,
  "is_deleted" INTEGER NOT NULL DEFAULT '0',
  "date" TEXT DEFAULT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" INTEGER NOT NULL,
  "updated_at" TEXT,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: customer_transactions
CREATE TABLE IF NOT EXISTS "customer_transactions" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "client_id" INTEGER NOT NULL,
  "debit" REAL DEFAULT NULL,
  "credit" REAL DEFAULT NULL,
  "remarks" TEXT,
  "created_at" TEXT DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: customers
CREATE TABLE IF NOT EXISTS "customers" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "customer_name" TEXT NOT NULL,
  "whatsapp_no" TEXT DEFAULT NULL,
  "cnic_no" TEXT DEFAULT NULL,
  "address" TEXT,
  "phone_no" TEXT DEFAULT NULL,
  "customer_type" INTEGER NOT NULL,
  "balance" REAL DEFAULT '0',
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" INTEGER NOT NULL,
  "updated_at" TEXT NOT NULL,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: designations
CREATE TABLE IF NOT EXISTS "designations" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "designation" TEXT DEFAULT NULL,
  "designation_rights" TEXT,
  "pnl_access" INTEGER NOT NULL DEFAULT '0',
  "reporting_to" INTEGER DEFAULT NULL,
  "created_at" TEXT NOT NULL,
  "created_by" INTEGER NOT NULL,
  "updated_at" TEXT DEFAULT NULL,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: failed_jobs
CREATE TABLE IF NOT EXISTS "failed_jobs" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "uuid" TEXT NOT NULL,
  "connection" TEXT NOT NULL,
  "queue" TEXT NOT NULL,
  "payload" TEXT NOT NULL,
  "exception" TEXT NOT NULL,
  "failed_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- table: godowns
CREATE TABLE IF NOT EXISTS "godowns" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "code" TEXT DEFAULT NULL,
  "type" TEXT NOT NULL DEFAULT 'shop',
  "is_active" INTEGER NOT NULL DEFAULT '1',
  "created_at" TEXT DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: godowns_stocks
CREATE TABLE IF NOT EXISTS "godowns_stocks" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "godown_id" INTEGER NOT NULL,
  "company_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "stock" REAL NOT NULL DEFAULT '0.00',
  "created_at" TEXT DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: installments
CREATE TABLE IF NOT EXISTS "installments" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "sale_invoice_id" INTEGER NOT NULL,
  "installment_month" INTEGER DEFAULT NULL,
  "customer_id" INTEGER NOT NULL,
  "amount" TEXT NOT NULL,
  "balance" REAL NOT NULL DEFAULT '0',
  "comment" TEXT,
  "is_editable" INTEGER NOT NULL,
  "date" TEXT DEFAULT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" INTEGER NOT NULL,
  "updated_at" TEXT,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: integrations
CREATE TABLE IF NOT EXISTS "integrations" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "label" TEXT NOT NULL,
  "section" TEXT DEFAULT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "mode" TEXT DEFAULT NULL,
  "setting" TEXT NOT NULL,
  "icon" TEXT DEFAULT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL,
  "updated_by" INTEGER NOT NULL,
  "updated_at" TEXT NOT NULL
);

-- table: jobs
CREATE TABLE IF NOT EXISTS "jobs" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "queue" TEXT NOT NULL,
  "payload" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL,
  "reserved_at" INTEGER DEFAULT NULL,
  "available_at" INTEGER NOT NULL,
  "created_at" INTEGER NOT NULL
);

-- table: organization_location
CREATE TABLE IF NOT EXISTS "organization_location" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "location_name" TEXT NOT NULL,
  "phone_no" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "country_id" INTEGER NOT NULL,
  "state_id" INTEGER NOT NULL,
  "city_id" INTEGER NOT NULL,
  "postal_code_id" INTEGER NOT NULL,
  "latitude" TEXT NOT NULL,
  "longitude" TEXT NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" INTEGER NOT NULL,
  "updated_at" TEXT NOT NULL,
  "updated_by" INTEGER NOT NULL
);

-- table: password_resets
CREATE TABLE IF NOT EXISTS "password_resets" (
  "email" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "created_at" TEXT DEFAULT NULL
);

-- table: personal_access_tokens
CREATE TABLE IF NOT EXISTS "personal_access_tokens" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tokenable_type" TEXT NOT NULL,
  "tokenable_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "abilities" TEXT,
  "last_used_at" TEXT DEFAULT NULL,
  "created_at" TEXT DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: product_replacements
CREATE TABLE IF NOT EXISTS "product_replacements" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "invoice_no" TEXT NOT NULL,
  "product_replacement_invoice_id" INTEGER NOT NULL,
  "company_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "purchase_price" REAL NOT NULL,
  "sale_price" REAL NOT NULL,
  "expiry_date" TEXT DEFAULT NULL,
  "qty" REAL NOT NULL,
  "product_discount" REAL DEFAULT NULL,
  "sale_total_amount" REAL NOT NULL,
  "product_type" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT,
  "deleted_at" TEXT DEFAULT NULL,
  "deleted_by" INTEGER DEFAULT NULL
);

-- table: product_replacment_invoices
CREATE TABLE IF NOT EXISTS "product_replacment_invoices" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "date" TEXT DEFAULT NULL,
  "invoice_no" TEXT NOT NULL,
  "invoice_type" INTEGER NOT NULL,
  "customer_id" INTEGER NOT NULL,
  "description" TEXT,
  "total_invoice_amount" REAL NOT NULL,
  "invoice_remaining_amount_after_pay" REAL NOT NULL,
  "product_net_total" REAL NOT NULL,
  "product_return_total" REAL NOT NULL,
  "previous_receivable" REAL DEFAULT '0',
  "paid_amount" REAL DEFAULT '0',
  "amount_received" REAL DEFAULT NULL,
  "cash_return" REAL DEFAULT NULL,
  "invoice_discount" REAL DEFAULT NULL,
  "service_charges" REAL DEFAULT NULL,
  "status" INTEGER NOT NULL,
  "is_editable" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT,
  "deleted_at" TEXT DEFAULT NULL,
  "deleted_by" INTEGER DEFAULT NULL
);

-- table: products
CREATE TABLE IF NOT EXISTS "products" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "company_id" INTEGER NOT NULL,
  "product_name" TEXT NOT NULL,
  "product_icon" TEXT,
  "barcode" TEXT NOT NULL,
  "size" TEXT DEFAULT NULL,
  "old_purchase_price" REAL NOT NULL,
  "new_purchase_price" REAL DEFAULT NULL,
  "sale_price" REAL NOT NULL,
  "expiry_date" TEXT DEFAULT NULL,
  "stock_balance" REAL NOT NULL DEFAULT 0,
  "deleted_at" TEXT DEFAULT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" INTEGER NOT NULL,
  "updated_at" TEXT NOT NULL,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: products_purchases
CREATE TABLE IF NOT EXISTS "products_purchases" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "vendor_id" INTEGER NOT NULL,
  "purchase_invoice_id" INTEGER NOT NULL,
  "company_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "purchase_price" REAL NOT NULL,
  "sale_price" REAL DEFAULT NULL,
  "expiry_date" TEXT DEFAULT NULL,
  "qty" REAL NOT NULL,
  "return_qty" REAL NOT NULL DEFAULT '0',
  "qty_after_return" REAL NOT NULL DEFAULT '0',
  "purchased_total_amount" REAL NOT NULL,
  "product_discount" REAL DEFAULT NULL,
  "is_editable" INTEGER DEFAULT '0',
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT,
  "deleted_at" TEXT DEFAULT NULL,
  "deleted_by" INTEGER DEFAULT NULL
);

-- table: products_returns
CREATE TABLE IF NOT EXISTS "products_returns" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "vendor_id" INTEGER NOT NULL,
  "purchase_return_invoice_id" INTEGER NOT NULL,
  "company_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "purchase_price" REAL NOT NULL,
  "sale_price" REAL DEFAULT NULL,
  "expiry_date" TEXT DEFAULT NULL,
  "qty" REAL NOT NULL,
  "return_qty" REAL NOT NULL DEFAULT '0',
  "qty_after_return" REAL NOT NULL DEFAULT '0',
  "product_return_total_amount" REAL NOT NULL,
  "product_discount" REAL DEFAULT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT,
  "deleted_at" TEXT DEFAULT NULL,
  "deleted_by" INTEGER DEFAULT NULL
);

-- table: products_sales
CREATE TABLE IF NOT EXISTS "products_sales" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "invoice_no" TEXT NOT NULL,
  "sale_invoice_id" INTEGER NOT NULL,
  "company_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "purchase_price" REAL NOT NULL,
  "sale_price" REAL NOT NULL,
  "expiry_date" TEXT DEFAULT NULL,
  "qty" REAL NOT NULL,
  "product_discount" REAL DEFAULT NULL,
  "sale_total_amount" REAL NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT,
  "deleted_at" TEXT DEFAULT NULL,
  "deleted_by" INTEGER DEFAULT NULL
);

-- table: purchase_invoices
CREATE TABLE IF NOT EXISTS "purchase_invoices" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "date" TEXT DEFAULT NULL,
  "invoice_type" INTEGER NOT NULL,
  "invoice_no" TEXT NOT NULL,
  "customer_id" INTEGER NOT NULL,
  "previous_receivable" REAL DEFAULT NULL,
  "total_invoice_amount" REAL NOT NULL,
  "invoice_discount" REAL DEFAULT NULL,
  "is_editable" INTEGER,
  "paid_amount" REAL DEFAULT '0',
  "cash_return" REAL DEFAULT NULL,
  "service_charges" REAL DEFAULT NULL,
  "invoice_remaining_amount_after_pay" REAL NOT NULL,
  "product_net_total" REAL NOT NULL,
  "description" TEXT,
  "status" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT,
  "deleted_at" TEXT DEFAULT NULL,
  "deleted_by" INTEGER DEFAULT NULL
);

-- table: purchase_return_invoices
CREATE TABLE IF NOT EXISTS "purchase_return_invoices" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "date" TEXT DEFAULT NULL,
  "invoice_type" INTEGER NOT NULL,
  "invoice_no" TEXT NOT NULL,
  "customer_id" INTEGER NOT NULL,
  "previous_receivable" REAL DEFAULT NULL,
  "total_invoice_amount" REAL NOT NULL,
  "invoice_discount" REAL DEFAULT NULL,
  "is_editable" INTEGER,
  "paid_amount" REAL DEFAULT '0',
  "cash_return" REAL DEFAULT NULL,
  "service_charges" REAL DEFAULT NULL,
  "invoice_remaining_amount_after_pay" REAL NOT NULL,
  "product_net_total" REAL NOT NULL,
  "description" TEXT,
  "status" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT,
  "deleted_at" TEXT DEFAULT NULL,
  "deleted_by" INTEGER DEFAULT NULL
);

-- table: return_invoices
CREATE TABLE IF NOT EXISTS "return_invoices" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "date" TEXT DEFAULT NULL,
  "invoice_no" TEXT NOT NULL,
  "customer_id" INTEGER NOT NULL,
  "total_invoice_amount" REAL NOT NULL,
  "is_editable" INTEGER,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT
);

-- table: sale_invoices
CREATE TABLE IF NOT EXISTS "sale_invoices" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "date" TEXT DEFAULT NULL,
  "invoice_no" TEXT NOT NULL,
  "invoice_type" INTEGER NOT NULL,
  "customer_id" INTEGER NOT NULL,
  "description" TEXT,
  "total_invoice_amount" REAL NOT NULL,
  "invoice_remaining_amount_after_pay" REAL NOT NULL,
  "product_net_total" REAL NOT NULL,
  "previous_receivable" REAL DEFAULT '0',
  "paid_amount" REAL DEFAULT '0',
  "amount_received" REAL DEFAULT NULL,
  "cash_return" REAL DEFAULT NULL,
  "invoice_discount" REAL DEFAULT NULL,
  "service_charges" REAL DEFAULT NULL,
  "status" INTEGER NOT NULL,
  "is_editable" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT,
  "deleted_at" TEXT DEFAULT NULL,
  "deleted_by" INTEGER DEFAULT NULL
);

-- table: sale_invoices_o
CREATE TABLE IF NOT EXISTS "sale_invoices_o" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "date" TEXT DEFAULT NULL,
  "invoice_no" TEXT NOT NULL,
  "invoice_type" INTEGER NOT NULL,
  "customer_id" INTEGER NOT NULL,
  "description" TEXT,
  "total_invoice_amount" REAL NOT NULL,
  "invoice_remaining_amount_after_pay" REAL NOT NULL,
  "product_net_total" REAL NOT NULL,
  "previous_receivable" REAL DEFAULT '0',
  "paid_amount" REAL DEFAULT '0',
  "amount_received" REAL DEFAULT NULL,
  "cash_return" REAL DEFAULT NULL,
  "invoice_discount" REAL DEFAULT NULL,
  "service_charges" REAL DEFAULT NULL,
  "status" INTEGER NOT NULL,
  "is_editable" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT
);

-- table: sale_return_invoices
CREATE TABLE IF NOT EXISTS "sale_return_invoices" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "date" TEXT DEFAULT NULL,
  "invoice_no" TEXT NOT NULL,
  "invoice_type" INTEGER NOT NULL,
  "customer_id" INTEGER NOT NULL,
  "total_invoice_amount" REAL NOT NULL,
  "invoice_remaining_amount_after_pay" REAL NOT NULL,
  "product_net_total" REAL NOT NULL,
  "previous_receivable" REAL NOT NULL,
  "paid_amount" REAL NOT NULL,
  "amount_received" REAL,
  "cash_return" REAL,
  "invoice_discount" REAL DEFAULT NULL,
  "service_charges" REAL DEFAULT NULL,
  "status" INTEGER NOT NULL,
  "is_editable" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT,
  "deleted_at" TEXT DEFAULT NULL,
  "deleted_by" INTEGER DEFAULT NULL
);

-- table: sale_return_products
CREATE TABLE IF NOT EXISTS "sale_return_products" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "invoice_no" TEXT NOT NULL,
  "sale_return_invoice_id" INTEGER NOT NULL,
  "company_id" INTEGER DEFAULT NULL,
  "product_id" INTEGER NOT NULL,
  "purchase_price" REAL NOT NULL,
  "sale_price" REAL NOT NULL,
  "expiry_date" TEXT NOT NULL,
  "qty" REAL NOT NULL,
  "product_discount" REAL DEFAULT NULL,
  "return_total_amount" REAL NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT,
  "deleted_at" TEXT DEFAULT NULL,
  "deleted_by" INTEGER DEFAULT NULL
);

-- table: states
CREATE TABLE IF NOT EXISTS "states" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "country_id" INTEGER NOT NULL,
  "type" TEXT DEFAULT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT NOT NULL,
  "created_by" INTEGER DEFAULT NULL,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: stock_batches_items
CREATE TABLE IF NOT EXISTS "stock_batches_items" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "batch_id" TEXT NOT NULL,
  "invoice_id" INTEGER,
  "invoice_product_id" INTEGER,
  "vs_id" INTEGER,
  "trx_type" TEXT NOT NULL,
  "company_id" INTEGER DEFAULT NULL,
  "product_id" INTEGER NOT NULL,
  "company_name" TEXT DEFAULT NULL,
  "product_name" TEXT DEFAULT NULL,
  "mfg_date" TEXT NOT NULL,
  "expiry_date" TEXT DEFAULT NULL,
  "qty" INTEGER NOT NULL,
  "actual_qty" INTEGER NOT NULL,
  "actual_status" INTEGER NOT NULL,
  "batch_wise_balance" REAL NOT NULL,
  "total_balance" REAL DEFAULT NULL,
  "unit_cost_price" REAL NOT NULL DEFAULT '0',
  "ttl_cost_price" REAL NOT NULL,
  "avg_cost_price_per_unit" REAL DEFAULT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: stock_batches_items_bk_26_7
CREATE TABLE IF NOT EXISTS "stock_batches_items_bk_26_7" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "batch_id" TEXT NOT NULL,
  "invoice_id" INTEGER,
  "invoice_product_id" INTEGER,
  "vs_id" INTEGER,
  "trx_type" TEXT NOT NULL,
  "company_id" INTEGER DEFAULT NULL,
  "product_id" INTEGER NOT NULL,
  "company_name" TEXT DEFAULT NULL,
  "product_name" TEXT DEFAULT NULL,
  "mfg_date" TEXT NOT NULL,
  "expiry_date" TEXT DEFAULT NULL,
  "qty" INTEGER NOT NULL,
  "actual_qty" INTEGER NOT NULL,
  "actual_status" INTEGER NOT NULL,
  "batch_wise_balance" REAL NOT NULL,
  "total_balance" REAL DEFAULT NULL,
  "unit_cost_price" REAL NOT NULL DEFAULT '0',
  "ttl_cost_price" REAL NOT NULL,
  "avg_cost_price_per_unit" REAL DEFAULT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: stock_batches_items_rebuild_bak_20260723_001500
CREATE TABLE IF NOT EXISTS "stock_batches_items_rebuild_bak_20260723_001500" (
  "id" INTEGER NOT NULL DEFAULT '0',
  "tenant_id" INTEGER DEFAULT NULL,
  "batch_id" TEXT NOT NULL,
  "invoice_id" INTEGER,
  "invoice_product_id" INTEGER,
  "vs_id" INTEGER,
  "trx_type" TEXT NOT NULL,
  "company_id" INTEGER DEFAULT NULL,
  "product_id" INTEGER NOT NULL,
  "company_name" TEXT DEFAULT NULL,
  "product_name" TEXT DEFAULT NULL,
  "mfg_date" TEXT NOT NULL,
  "expiry_date" TEXT DEFAULT NULL,
  "qty" INTEGER NOT NULL,
  "actual_qty" INTEGER NOT NULL,
  "actual_status" INTEGER NOT NULL,
  "batch_wise_balance" REAL NOT NULL,
  "total_balance" REAL DEFAULT NULL,
  "unit_cost_price" REAL NOT NULL DEFAULT '0',
  "ttl_cost_price" REAL NOT NULL,
  "avg_cost_price_per_unit" REAL DEFAULT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: stock_batches_items_rebuild_bak_20260723_001804
CREATE TABLE IF NOT EXISTS "stock_batches_items_rebuild_bak_20260723_001804" (
  "id" INTEGER NOT NULL DEFAULT '0',
  "tenant_id" INTEGER DEFAULT NULL,
  "batch_id" TEXT NOT NULL,
  "invoice_id" INTEGER,
  "invoice_product_id" INTEGER,
  "vs_id" INTEGER,
  "trx_type" TEXT NOT NULL,
  "company_id" INTEGER DEFAULT NULL,
  "product_id" INTEGER NOT NULL,
  "company_name" TEXT DEFAULT NULL,
  "product_name" TEXT DEFAULT NULL,
  "mfg_date" TEXT NOT NULL,
  "expiry_date" TEXT DEFAULT NULL,
  "qty" INTEGER NOT NULL,
  "actual_qty" INTEGER NOT NULL,
  "actual_status" INTEGER NOT NULL,
  "batch_wise_balance" REAL NOT NULL,
  "total_balance" REAL DEFAULT NULL,
  "unit_cost_price" REAL NOT NULL DEFAULT '0',
  "ttl_cost_price" REAL NOT NULL,
  "avg_cost_price_per_unit" REAL DEFAULT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: stock_batches_items_rebuild_bak_20260723_002016
CREATE TABLE IF NOT EXISTS "stock_batches_items_rebuild_bak_20260723_002016" (
  "id" INTEGER NOT NULL DEFAULT '0',
  "tenant_id" INTEGER DEFAULT NULL,
  "batch_id" TEXT NOT NULL,
  "invoice_id" INTEGER,
  "invoice_product_id" INTEGER,
  "vs_id" INTEGER,
  "trx_type" TEXT NOT NULL,
  "company_id" INTEGER DEFAULT NULL,
  "product_id" INTEGER NOT NULL,
  "company_name" TEXT DEFAULT NULL,
  "product_name" TEXT DEFAULT NULL,
  "mfg_date" TEXT NOT NULL,
  "expiry_date" TEXT DEFAULT NULL,
  "qty" INTEGER NOT NULL,
  "actual_qty" INTEGER NOT NULL,
  "actual_status" INTEGER NOT NULL,
  "batch_wise_balance" REAL NOT NULL,
  "total_balance" REAL DEFAULT NULL,
  "unit_cost_price" REAL NOT NULL DEFAULT '0',
  "ttl_cost_price" REAL NOT NULL,
  "avg_cost_price_per_unit" REAL DEFAULT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: stock_batches_items_zero_bak_20260723
CREATE TABLE IF NOT EXISTS "stock_batches_items_zero_bak_20260723" (
  "id" INTEGER NOT NULL DEFAULT '0',
  "tenant_id" INTEGER DEFAULT NULL,
  "batch_id" TEXT NOT NULL,
  "invoice_id" INTEGER,
  "invoice_product_id" INTEGER,
  "vs_id" INTEGER,
  "trx_type" TEXT NOT NULL,
  "company_id" INTEGER DEFAULT NULL,
  "product_id" INTEGER NOT NULL,
  "company_name" TEXT DEFAULT NULL,
  "product_name" TEXT DEFAULT NULL,
  "mfg_date" TEXT NOT NULL,
  "expiry_date" TEXT DEFAULT NULL,
  "qty" INTEGER NOT NULL,
  "actual_qty" INTEGER NOT NULL,
  "actual_status" INTEGER NOT NULL,
  "batch_wise_balance" REAL NOT NULL,
  "total_balance" REAL DEFAULT NULL,
  "unit_cost_price" REAL NOT NULL DEFAULT '0',
  "ttl_cost_price" REAL NOT NULL,
  "avg_cost_price_per_unit" REAL DEFAULT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: stock_transfer_items
CREATE TABLE IF NOT EXISTS "stock_transfer_items" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "stock_transfer_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "qty" REAL NOT NULL,
  "created_at" TEXT DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: stock_transfers
CREATE TABLE IF NOT EXISTS "stock_transfers" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "from_godown_id" INTEGER NOT NULL,
  "to_godown_id" INTEGER NOT NULL,
  "transfer_date" TEXT NOT NULL,
  "reference_no" TEXT DEFAULT NULL,
  "description" TEXT,
  "created_by" INTEGER DEFAULT NULL,
  "created_at" TEXT DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: stocks
CREATE TABLE IF NOT EXISTS "stocks" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "vendor_stock_id" INTEGER NOT NULL,
  "purchase_invoice_id" INTEGER DEFAULT NULL,
  "return_invoice_id" INTEGER DEFAULT NULL,
  "sale_invoice_id" INTEGER DEFAULT NULL,
  "company_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "date" TEXT DEFAULT NULL,
  "product_unit_price" REAL DEFAULT NULL,
  "qty" REAL NOT NULL,
  "amount" REAL NOT NULL,
  "balance" INTEGER NOT NULL,
  "remaining_balance" REAL DEFAULT '0',
  "status" INTEGER NOT NULL,
  "transaction_type" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT
);

-- table: user_backup_mail_settings
CREATE TABLE IF NOT EXISTS "user_backup_mail_settings" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "user_id" INTEGER NOT NULL,
  "gmail" TEXT NOT NULL,
  "app_password_encrypted" TEXT,
  "google_drive_refresh_token_encrypted" TEXT,
  "google_drive_access_token_encrypted" TEXT,
  "google_drive_token_expires_at" TEXT DEFAULT NULL,
  "google_drive_folder_id" TEXT DEFAULT NULL,
  "google_drive_folder_name" TEXT DEFAULT NULL,
  "google_drive_connected_at" TEXT DEFAULT NULL,
  "created_at" TEXT DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- table: vendor_ledger
CREATE TABLE IF NOT EXISTS "vendor_ledger" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "purchase_invoice_id" INTEGER NOT NULL,
  "purchase_return_invoice_id" INTEGER DEFAULT NULL,
  "customer_id" INTEGER NOT NULL,
  "cpv_no" TEXT,
  "crv_no" TEXT,
  "cr" REAL DEFAULT '0',
  "dr" REAL DEFAULT '0',
  "paid_p_return_amount" REAL DEFAULT '0',
  "balance" REAL NOT NULL DEFAULT '0',
  "trx_type" INTEGER DEFAULT '0',
  "comment" TEXT,
  "date" TEXT DEFAULT NULL,
  "is_editable" INTEGER NOT NULL,
  "is_deleted" INTEGER NOT NULL DEFAULT '0',
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" INTEGER NOT NULL,
  "updated_at" TEXT,
  "updated_by" INTEGER DEFAULT NULL
);

-- table: vendor_stock_managment
CREATE TABLE IF NOT EXISTS "vendor_stock_managment" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "vs_id" INTEGER NOT NULL,
  "vendor_id" INTEGER NOT NULL,
  "company_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "company_name" TEXT DEFAULT NULL,
  "product_name" TEXT DEFAULT NULL,
  "purchase_price" REAL DEFAULT NULL,
  "sale_price" REAL DEFAULT NULL,
  "ttl_avg_cost" REAL NOT NULL DEFAULT '0',
  "ttl_cost" REAL NOT NULL DEFAULT '0',
  "ttl_profit" REAL DEFAULT NULL,
  "amount" REAL NOT NULL,
  "balance" REAL NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT
);

-- table: vendor_stock_managment_bk
CREATE TABLE IF NOT EXISTS "vendor_stock_managment_bk" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "vs_id" INTEGER NOT NULL,
  "vendor_id" INTEGER NOT NULL,
  "company_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "company_name" TEXT DEFAULT NULL,
  "product_name" TEXT DEFAULT NULL,
  "purchase_price" REAL DEFAULT NULL,
  "sale_price" REAL DEFAULT NULL,
  "ttl_avg_cost" REAL NOT NULL DEFAULT '0',
  "ttl_cost" REAL NOT NULL DEFAULT '0',
  "ttl_profit" REAL DEFAULT NULL,
  "amount" REAL NOT NULL,
  "balance" REAL NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT
);

-- table: vendor_stocks
CREATE TABLE IF NOT EXISTS "vendor_stocks" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "date" TEXT NOT NULL,
  "invoice_no" TEXT NOT NULL,
  "customer_id" INTEGER,
  "vendor_id" INTEGER DEFAULT NULL,
  "purchase_invoice_id" INTEGER DEFAULT NULL,
  "purchase_return_invoice_id" INTEGER DEFAULT NULL,
  "sale_invoice_id" INTEGER DEFAULT NULL,
  "sale_return_id" INTEGER DEFAULT NULL,
  "product_replacement_invoice_id" INTEGER DEFAULT NULL,
  "company_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "product_unit_price" REAL NOT NULL,
  "total_purchase_amount" REAL NOT NULL DEFAULT '0',
  "sale_unit_price" REAL NOT NULL DEFAULT '0',
  "total_sale_amount" REAL NOT NULL DEFAULT '0',
  "qty" REAL NOT NULL,
  "actual_qty" REAL NOT NULL,
  "amount" REAL NOT NULL,
  "balance" REAL NOT NULL,
  "remaining_balance" REAL DEFAULT NULL,
  "status" INTEGER NOT NULL,
  "actual_status" INTEGER NOT NULL,
  "transaction_type" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT
);

-- table: vendor_stocks_bk
CREATE TABLE IF NOT EXISTS "vendor_stocks_bk" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "vendor_id" INTEGER NOT NULL,
  "invoice_no" TEXT NOT NULL,
  "purchase_invoice_id" INTEGER DEFAULT NULL,
  "purchase_return_invoice_id" INTEGER DEFAULT NULL,
  "sale_invoice_id" INTEGER DEFAULT NULL,
  "sale_return_id" INTEGER DEFAULT NULL,
  "product_replacement_invoice_id" INTEGER DEFAULT NULL,
  "company_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "date" TEXT NOT NULL,
  "product_unit_price" REAL NOT NULL,
  "qty" REAL NOT NULL,
  "amount" REAL NOT NULL,
  "balance" REAL NOT NULL,
  "remaining_balance" REAL DEFAULT NULL,
  "status" INTEGER NOT NULL,
  "transaction_type" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT
);

-- table: vendor_stocks_n
CREATE TABLE IF NOT EXISTS "vendor_stocks_n" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "vendor_id" INTEGER DEFAULT NULL,
  "customer_id" INTEGER,
  "invoice_no" TEXT NOT NULL,
  "purchase_invoice_id" INTEGER DEFAULT NULL,
  "purchase_return_invoice_id" INTEGER DEFAULT NULL,
  "sale_invoice_id" INTEGER DEFAULT NULL,
  "sale_return_id" INTEGER DEFAULT NULL,
  "product_replacement_invoice_id" INTEGER DEFAULT NULL,
  "company_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "date" TEXT NOT NULL,
  "product_unit_price" REAL NOT NULL,
  "qty" REAL NOT NULL,
  "sale_unit_price" REAL NOT NULL DEFAULT '0',
  "total_sale_amount" REAL NOT NULL DEFAULT '0',
  "actual_qty" INTEGER NOT NULL,
  "actual_status" INTEGER NOT NULL,
  "total_purchase_amount" REAL DEFAULT '0',
  "balance" REAL NOT NULL,
  "remaining_balance" REAL DEFAULT NULL,
  "status" INTEGER NOT NULL,
  "transaction_type" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" INTEGER DEFAULT NULL,
  "updated_at" TEXT
);

-- table: vendor_transactions
CREATE TABLE IF NOT EXISTS "vendor_transactions" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "tenant_id" INTEGER DEFAULT NULL,
  "client_id" INTEGER NOT NULL,
  "debit" REAL DEFAULT NULL,
  "credit" REAL DEFAULT NULL,
  "remarks" TEXT,
  "created_at" TEXT DEFAULT NULL,
  "updated_at" TEXT DEFAULT NULL
);

-- schema patches (idempotent via ignore errors at apply time)
-- PATCH:organization:tenant_id
ALTER TABLE "organization" ADD COLUMN "tenant_id" INTEGER;
-- PATCH:organization:print_logo
ALTER TABLE "organization" ADD COLUMN "print_logo" TEXT;
-- PATCH:organization:refund_policy
ALTER TABLE "organization" ADD COLUMN "refund_policy" TEXT;
-- PATCH:organization:purchi_use_dynamic
ALTER TABLE "organization" ADD COLUMN "purchi_use_dynamic" INTEGER DEFAULT 0;
-- PATCH:organization:purchi_config
ALTER TABLE "organization" ADD COLUMN "purchi_config" TEXT;
-- PATCH:users:tenant_id
ALTER TABLE "users" ADD COLUMN "tenant_id" INTEGER;
-- PATCH:customers:tenant_id
ALTER TABLE "customers" ADD COLUMN "tenant_id" INTEGER;
-- PATCH:customers:system_code
ALTER TABLE "customers" ADD COLUMN "system_code" TEXT;
-- PATCH:products:tenant_id
ALTER TABLE "products" ADD COLUMN "tenant_id" INTEGER;

-- seed: local admin (email: admin / password: admin123)
INSERT OR IGNORE INTO "organization" (
  "id","name","phone_number","email","address",
  "city_id","postal_code_id","state_id","country_id","logo_img",
  "created_by","created_at","updated_by","updated_at"
) VALUES (
  1, 'Storeeo Local', '0000000000', 'local@storeeo.app', 'Local offline shop',
  0, 0, 0, 0, '',
  1, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP
);

UPDATE "organization" SET "tenant_id" = 1 WHERE "id" = 1;

INSERT OR IGNORE INTO "users" (
  "id","name","username","email","country",
  "reporting_to","department_id","password","super","active",
  "password_changed","force_logout","created_at","updated_at"
) VALUES (
  1, 'Local Admin', 'admin', 'admin', '0',
  0, 0, '$2y$12$RADti.Q8P.FW6dGZv9uLq.1tCrujCqehEik7Gra93pHok.UIAW3S6', 1, 1,
  0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

UPDATE "users" SET "tenant_id" = 1 WHERE "id" = 1;

COMMIT;
